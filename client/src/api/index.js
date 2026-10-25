import { request } from './client';

// One small function per backend endpoint, so components never build URLs by hand.
export const authApi = {
  signup: (body) => request('/auth/signup', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/me'),
};

export const usersApi = {
  search: (q) => request('/users/search?q=' + encodeURIComponent(q)),
};

export const groupsApi = {
  list: () => request('/groups'),
  create: (body) => request('/groups', { method: 'POST', body }),
  addMember: (groupId, username) => request(`/groups/${groupId}/members`, { method: 'POST', body: { username } }),
  addExpense: (groupId, body) => request(`/groups/${groupId}/expenses`, { method: 'POST', body }),
  addSettlement: (groupId, body) => request(`/groups/${groupId}/settlements`, { method: 'POST', body }),
  messages: (groupId) => request(`/groups/${groupId}/messages`),
  sendMessage: (groupId, message) => request(`/groups/${groupId}/messages`, { method: 'POST', body: { message } }),
};

export const personalApi = {
  list: () => request('/personal-expenses'),
  create: (body) => request('/personal-expenses', { method: 'POST', body }),
  remove: (id) => request(`/personal-expenses/${id}`, { method: 'DELETE' }),
};

export const settlementsApi = {
  list: () => request('/settlements'),
  confirm: (id) => request(`/settlements/${id}/confirm`, { method: 'POST' }),
  reject: (id) => request(`/settlements/${id}/reject`, { method: 'POST' }),
};

export const analyticsApi = {
  month: (month) => request('/analytics?month=' + encodeURIComponent(month)),
};
