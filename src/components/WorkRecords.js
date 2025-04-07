import { useStore } from '../store/useStore';
import { formatTime } from '../utils/timeUtils';

export default function WorkRecords() {
  const { workRecords } = useStore();

  return (
    <div className="p-4 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Pracovní výkazy</h1>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Datum</th>
            <th className="p-2">Osoba</th>
            <th className="p-2">Kategorie</th>
            <th className="p-2">Začátek</th>
            <th className="p-2">Konec</th>
            <th className="p-2">Pauza</th>
            <th className="p-2">Odpracováno</th>
            <th className="p-2">Výdělek</th>
          </tr>
        </thead>
        <tbody>
          {workRecords.map((record) => (
            <tr key={record.id} className="border-b">
              <td className="p-2">{record.start.split(' ')[0]}</td>
              <td className="p-2">{record.person}</td>
              <td className="p-2">{record.category}</td>
              <td className="p-2">{record.start}</td>
              <td className="p-2">{record.end}</td>
              <td className="p-2">{record.pause}</td>
              <td className="p-2">{formatTime(record.worked * 60000)}</td>
              <td className="p-2">{record.earnings} Kč</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}