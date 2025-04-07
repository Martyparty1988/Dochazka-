import { useState } from 'react';
import Timer from './components/Timer';
import WorkRecords from './components/WorkRecords';
import Finances from './components/Finances';
import Debts from './components/Debts';
import Settings from './components/Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState('timer');

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4 flex justify-around">
        <button onClick={() => setActiveTab('timer')} className={activeTab === 'timer' ? 'font-bold' : ''}>Časovač</button>
        <button onClick={() => setActiveTab('records')} className={activeTab === 'records' ? 'font-bold' : ''}>Výkazy</button>
        <button onClick={() => setActiveTab('finances')} className={activeTab === 'finances' ? 'font-bold' : ''}>Finance</button>
        <button onClick={() => setActiveTab('debts')} className={activeTab === 'debts' ? 'font-bold' : ''}>Dluhy</button>
        <button onClick={() => setActiveTab('settings')} className={activeTab === 'settings' ? 'font-bold' : ''}>Nastavení</button>
      </nav>
      <main className="p-4">
        {activeTab === 'timer' && <Timer />}
        {activeTab === 'records' && <WorkRecords />}
        {activeTab === 'finances' && <Finances />}
        {activeTab === 'debts' && <Debts />}
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  );
}