import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart
} from 'recharts';
import { AggregatedYearlyData } from '../types';

interface AnnualCostChartProps {
  data: AggregatedYearlyData[];
}

export const AnnualCostChart: React.FC<AnnualCostChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  // グラフ用にデータを整形
  const chartData = data.map(item => ({
    year: `${item.year}年`,
    'パターンA (変更案)': Math.round(item.A.total),
    'パターンB (現行制度)': Math.round(item.B.total),
    '差額': Math.round(item.A.total - item.B.total)
  }));

  const formatYAxis = (tickItem: number) => {
    return `${(tickItem / 10000).toLocaleString()}万円`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-md rounded-md text-sm">
          <p className="font-bold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-1">
              <span style={{ color: entry.color }}>{entry.name}:</span>
              <span className="font-semibold">{entry.value.toLocaleString()} 千円</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
        将来の退職金費用シミュレーション (DBO予測)
      </h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 12, fill: '#64748b' }} 
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={formatYAxis} 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="パターンB (現行制度)" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={50} />
            <Bar dataKey="パターンA (変更案)" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
            <Line type="monotone" dataKey="差額" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-xs text-slate-500 bg-slate-50 p-3 rounded-md">
        <p>※ 棒グラフは各年度の退職金支給見込額（千円）を示しています。</p>
        <p>※ 赤い折れ線は「変更案 - 現行制度」の差額を示しています。プラスの場合は変更案の方が費用が高く、マイナスの場合は費用が抑えられていることを意味します。</p>
      </div>
    </div>
  );
};
