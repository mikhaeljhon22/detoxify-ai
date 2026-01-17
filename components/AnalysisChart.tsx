import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { AnalysisResult } from '../types';

interface AnalysisChartProps {
  data: AnalysisResult;
}

const AnalysisChart: React.FC<AnalysisChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Hate', value: data.categories.hateSpeech ? 100 : 10, fill: '#ef4444' },
    { name: 'Harass', value: data.categories.harassment ? 100 : 10, fill: '#f97316' },
    { name: 'Sexual', value: data.categories.sexualContent ? 100 : 10, fill: '#eab308' },
    { name: 'Danger', value: data.categories.dangerousContent ? 100 : 10, fill: '#84cc16' },
    { name: 'Insult', value: data.categories.insult ? 100 : 10, fill: '#a855f7' },
  ];

  return (
    <div className="h-64 w-full mt-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Category Breakdown</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={50} />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const isDetected = payload[0].value === 100;
                return (
                  <div className="bg-slate-800 text-white p-2 rounded text-xs shadow-lg">
                    <p>{`${payload[0].payload.name}: ${isDetected ? 'DETECTED' : 'Safe'}`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.value === 100 ? entry.fill : '#e2e8f0'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalysisChart;