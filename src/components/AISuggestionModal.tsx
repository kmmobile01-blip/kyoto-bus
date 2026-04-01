import React, { useState } from 'react';
import { X, Sparkles, Check, Loader2, Info } from 'lucide-react';
import { getAISuggestion, AISuggestion } from '../services/aiService';

interface AISuggestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentConfig: any;
    currentResults: any;
    onApply: (suggestedConfig: AISuggestion['suggestedConfig']) => void;
}

const AISuggestionModal: React.FC<AISuggestionModalProps> = ({ isOpen, onClose, currentConfig, currentResults, onApply }) => {
    const [goal, setGoal] = useState('定年を65歳に延長しつつ、総支給額の増加を5%以内に抑えたい');
    const [loading, setLoading] = useState(false);
    const [suggestion, setSuggestion] = useState<AISuggestion | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleGetSuggestion = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getAISuggestion(currentConfig, currentResults, goal);
            setSuggestion(res);
        } catch (err) {
            console.error(err);
            setError('AIアドバイスの取得に失敗しました。しばらく時間をおいてから再度お試しください。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-amber-300 fill-amber-300" />
                        <h2 className="text-xl font-bold">AIアドバイザー：パラメータ最適化提案</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Info className="w-4 h-4 text-indigo-500" />
                            達成したい目標を入力してください
                        </label>
                        <textarea 
                            className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[80px]"
                            placeholder="例：定年を65歳に延長しつつ、総支給額の増加を5%以内に抑えたい"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                        />
                        <button 
                            onClick={handleGetSuggestion}
                            disabled={loading || !goal.trim()}
                            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            AIに提案を依頼する
                        </button>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                            {error}
                        </div>
                    )}

                    {suggestion && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                <h3 className="font-bold text-amber-900 text-sm mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    AIの考察・提案理由
                                </h3>
                                <p className="text-sm text-amber-800 leading-relaxed">
                                    {suggestion.reasoning}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">提案された定年年齢</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(suggestion.suggestedConfig.retirementAges).map(([type, age]) => (
                                            <div key={type} className="flex justify-between items-center p-2 bg-white rounded border border-slate-100">
                                                <span className="text-xs text-slate-600">{type === 'type4' ? '新制度' : `旧制度${type.slice(-1)}`}</span>
                                                <span className="font-bold text-indigo-600">{age}歳</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">主要パラメータ</h4>
                                    <div className="flex justify-between items-center p-2 bg-white rounded border border-slate-100">
                                        <span className="text-xs text-slate-600">ポイント単価</span>
                                        <span className="font-bold text-indigo-600">{suggestion.suggestedConfig.pointValue.toLocaleString()}円</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-white rounded border border-slate-100">
                                        <span className="text-xs text-slate-600">標準考課Pt</span>
                                        <span className="font-bold text-indigo-600">{suggestion.suggestedConfig.defaultYearlyEval}pt</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => {
                                    onApply(suggestion.suggestedConfig);
                                    onClose();
                                }}
                                className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                            >
                                <Check className="w-6 h-6" />
                                この提案をシミュレーションに反映する
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AISuggestionModal;
