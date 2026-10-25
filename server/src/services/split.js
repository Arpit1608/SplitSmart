const { badRequest } = require('../utils/httpError');
const { toPaise } = require('../utils/helpers');

/** Equal split of `total` paise between `userIds`. Leftover paise go to the first few people. */
function equalSplits(total, userIds) {
  const base = Math.floor(total / userIds.length);
  const remainder = total % userIds.length;
  return userIds.map((userId, i) => ({ userId, amount: base + (i < remainder ? 1 : 0) }));
}

/** Custom split: `customShares` is { userId: rupees }. Must add up exactly to the total. */
function customSplits(total, userIds, customShares) {
  const invalid =
    !customShares || userIds.some((uid) => !Number.isFinite(Number(customShares[uid])) || Number(customShares[uid]) < 0);
  if (invalid) throw badRequest('Enter a valid share for each selected person.');

  const splits = userIds.map((userId) => ({ userId, amount: toPaise(customShares[userId]) }));
  if (splits.reduce((sum, s) => sum + s.amount, 0) !== total) {
    throw badRequest('Custom shares must add up exactly to the expense total.');
  }
  return splits;
}

module.exports = { equalSplits, customSplits };
