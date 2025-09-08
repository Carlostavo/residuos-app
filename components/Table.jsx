export default function Table({ columns = [], data = [] }){
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(c => <th key={c} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{c}</th>)}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((row, idx) => (
            <tr key={row.id || idx} className="hover:bg-gray-50">
              {columns.map((c,i) => <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{String(row[c] ?? '')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
