# Manual acceptance checklist

- [ ] Create an account with a unique username; try signing up with the same username again.
- [ ] Log out and log back in with username and password.
- [ ] Create a group with two existing usernames.
- [ ] Attempt a group with a misspelled username and confirm no group is created.
- [ ] Add a new member to an existing group.
- [ ] Record an expense split between all members, then another split with only selected members.
- [ ] Check that balances and suggested debts update.
- [ ] Add a personal expense and confirm it appears only in Personal expenses and Analytics.
- [ ] Register a settlement, log in as the recipient, confirm it, and check that balances update.
- [ ] Reject a pending settlement and confirm balances do not change.
- [ ] Send a group chat message and verify it persists after page reload.
- [ ] Export personal expenses as CSV.

## Automated tests
Run `npm test` from the project root. It checks split maths, balance maths and the full signup → group → expense → settlement flow against a temporary database (your real data is never touched).
