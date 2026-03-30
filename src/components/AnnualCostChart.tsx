import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart,
  AreaChart, Area, LineChart
} from 'recharts';
import { AggregatedYearlyData } from '../types';

interface AnnualCostChartProps {
  data: AggregatedYearlyData[];
}

export const AnnualCostChart: React.FC<AnnualCostChartProps> = ({ data }) => {
  const [chartType, setChartType] = useState<'bar' | 'area' | 'line'>('bar');
  const [viewPattern, setViewPattern] = useState<'A' | 'B'>('A');

  if (!data || data.length === 0) {
    return null;
  }

  // グラフ用にデータを整形
  const chartData = data.map(item => ({
    year: `${item.year}年`,
    'パターンB_旧制度①': Math.round(item.B.type1),
    'パターンB_旧制度②': Math.round(item.B.type2),
    'パターンB_旧制度③': Math.round(item.B.type3),
    'パターンB_新制度': Math.round(item.B.type4),
    'パターンA_旧制度①': Math.round(item.A.type1),
    'パターンA_旧制度②': Math.round(item.A.type2),
    'パターンA_旧制度③': Math.round(item.A.type3),
    'パターンA_新制度': Math.round(item.A.type4),
    'パターンB (現行制度)': Math.round(item.B.total),
    'パターンA (変更案)': Math.round(item.A.total),
    '差額': Math.round(item.A.total - item.B.total)
  }));

  const formatYAxis = (tickItem: number) => {
    return `${(tickItem / 10000).toLocaleString()}万円`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      if (chartType === 'bar') {
        // 差額と合計を抽出 (棒グラフ用)
        const diffPayload = payload.find((p: any) => p.dataKey === '差額');
        const totalB = payload[0]?.payload['パターンB (現行制度)'] || 0;
        const totalA = payload[0]?.payload['パターンA (変更案)'] || 0;

        // BとAの構成要素を抽出
        const bItems = payload.filter((p: any) => p.dataKey.startsWith('パターンB_') && p.value > 0);
        const aItems = payload.filter((p: any) => p.dataKey.startsWith('パターンA_') && p.value > 0);

        return (
          <div className="bg-white p-4 border border-slate-200 shadow-lg rounded-lg text-sm min-w-[280px]">
            <p className="font-bold text-lg border-b pb-2 mb-3">{label}</p>
            
            <div className="grid grid-cols-2 gap-4">
              {/* パターンB */}
              <div>
                <p className="font-bold text-slate-700 mb-1">現行制度: {totalB.toLocaleString()}千円</p>
                <div className="space-y-1 pl-2 border-l-2 border-slate-300">
                  {bItems.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center justify-between gap-2 text-xs">
                      <span style={{ color: entry.color }}>{entry.name.replace('パターンB_', '')}:</span>
                      <span className="font-semibold">{entry.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* パターンA */}
              <div>
                <p className="font-bold text-blue-700 mb-1">変更案: {totalA.toLocaleString()}千円</p>
                <div className="space-y-1 pl-2 border-l-2 border-blue-300">
                  {aItems.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center justify-between gap-2 text-xs">
                      <span style={{ color: entry.color }}>{entry.name.replace('パターンA_', '')}:</span>
                      <span className="font-semibold">{entry.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {diffPayload && (
              <div className="mt-3 pt-2 border-t flex justify-between items-center font-bold text-red-600">
                <span>差額 (変更案 - 現行制度):</span>
                <span>{diffPayload.value > 0 ? '+' : ''}{diffPayload.value.toLocaleString()} 千円</span>
              </div>
            )}
          </div>
        );
      } else {
        // 面グラフ・折れ線グラフ用 (単一パターン)
        const total = payload.reduce((sum: number, p: any) => sum + p.value, 0);
        const patternName = viewPattern === 'A' ? '変更案' : '現行制度';
        
        return (
          <div className="bg-white p-4 border border-slate-200 shadow-lg rounded-lg text-sm min-w-[200px]">
            <p className="font-bold text-lg border-b pb-2 mb-3">{label}</p>
            {chartType === 'area' && (
              <p className="font-bold text-slate-700 mb-2">
                {patternName} 合計: {total.toLocaleString()}千円
              </p>
            )}
            <div className="space-y-1 pl-2 border-l-2 border-slate-300">
              {payload.map((entry: any, index: number) => (
                <div key={index} className="flex items-center justify-between gap-4 text-xs">
                  <span style={{ color: entry.color }}>{entry.name.replace(/パターン[AB]_/, '')}:</span>
                  <span className="font-semibold">{entry.value.toLocaleString()} 千円</span>
                </div>
              ))}
            </div>
          </div>
        );
      }
    }
    return null;
  };

  // カスタム凡例 (棒グラフ用)
  const renderBarLegend = () => {
    return (
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs mt-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-600">現行制度:</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 inline-block bg-slate-600 rounded-sm"></span>旧制度①</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 inline-block bg-slate-500 rounded-sm"></span>旧制度②</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 inline-block bg-slate-400 rounded-sm"></span>旧制度③</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 inline-block bg-slate-300 rounded-sm"></span>新制度</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-blue-600">変更案:</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 inline-block bg-blue-600 rounded-sm"></span>旧制度①</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 inline-block bg-blue-500 rounded-sm"></span>旧制度②</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 inline-block bg-blue-400 rounded-sm"></span>旧制度③</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 inline-block bg-blue-300 rounded-sm"></span>新制度</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1"><span className="w-3 h-1 inline-block bg-red-500"></span>差額</span>
        </div>
      </div>
    );
  };

  // カスタム凡例 (面・折れ線用)
  const renderSingleLegend = () => {
    const isA = viewPattern === 'A';
    return (
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs mt-4">
        <div className="flex items-center gap-2">
          <span className={`font-bold ${isA ? 'text-blue-600' : 'text-slate-600'}`}>{isA ? '変更案:' : '現行制度:'}</span>
          <span className="flex items-center gap-1"><span className={`w-3 h-3 inline-block rounded-sm ${isA ? 'bg-blue-600' : 'bg-slate-600'}`}></span>旧制度①</span>
          <span className="flex items-center gap-1"><span className={`w-3 h-3 inline-block rounded-sm ${isA ? 'bg-blue-500' : 'bg-slate-500'}`}></span>旧制度②</span>
          <span className="flex items-center gap-1"><span className={`w-3 h-3 inline-block rounded-sm ${isA ? 'bg-blue-400' : 'bg-slate-400'}`}></span>旧制度③</span>
          <span className="flex items-center gap-1"><span className={`w-3 h-3 inline-block rounded-sm ${isA ? 'bg-blue-300' : 'bg-slate-300'}`}></span>新制度</span>
        </div>
      </div>
    );
  };

  const renderChart = () => {
    if (chartType === 'bar') {
      return (
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
          <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderBarLegend} />
          
          <Bar dataKey="パターンB_旧制度①" stackId="B" fill="#475569" maxBarSize={40} />
          <Bar dataKey="パターンB_旧制度②" stackId="B" fill="#64748b" maxBarSize={40} />
          <Bar dataKey="パターンB_旧制度③" stackId="B" fill="#94a3b8" maxBarSize={40} />
          <Bar dataKey="パターンB_新制度" stackId="B" fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={40} />

          <Bar dataKey="パターンA_旧制度①" stackId="A" fill="#2563eb" maxBarSize={40} />
          <Bar dataKey="パターンA_旧制度②" stackId="A" fill="#3b82f6" maxBarSize={40} />
          <Bar dataKey="パターンA_旧制度③" stackId="A" fill="#60a5fa" maxBarSize={40} />
          <Bar dataKey="パターンA_新制度" stackId="A" fill="#93c5fd" radius={[4, 4, 0, 0]} maxBarSize={40} />

          <Line type="monotone" dataKey="差額" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
        </ComposedChart>
      );
    }

    if (chartType === 'area') {
      return (
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
          <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderSingleLegend} />
          
          <Area type="monotone" dataKey={`パターン${viewPattern}_旧制度①`} stackId="1" stroke={viewPattern === 'A' ? '#2563eb' : '#475569'} fill={viewPattern === 'A' ? '#2563eb' : '#475569'} />
          <Area type="monotone" dataKey={`パターン${viewPattern}_旧制度②`} stackId="1" stroke={viewPattern === 'A' ? '#3b82f6' : '#64748b'} fill={viewPattern === 'A' ? '#3b82f6' : '#64748b'} />
          <Area type="monotone" dataKey={`パターン${viewPattern}_旧制度③`} stackId="1" stroke={viewPattern === 'A' ? '#60a5fa' : '#94a3b8'} fill={viewPattern === 'A' ? '#60a5fa' : '#94a3b8'} />
          <Area type="monotone" dataKey={`パターン${viewPattern}_新制度`} stackId="1" stroke={viewPattern === 'A' ? '#93c5fd' : '#cbd5e1'} fill={viewPattern === 'A' ? '#93c5fd' : '#cbd5e1'} />
        </AreaChart>
      );
    }

    if (chartType === 'line') {
      return (
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
          <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderSingleLegend} />
          
          <Line type="monotone" dataKey={`パターン${viewPattern}_旧制度①`} stroke={viewPattern === 'A' ? '#2563eb' : '#475569'} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey={`パターン${viewPattern}_旧制度②`} stroke={viewPattern === 'A' ? '#3b82f6' : '#64748b'} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey={`パターン${viewPattern}_旧制度③`} stroke={viewPattern === 'A' ? '#60a5fa' : '#94a3b8'} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey={`パターン${viewPattern}_新制度`} stroke={viewPattern === 'A' ? '#93c5fd' : '#cbd5e1'} strokeWidth={2} dot={false} />
        </LineChart>
      );
    }

    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          将来の退職金費用シミュレーション (DBO予測)
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {chartType !== 'bar' && (
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setViewPattern('B')} 
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${viewPattern === 'B' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                現行制度(B)
              </button>
              <button 
                onClick={() => setViewPattern('A')} 
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${viewPattern === 'A' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
              >
                変更案(A)
              </button>
            </div>
          )}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setChartType('bar')} 
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${chartType === 'bar' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
              比較(棒グラフ)
            </button>
            <button 
              onClick={() => setChartType('area')} 
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${chartType === 'area' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
              構成比(面グラフ)
            </button>
            <button 
              onClick={() => setChartType('line')} 
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${chartType === 'line' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
              推移(折れ線)
            </button>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-4">
        <div style={{ minWidth: '1200px', height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-slate-500 bg-slate-50 p-3 rounded-md">
        {chartType === 'bar' && (
          <>
            <p>※ 棒グラフは各年度の退職金支給見込額（千円）を制度区分別に積み上げて示しています。</p>
            <p>※ 赤い折れ線は「変更案 - 現行制度」の差額を示しています。プラスの場合は変更案の方が費用が高く、マイナスの場合は費用が抑えられていることを意味します。</p>
          </>
        )}
        {chartType === 'area' && (
          <p>※ 面グラフは、選択したパターンの各年度の退職金支給見込額（千円）の構成比を制度区分別に積み上げて示しています。全体のボリューム感と内訳の推移を把握するのに適しています。</p>
        )}
        {chartType === 'line' && (
          <p>※ 折れ線グラフは、選択したパターンの各年度の退職金支給見込額（千円）を制度区分別に独立して示しています。特定の層の費用がどのタイミングでピークを迎えるかを比較するのに適しています。</p>
        )}
      </div>
    </div>
  );
};
