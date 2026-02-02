export default function AlertTable({ alerts }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mt-6">
      <h2 className="text-lg font-semibold mb-3">Alert</h2>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            <th className="p-2">Id</th>
            <th className="p-2">Type</th>
            <th className="p-2">Message</th>
            <th className="p-2">Location</th>
            <th className="p-2">Issued At</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((a, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="p-2">{a.id}</td>
              <td className="p-2">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {a.type}
                </span>
              </td>
              <td className="p-2">{a.message}</td>
              <td className="p-2">{a.location}</td>
              <td className="p-2 text-blue-600">
                {new Date(a.issued_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
