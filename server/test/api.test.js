// End-to-end test of the main money flow against a real (temporary) server.
const test = require('node:test');
const assert = require('node:assert/strict');
const os = require('os');
const path = require('path');
const fs = require('fs');

// Use a throwaway database file - set BEFORE the app is loaded.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'splitsmart-'));
process.env.DB_FILE = path.join(tmp, 'data.json');

const app = require('../src/app');

let server;
let base;
test.before(async () => {
  server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://localhost:${server.address().port}/api`;
});
test.after(() => {
  server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
});

async function call(method, url, body, token) {
  const res = await fetch(base + url, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, data: await res.json() };
}

test('signup, groups, expenses, settlement confirm flow', async () => {
  const a = (await call('POST', '/auth/signup', { name: 'Asha', username: 'asha', email: 'a@x.com', password: 'password1' })).data;
  const b = (await call('POST', '/auth/signup', { name: 'Ben', username: 'ben', email: 'b@x.com', password: 'password2' })).data;
  assert.ok(a.token && b.token);

  // duplicate username rejected
  const dup = await call('POST', '/auth/signup', { name: 'X', username: 'ASHA', email: 'z@x.com', password: 'password1' });
  assert.equal(dup.status, 400);

  // unknown username -> group not created
  const bad = await call('POST', '/groups', { name: 'Trip', usernames: ['nobody'] }, a.token);
  assert.equal(bad.status, 400);
  assert.deepEqual(bad.data.missing, ['nobody']);

  const { group } = (await call('POST', '/groups', { name: 'Goa Trip', usernames: ['@ben'] }, a.token)).data;
  assert.equal(group.members.length, 2);

  // Asha pays Rs 1000, split equally
  await call('POST', `/groups/${group.id}/expenses`, { description: 'Hotel', amount: 1000, paidBy: a.user.id }, a.token);
  let g = (await call('GET', `/groups/${group.id}`, null, b.token)).data.group;
  assert.equal(g.balances[b.user.id], -50000);
  assert.equal(g.debts.length, 1);

  // Ben registers a payment; balance unchanged until Asha confirms
  const pay = (await call('POST', `/groups/${group.id}/settlements`, { toUser: a.user.id, amount: 500, method: 'upi' }, b.token)).data.settlement;
  g = (await call('GET', `/groups/${group.id}`, null, b.token)).data.group;
  assert.equal(g.balances[b.user.id], -50000);

  // Ben cannot confirm his own payment
  assert.equal((await call('POST', `/settlements/${pay.id}/confirm`, null, b.token)).status, 403);
  assert.equal((await call('POST', `/settlements/${pay.id}/confirm`, null, a.token)).status, 200);
  g = (await call('GET', `/groups/${group.id}`, null, b.token)).data.group;
  assert.equal(g.balances[b.user.id], 0);

  // chat + analytics + auth guard
  await call('POST', `/groups/${group.id}/messages`, { message: 'hi' }, a.token);
  const msgs = (await call('GET', `/groups/${group.id}/messages`, null, b.token)).data.messages;
  assert.equal(msgs[0].user.name, 'Asha');
  const an = (await call('GET', '/analytics?month=' + new Date().toISOString().slice(0, 7), null, a.token)).data;
  assert.equal(an.paidSharedTotal, 100000);
  assert.equal((await call('GET', '/groups')).status, 401);
  assert.equal((await call('GET', '/nope', null, a.token)).status, 404);
});
