import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

export default function Debts() {
  const { debts, addDebt, updateDebt, settings, workRecords } = useStore();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('CZK');
  const [person, setPerson] = useState('Maru');

  useEffect(() => {
    const today = new Date().getDate();
    if (today === settings.rent.day && !debts.some((d) => d.name === 'Nájem' && new Date(d.created).getMonth() === new Date().getMonth())) {
      addDebt({
        id: Date.now(),
        person: 'Společné',
        name: 'Nájem',
        amount: settings.rent.amount,
        currency: 'CZK',
        paid: 0,
        created: new Date().toLocaleString('cs-CZ'),
      });
    }

    const totalEarnings = workRecords.reduce((acc, rec) => ({
      Maru: acc.Maru + (rec.person === 'Maru' ? rec.earnings : 0),
      Marty: acc.Marty + (rec.person === 'Marty' ? rec.earnings : 0),
    }), { Maru: 0, Marty: 0 });

    debts.forEach((debt) => {
      if (debt.paid < debt.amount) {
        const deduction = debt.person === 'Maru' ? totalEarnings.Maru * settings.deductions.Maru : totalEarnings.Marty * settings.deductions.Marty;
        const payment = Math.min(deduction, debt.amount - debt.paid);
        if (payment > 0) {
          updateDebt(debt.id, { paid: debt.paid + payment });
        }
      }
    });
  }, [workRecords, debts, settings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    addDebt({
      id: Date.now(),
      person,
      name,
      amount: parseFloat(amount),
      currency,
      paid: 0,
      created: new Date().toLocaleString('cs-CZ'),
    });
    setName('');
    setAmount('');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dluhy a splátky</h1>
      <form onSubmit={handleSubmit} className="mb-4 max-w-md">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Název dluhu"
          className="mb-2 p-2 border rounded w-full"
          required
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Částka"
          className="mb-2 p-2 border rounded w-full"
          required
        />
        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="mb-2 p-2 border rounded w-full">
          <option value="CZK">CZK</option>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
        </select>
        <select value={person} onChange={(e) => setPerson(e.target.value)} className="mb-2 p-2 border rounded w-full">
          <option value="Maru">Maru</option>
          <option value="Marty">Marty</option>
          <option value="Společné">Společné</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Přidat dluh</button>
      </form>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Osoba</th>
            <th className="p-2">Název</th>
            <th className="p-2">Částka</th>
            <th className="p-2">Měna</th>
            <th className="p-2">Zaplaceno</th>
            <th className="p-2">Vytvořeno</th>
          </tr>
        </thead>
        <tbody>
          {debts.map((debt) => (
            <tr key={debt.id} className="border-b">
              <td className="p-2">{debt.person}</td>
              <td className="p-2">{debt.name}</td>
              <td className="p-2">{debt.amount}</td>
              <td className="p-2">{debt.currency}</td>
              <td className="p-2">{debt.paid}</td>
              <td className="p-2">{debt.created}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}