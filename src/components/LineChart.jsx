import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from './Card';

export default function UserGrowthChart({
    data = sampleData,
    title = "User Growth Over 12 Months",
    height = "h-96",
    width = "w-full",
    lineColor = "#0000FF"
}) {
    return (
        <Card height={height} width={width} className="p-4 border-transparent">
            <h2 className="text-xl font-semibold text-center mb-4">{title}</h2>
            <div className="w-full h-full" style={{ minHeight: "320px" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 20,
                            bottom: 85, // Increased from 50 to 80 to provide more space for x-axis labels
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            dataKey="month"
                            angle={-45}
                            textAnchor="end"
                            height={70}
                            tick={{ fontSize: 12 }}
                            tickMargin={10} // Added extra margin for the ticks
                        />
                        <YAxis
                            label={{
                                value: 'Number of Users',
                                angle: -90,
                                position: 'insideLeft',
                                style: { textAnchor: 'middle' }
                            }}
                        />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="users"
                            stroke={lineColor}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}