// Builds a CSV from personal expenses and triggers a download in the browser.
export function downloadPersonalCsv(expenses) {
  const rows = [
    ['Description', 'Category', 'Date', 'Amount (INR)'],
    ...expenses.map((e) => [e.description, e.category, e.date, (e.amount / 100).toFixed(2)]),
  ];
  const csv = rows.map((r) => r.map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'splitsmart-personal-expenses.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}
