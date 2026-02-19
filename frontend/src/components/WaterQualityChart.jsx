import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function WaterQualityChart({ data }) {
    // Helper to format time from 24h to 12h
    const formatTime = (timeStr) => {
        if (!timeStr || !timeStr.includes(':')) return timeStr;
        try {
            const [hours, minutes] = timeStr.split(':');
            let hour = parseInt(hours, 10);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            hour = hour % 12;
            hour = hour ? hour : 12; // the hour '0' should be '12'
            return `${hour}:${minutes} ${ampm}`;
        } catch (e) {
            return timeStr;
        }
    };

    if (!data || data.length === 0) {
        return (
            <div className="w-full h-[550px] flex items-center justify-center text-slate-500 italic bg-slate-900/20 rounded-2xl border border-dashed border-slate-700">
            </div>
        );
    }

    return (
        <div
            className="w-full h-[550px]"
            style={{
                height: "550px",
                width: "100%",
            }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 40,
                        left: 80,
                        bottom: 90,
                    }}
                >
                    <defs>
                        <filter id="shadow" height="200%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                            <feOffset dx="0" dy="4" result="offsetblur" />
                            <feComponentTransfer>
                                <feFuncA type="linear" slope="0.5" />
                            </feComponentTransfer>
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis
                        dataKey="time"
                        stroke="#94a3b8"
                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                        tickFormatter={formatTime}
                        axisLine={true}
                        tickLine={false}
                        dy={15}
                        interval={1} // Shows every 2nd tick (every 10 minutes) for readability
                        // Adjusting X-axis label position to be more centered
                        label={{ value: 'Time of Reading (Local)', position: 'insideBottom', offset: -60, fill: '#94a3b8', fontSize: 14, fontWeight: 600 }}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
                        axisLine={true}
                        tickLine={false}
                        dx={-10}
                        // Moving Y-axis label to center-left
                        label={{ value: 'Parameter Value (pH/DO/NTU)', angle: -90, position: 'insideLeft', offset: 10, style: { textAnchor: 'middle' }, fill: '#94a3b8', fontSize: 14, fontWeight: 600 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.9)",
                            border: "1px solid rgba(51, 65, 85, 0.5)",
                            borderRadius: "16px",
                            color: "#fff",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                            backdropFilter: "blur(10px)",
                            padding: "15px"
                        }}
                        itemStyle={{ padding: "4px 0" }}
                    />
                    <Legend
                        wrapperStyle={{ paddingTop: '60px', paddingBottom: '20px' }}
                        iconType="circle"
                        iconSize={10}
                        verticalAlign="bottom"
                    />
                    <Line
                        type="monotone"
                        dataKey="ph"
                        name="pH Level"
                        stroke="#3b82f6"
                        strokeWidth={4}
                        dot={{ r: 6, fill: "#3b82f6", strokeWidth: 2, stroke: "#0f172a" }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                        filter="url(#shadow)"
                    />
                    <Line
                        type="monotone"
                        dataKey="do"
                        name="Dissolved Oxygen"
                        stroke="#10b981"
                        strokeWidth={4}
                        dot={{ r: 6, fill: "#10b981", strokeWidth: 2, stroke: "#0f172a" }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                        filter="url(#shadow)"
                    />
                    <Line
                        type="monotone"
                        dataKey="turbidity"
                        name="Turbidity"
                        stroke="#f59e0b"
                        strokeWidth={4}
                        dot={{ r: 6, fill: "#f59e0b", strokeWidth: 2, stroke: "#0f172a" }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                        filter="url(#shadow)"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
