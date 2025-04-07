export function exportToCSV(data, filename) {
  const csvRows = [];
  const headers = ['Sekce,ID,Osoba,Název,Částka,Měna,Datum,Popis,Typ,Kategorie,Začátek,Konec,Pauza,Odpracováno,Výdělek,Zaplaceno,Vytvořeno'];
  csvRows.push(headers.join(','));

  data.workRecords.forEach((record) => {
    const row = [
      'Pracovní výkazy',
      record.id,
      record.person,
      '',
      '',
      'CZK',
      record.start.split(' ')[0],
      '',
      '',
      record.category,
      record.start,
      record.end,
      record.pause,
      record.worked,
      record.earnings,
      '',
      '',
    ];
    csvRows.push(row.join(','));
  });

  data.finances.forEach((entry) => {
    const row = [
      'Finance',
      entry.id,
      '',
      '',
      entry.amount,
      entry.currency,
      entry.date,
      entry.description,
      entry.type,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ];
    csvRows.push(row.join(','));
  });

  data.debts.forEach((debt) => {
    const row = [
      'Dluhy',
      debt.id,
      debt.person,
      debt.name,
      debt.amount,
      debt.currency,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      debt.paid,
      debt.created,
    ];
    csvRows.push(row.join(','));
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  a.click();
}