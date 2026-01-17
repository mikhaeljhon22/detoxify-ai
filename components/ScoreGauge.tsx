import React from 'react';

interface ScoreGaugeProps {
  score: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  let colorClass = 'text-green-500';
  let label = 'Safe';
  let bgClass = 'bg-green-100';

  if (score > 30 && score <= 70) {
    colorClass = 'text-yellow-500';
    label = 'Moderate';
    bgClass = 'bg-yellow-100';
  } else if (score > 70) {
    colorClass = 'text-red-500';
    label = 'Toxic';
    bgClass = 'bg-red-100';
  }

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Toxicity Score</h3>
      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-slate-100"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${colorClass} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${colorClass}`}>{score}</span>
          <span className={`text-xs font-medium uppercase mt-1 px-2 py-0.5 rounded ${bgClass} ${colorClass}`}>
            {label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;