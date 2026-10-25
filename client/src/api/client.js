const TOKEN_KEY = 'ss_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY) || '';
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

/** Every API call goes through here: adds the login token and turns errors into Error(message). */
export async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = 'Bearer ' + token;

  let res;
  try {
    res = await fetch('/api' + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch {
    throw new Error('Could not connect to SplitSmart server. Is it running?');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Token expired / server restarted: tell the app to show the login screen.
    if (res.status === 401 && token) window.dispatchEvent(new Event('splitsmart:unauthorized'));
    throw new Error(data.error || 'Something went wrong.');
  }
  return data;
}
