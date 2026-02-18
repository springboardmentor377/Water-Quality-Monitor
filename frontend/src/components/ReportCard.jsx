import React from 'react';

const ReportCard = ({ report }) => {
  const statusColor = report.status === 'verified' ? 'text-green-600' : report.status === 'rejected' ? 'text-red-600' : 'text-yellow-600';
  
  return (
    <div className="bg-white p-6 rounded-lg shadow border flex gap-6">
      <div className="w-32 h-32 bg-gray-200 rounded overflow-hidden">
        {report.photo_url ? <img src={report.photo_url} alt="pollution" className="object-cover w-full h-full" /> : <div className="flex items-center h-full justify-center text-gray-400">No Image</div>}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold">{report.station_name}</h3>
        <p className="text-gray-500 italic">{report.location}</p>
        <p className="mt-2 text-gray-700">{report.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm font-medium">Source: {report.water_source}</span>
          <span className={`font-bold uppercase text-xs ${statusColor}`}>{report.status}</span>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;