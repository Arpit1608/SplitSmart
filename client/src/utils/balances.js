// How much the user owes / is owed, summed across all groups.
export function totalOwed(groups, userId) {
  let owed = 0;
  let gets = 0;
  for (const g of groups) {
    const net = g.balances[userId] || 0;
    if (net < 0) owed -= net;
    else gets += net;
  }
  return { owed, gets };
}
