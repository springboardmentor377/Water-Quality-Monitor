import React from "react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip
} from "recharts";

export default function WaterQualityRadar({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-[550px] flex items-center justify-center text-slate-500 italic bg-slate-900/20 rounded-2xl border border-dashed border-slate-700 p-6 text-center">
            </div>
        );
    }
    const latest = data[data.length - 1];

    const radarData = [
        { subject: 'pH Level', A: latest.ph, fullMark: 14 },
        { subject: 'Disp. Oxygen', A: latest.do, fullMark: 15 },
        { subject: 'Turbidity', A: latest.turbidity, fullMark: 10 },
    ];

    return (
        <div className="w-full h-[550px]" style={{ height: "550px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="90%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="rgba(51, 65, 85, 0.4)" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: "#94a3b8", fontSize: 13, fontWeight: 500 }}
                    />
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 15]}
                        axisLine={false}
                        tick={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.9)",
                            border: "1px solid rgba(51, 65, 85, 0.5)",
                            borderRadius: "16px",
                            backdropFilter: "blur(10px)",
                        }}
                    />
                    <Radar
                        name="Latest Readings"
                        dataKey="A"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.5}
                        strokeWidth={3}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
