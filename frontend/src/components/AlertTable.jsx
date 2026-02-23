<<<<<<< HEAD
import React from 'react';
import { AlertCircle, AlertTriangle, Info, MapPin, Clock } from 'lucide-react';

export default function AlertTable({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-slate-800/20 rounded-2xl border border-dashed border-slate-700 p-8 text-center">
        <div className="flex justify-center mb-3">
          <Info className="text-slate-500 w-8 h-8" />
        </div>
        <p className="text-slate-400 font-medium">No active alerts for the selected station</p>
        <p className="text-slate-500 text-sm">Water quality is within normal parameters</p>
      </div>
    );
  }

  const getAlertIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'critical': return <AlertCircle className="text-red-500 w-5 h-5" />;
      case 'warning': return <AlertTriangle className="text-yellow-500 w-5 h-5" />;
      default: return <Info className="text-blue-500 w-5 h-5" />;
    }
  };

  const getSeverityStyle = (type) => {
    switch (type.toLowerCase()) {
      case 'critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'warning': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Active Monitoring Alerts
          <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full border border-blue-500/30">
            Live
          </span>
        </h2>
      </div>

      <div className="grid gap-3">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`flex items-start gap-4 p-4 rounded-2xl border backdrop-blur-sm transition-all hover:scale-[1.01] ${getSeverityStyle(alert.type)}`}
          >
            <div className="mt-0.5">
              {getAlertIcon(alert.type)}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold uppercase tracking-wider text-[10px]">
                  {alert.type} Alert
                </span>
                <div className="flex items-center gap-1 text-[10px] opacity-70">
                  <Clock className="w-3 h-3" />
                  {new Date(alert.issued_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              <h3 className="text-white font-semibold text-base mb-1">
                {alert.message}
              </h3>

              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs opacity-80">
                  <MapPin className="w-3 h-3" />
                  {alert.location}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
=======
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
>>>>>>> origin/main
