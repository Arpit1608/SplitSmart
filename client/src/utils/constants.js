export const CATEGORIES = [
  'Food', 'Drinks', 'Cafe', 'Groceries', 'Transport', 'Shopping',
  'Outing', 'Bills', 'Travel', 'Entertainment', 'Health', 'Other',
];

export const CATEGORY_ICONS = { Food: '🍜', Cafe: '☕', Travel: '✈', Transport: '🚕', Shopping: '🛍' };
export const categoryIcon = (category) => CATEGORY_ICONS[category] || '✦';

// Sidebar / mobile navigation. `end` = only highlight on an exact URL match.
export const NAV_ITEMS = [
  { to: '/', icon: '⌂', label: 'Overview', short: 'Home', eyebrow: 'YOUR MONEY, MADE SIMPLE', end: true },
  { to: '/groups', icon: '◫', label: 'Your groups', short: 'Groups', eyebrow: 'SHARED SPACES' },
  { to: '/expenses', icon: '↗', label: 'Personal expenses', short: 'Expenses', eyebrow: 'JUST FOR YOU' },
  { to: '/insights', icon: '▥', label: 'Spending insights', short: 'Insights', eyebrow: 'THE BIG PICTURE' },
  { to: '/settlements', icon: '⇄', label: 'Settlements', short: 'Settle', eyebrow: 'CLEAR THE TAB' },
];
export const SETTINGS_ITEM = { to: '/settings', icon: '⚙', label: 'Profile & settings', eyebrow: 'YOUR ACCOUNT' };
