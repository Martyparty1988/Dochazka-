import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { calculateEarnings, formatTime } from '../utils/timeUtils';

export default function Timer() {
  const { timer, startTimer, pauseTimer, resumeTimer, stopTimer, settings } = useStore();
  const [currentTime, setCurrentTime] = useState(0);
  const [person, setPerson] = useState('Maru');
  const [category, setCategory] = useState(settings.categories[0]);

  useEffect(() => {
    let interval;
    if (timer.running && timer.startTime) {
      interval = setInterval(() => {
        setCurrentTime(Date.now() - timer.startTime - timer.totalPaused);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleStop = () => {
    const endTime = Date.now();
    const workedMinutes = Math.floor((endTime - timer.startTime - timer.totalPaused) / 60000);
    const earnings = calculateEarnings(person, workedMinutes, settings.rates);
    stopTimer({
      id: Date.now(),
      person,
      category,
      start: new Date(timer.startTime).toLocaleString('cs-CZ'),
      end: new Date(endTime).toLocaleString('cs-CZ'),
      pause: formatTime(timer.totalPaused),
      worked: workedMinutes,
      earnings,
    });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Časovač práce</h1>
      <div className="text-4xl font-mono mb-4">{formatTime(currentTime)}</div>
      <select value={person} onChange={(e) => setPerson(e.target.value)} className="mb-2 p-2 border rounded w-full">
        <option value="Maru">Maru</option>
        <option value="Marty">Marty</option>
      </select>
      <select value={category} onChange={(e) => setCategory(e.target.value)} className="mb-2 p-2 border rounded w-full">
        {settings.categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <div className="flex gap-2">
        {!timer.running && !timer.startTime && (
          <button onClick={() => startTimer()} className="bg-green-500 text-white p-2 rounded">Spustit</button>
        )}
        {timer.running && (
          <button onClick={pauseTimer} className="bg-yellow-500 text-white p-2 rounded">Pauza</button>
        )}
        {!timer.running && timer.startTime && (
          <button onClick={resumeTimer} className="bg-green-500 text-white p-2 rounded">Pokračovat</button>
        )}
        {timer.startTime && (
          <button onClick={handleStop} className="bg-red-500 text-white p-2 rounded">Zastavit</button>
        )}
      </div>
    </div>
  );
}