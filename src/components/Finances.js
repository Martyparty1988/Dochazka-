import { useState } from 'react';
import { useStore } from '../store/useStore';

export default function Finances() {
  const { finances, addFinance } = useStore();
  const [type, setType] = useState('příjem');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('CZK');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addFinance({
      id: Date.now(),
      type,
      amount: parseFloat(amount),
      currency,
      date: new Date().toLocaleString('cs-CZ'),
      description,
    });
    setAmount('');
    setDescription('');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Finance</h1>
      <form onSubmit={handleSubmit} className="mb-4 max-w-md">
        <select value={type} onChange={(e) => setType(e.target.value)} className="mb-2 p-2 border rounded w-full">
          <option value="příjem">Příjem</option>
          <option value="výdaj">Výdaj</option>
        </select>
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
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Popis"
          className="mb-2 p-2 border rounded w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Přidat</button>
      </form>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Typ</th>
            <th className="p-2">Částka</th>
            <th className="p-2">Měna</th>
            <th className="p-2">Datum</th>
            <th className="p-2">Popis</th>
          </tr>
        </thead>
        <tbody>
          {finances.map((entry) => (
            <tr key={entry.id} className="border-b">
              <td className="p-2">{entry.type}</td>
              <td className="p-2">{entry.amount}</td>
              <td className="p-2">{entry.currency}</td>
              <td className="p-2">{entry.date}</td>
              <td className="p-2">{entry.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}