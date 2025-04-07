import { useState } from 'react';
import { useStore } from '../store/useStore';
import { exportToCSV } from '../utils/dataExport';

export default function Settings() {
  const { settings, setSettings, workRecords, finances, debts } = useStore();
  const [newCategory, setNewCategory] = useState('');
  const [rentAmount, setRentAmount] = useState(settings.rent.amount);
  const [rentDay, setRentDay] = useState(settings.rent.day);
  const [maruRate, setMaruRate] = useState(settings.rates.Maru);
  const [martyRate, setMartyRate] = useState(settings.rates.Marty);

  const handleAddCategory = () => {
    if (newCategory && !settings.categories.includes(newCategory)) {
      setSettings({ categories: [...settings.categories, newCategory] });
      setNewCategory('');
    }
  };

  const handleSaveSettings = () => {
    setSettings({
      rent: { amount: parseFloat(rentAmount), day: parseInt(rentDay) },
      rates: { Maru: parseFloat(maruRate), Marty: parseFloat(martyRate) },
    });
  };

  const handleExport = () => {
    exportToCSV({ workRecords, finances, debts }, 'data_export.csv');
  };

  return (
    <div className="p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Nastavení</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Kategorie</h2>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nová kategorie"
          className="mb-2 p-2 border rounded w-full"
        />
        <button onClick={handleAddCategory} className="bg-blue-500 text-white p-2 rounded">Přidat</button>
        <ul className="mt-2">
          {settings.categories.map((cat) => (
            <li key={cat}>{cat}</li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Nájem</h2>
        <input
          type="number"
          value={rentAmount}
          onChange={(e) => setRentAmount(e.target.value)}
          placeholder="Částka"
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          type="number"
          value={rentDay}
          onChange={(e) => setRentDay(e.target.value)}
          placeholder="Den v měsíci"
          className="mb-2 p-2 border rounded w-full"
        />
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Sazby</h2>
        <label className="block mb-2">Maru:</label>
        <input
          type="number"
          value={maruRate}
          onChange={(e) => setMaruRate(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
        />
        <label className="block mb-2">Marty:</label>
        <input
          type="number"
          value={martyRate}
          onChange={(e) => setMartyRate(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
        />
      </div>
      <button onClick={handleSaveSettings} className="bg-green-500 text-white p-2 rounded mb-4">Uložit nastavení</button>
      <button onClick={handleExport} className="bg-gray-500 text-white p-2 rounded">Export do CSV</button>
    </div>
  );
}