import React, { useState } from 'react';
import { 
    X, HelpCircle, BookOpen, FileSpreadsheet, Settings, 
    Calculator, ArrowRightLeft, BarChart3, UserSearch, 
    Bot, Database, AlertTriangle 
} from 'lucide-react';

interface HelpModalProps {
    onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { id: 'overview', icon: BookOpen, title: '1. システム概要と目的' },
        { id: 'data', icon: FileSpreadsheet, title: '2. 事前準備とデータ仕様' },
        { id: 'flow', icon: HelpCircle, title: '3. 基本的な操作フロー' },
        { id: 'settings', icon: Settings, title: '4. シミュレーション設定詳細' },
        { id: 'logic', icon: Calculator, title: '5. ポイント計算ロジック' },
        { id: 'transition', icon: ArrowRightLeft, title: '6. 制度移行と調整措置' },
        { id: 'analysis', icon: BarChart3, title: '7. 結果分析とグラフの見方' },
        { id: 'individual', icon: UserSearch, title: '8. 個人別シミュレーション' },
        { id: 'ai', icon: Bot, title: '9. AIコンサルタントの活用' },
        { id: 'faq', icon: AlertTriangle, title: '10. FAQ・トラブルシューティング' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden border border-slate-200">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <BookOpen className="w-7 h-7 text-indigo-600" />
                        退職金シミュレーションシステム 総合マニュアル（最新版）
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 hover:bg-slate-200 p-2 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Navigation */}
                    <div className="w-80 bg-slate-50 border-r border-slate-200 overflow-y-auto py-4">
                        <div className="px-4 mb-4">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contents</p>
                        </div>
                        <nav className="space-y-1 px-2">
                            {tabs.map((tab, index) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === index;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(index)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                            isActive 
                                                ? 'bg-indigo-100 text-indigo-700' 
                                                : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                                        }`}
                                    >
                                        <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                                        <span className="text-left">{tab.title}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-8 bg-white">
                        <div className="max-w-4xl mx-auto prose prose-slate prose-indigo">
                            {activeTab === 0 && (
                                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h1 className="text-3xl font-bold text-slate-800 mb-6 border-b-2 border-indigo-100 pb-4">1. システム概要と目的</h1>
                                    <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                        本システムは、企業の人事・経営企画部門が直面する「定年延長」や「退職金制度の抜本的改定」に伴う、将来の退職金債務（DBO）およびキャッシュフローの変動を、高精度かつ瞬時にシミュレーションするための専門ツールです。
                                    </p>
                                    
                                    <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">1.1. 開発の背景</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        高年齢者雇用安定法の改正に伴い、多くの企業で65歳定年制の導入が検討されています。しかし、単純に定年を延長した場合、退職金の支給総額が想定以上に膨れ上がる「退職金リスク」が懸念されます。本システムは、現行制度（パターンB）と新たな制度案（パターンA）を並行して計算し、その差額を可視化することで、経営層の迅速な意思決定を支援します。
                                    </p>

                                    <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">1.2. 主な機能と特徴</h3>
                                    <ul className="space-y-3 text-slate-600">
                                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></div><span><strong>ポイント制退職金への完全対応:</strong> 勤続ポイント、資格（等級）ポイント、評価ポイントの3軸を組み合わせた複雑な計算ロジックに対応。</span></li>
                                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></div><span><strong>リアルタイム・シミュレーション:</strong> パラメータ（定年年齢、ポイント単価、支給乗率など）を変更すると、即座に全社員の将来退職金が再計算され、グラフに反映されます。</span></li>
                                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></div><span><strong>AIコンサルタント連携:</strong> 最新の生成AI（Gemini 3.1 Pro）を搭載し、計算結果の財務的インパクト分析や、制度設計に関する労務相談をチャット形式で実施可能です。</span></li>
                                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></div><span><strong>個人別ドリルダウン:</strong> マクロな財務予測だけでなく、特定の社員を検索し、「A案とB案で個人の退職金がどう変わるか」をミクロな視点で検証できます。</span></li>
                                    </ul>
                                </section>
                            )}

                            {activeTab === 1 && (
                                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h1 className="text-3xl font-bold text-slate-800 mb-6 border-b-2 border-indigo-100 pb-4">2. 事前準備とデータ仕様</h1>
                                    <p className="text-slate-600 leading-relaxed mb-6">
                                        シミュレーションを実行するには、全社員の基礎データを含むExcel（.xlsx）またはCSVファイルが必要です。データの正確性がシミュレーションの精度に直結するため、以下の仕様に従ってデータを作成してください。
                                    </p>

                                    <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">2.1. 必須データ項目</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white border border-slate-200 rounded-lg">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 border-b">列名（ヘッダー）</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 border-b">データ型</th>
                                                    <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 border-b">説明・注意事項</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 text-sm text-slate-600">
                                                <tr><td className="px-4 py-3 font-mono text-indigo-600">employeeId</td><td className="px-4 py-3">文字列</td><td className="px-4 py-3">社員番号（一意のID）。重複不可。</td></tr>
                                                <tr><td className="px-4 py-3 font-mono text-indigo-600">name</td><td className="px-4 py-3">文字列</td><td className="px-4 py-3">氏名</td></tr>
                                                <tr><td className="px-4 py-3 font-mono text-indigo-600">joinDate</td><td className="px-4 py-3">日付</td><td className="px-4 py-3">入社日（YYYY/MM/DD形式、またはExcelシリアル値）</td></tr>
                                                <tr><td className="px-4 py-3 font-mono text-indigo-600">birthDate</td><td className="px-4 py-3">日付</td><td className="px-4 py-3">生年月日（定年退職日の計算に使用）</td></tr>
                                                <tr><td className="px-4 py-3 font-mono text-indigo-600">grade</td><td className="px-4 py-3">文字列</td><td className="px-4 py-3">現在の等級（例: G1, M1など。マスタと一致させること）</td></tr>
                                                <tr><td className="px-4 py-3 font-mono text-indigo-600">typeName</td><td className="px-4 py-3">文字列</td><td className="px-4 py-3">職種・コース区分（例: 総合職, 一般職）</td></tr>
                                                <tr><td className="px-4 py-3 font-mono text-indigo-600">losPoints</td><td className="px-4 py-3">数値</td><td className="px-4 py-3">現時点での累計「勤続ポイント」</td></tr>
                                                <tr><td className="px-4 py-3 font-mono text-indigo-600">rankPoints</td><td className="px-4 py-3">数値</td><td className="px-4 py-3">現時点での累計「資格（等級）ポイント」</td></tr>
                                                <tr><td className="px-4 py-3 font-mono text-indigo-600">evalPoints</td><td className="px-4 py-3">数値</td><td className="px-4 py-3">現時点での累計「評価ポイント」</td></tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mt-6 rounded-r-lg">
                                        <h4 className="flex items-center gap-2 font-bold text-amber-800 mb-2">
                                            <AlertTriangle className="w-5 h-5" />
                                            データ作成時の重要事項
                                        </h4>
                                        <ul className="list-disc list-inside text-sm text-amber-700 space-y-1">
                                            <li>日付データは、Excel上で「文字列」ではなく「日付」フォーマットとして認識されていることが理想です。文字列の場合は <code>YYYY/MM/DD</code> または <code>YYYY-MM-DD</code> 形式に統一してください。</li>
                                            <li>ポイントの初期値（losPoints等）が空欄の場合は <code>0</code> として計算されます。</li>
                                            <li>「テンプレートDL」ボタンから、正しいヘッダーが設定された空のExcelファイルをダウンロードできます。</li>
                                        </ul>
                                    </div>
                                </section>
                            )}

                            {activeTab === 2 && (
                                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h1 className="text-3xl font-bold text-slate-800 mb-6 border-b-2 border-indigo-100 pb-4">3. 基本的な操作フロー</h1>
                                    <p className="text-slate-600 leading-relaxed mb-6">
                                        本システムは、以下の4つのステップでシミュレーションを実施します。直感的なUIにより、専門的な知識がなくても高度な分析が可能です。
                                    </p>

                                    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-600 text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">1</div>
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                                <h3 className="font-bold text-slate-800 text-lg mb-1">データのインポート</h3>
                                                <p className="text-sm text-slate-600">準備した社員データのExcelファイルを画面上部のドロップエリアにドラッグ＆ドロップします。読み込みが完了すると、対象人数が表示されます。</p>
                                            </div>
                                        </div>
                                        
                                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-600 text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">2</div>
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                                <h3 className="font-bold text-slate-800 text-lg mb-1">現行制度（パターンB）の確認</h3>
                                                <p className="text-sm text-slate-600">まずは右側の「パターンB」パネルで、現在の会社の定年年齢やポイント単価が正しく設定されているか確認します。これが比較のベースラインとなります。</p>
                                            </div>
                                        </div>

                                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-600 text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">3</div>
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                                <h3 className="font-bold text-slate-800 text-lg mb-1">変更案（パターンA）の設定</h3>
                                                <p className="text-sm text-slate-600">左側の「パターンA」パネルで、定年延長（例: 60歳→65歳）や、ポイント付与の上限年齢（頭打ち年齢）の変更を行います。設定を変更するたびにグラフがリアルタイムで更新されます。</p>
                                            </div>
                                        </div>

                                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-600 text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">4</div>
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                                <h3 className="font-bold text-slate-800 text-lg mb-1">分析とエクスポート</h3>
                                                <p className="text-sm text-slate-600">グラフで将来のコスト推移を確認し、必要に応じて「AI分析レポート」を生成します。最終的な計算結果は「Excel出力」ボタンからダウンロードし、社内稟議等の資料として活用します。</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activeTab === 3 && (
                                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h1 className="text-3xl font-bold text-slate-800 mb-6 border-b-2 border-indigo-100 pb-4">4. シミュレーション設定詳細</h1>
                                    <p className="text-slate-600 leading-relaxed mb-6">
                                        画面中央のコントロールパネルでは、シミュレーションの根幹となるパラメータを細かく調整できます。パターンA（変更案）とパターンB（現行制度）は独立して設定可能です。
                                    </p>

                                    <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">4.1. 定年年齢の設定 (Retirement Age)</h3>
                                    <p className="text-slate-600 mb-4">
                                        職種やコース（Type1〜Type4）ごとに異なる定年年齢を設定できます。
                                    </p>
                                    <ul className="list-disc list-inside text-slate-600 space-y-2 mb-6">
                                        <li><strong>Type1 (総合職等):</strong> 標準的な定年年齢。60歳から65歳への延長シミュレーションで最も頻繁に変更する項目です。</li>
                                        <li><strong>Type2〜4:</strong> 一般職、技能職、専門職など、職種によって定年が異なる場合に使用します。</li>
                                    </ul>

                                    <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">4.2. ポイント付与の頭打ち年齢 (Cutoff Years)</h3>
                                    <p className="text-slate-600 mb-4">
                                        定年延長を行った場合でも、「退職金ポイントの付与は従来の定年年齢（例: 60歳）でストップさせる」という制度設計が一般的です。この「頭打ち年齢」を設定します。
                                    </p>
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                                        <p className="text-sm text-slate-700"><strong>例: 定年65歳、頭打ち60歳の場合</strong><br/>
                                        60歳までは毎年ポイントが加算されますが、60歳から65歳までの5年間はポイントが加算されず、退職金水準が維持（フラット化）されます。</p>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">4.3. ポイント単価 (Unit Price)</h3>
                                    <p className="text-slate-600 mb-4">
                                        1ポイントあたりの金額（円）を設定します。通常は <code>10,000円</code> などに設定されます。<br/>
                                        総ポイント数 × ポイント単価 ＝ 退職金支給額 となります。
                                    </p>

                                    <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">4.4. 端数処理設定 (Fraction Config)</h3>
                                    <p className="text-slate-600 mb-4">
                                        勤続年数やポイント計算における端数（月数）の処理方法を定義します。
                                    </p>
                                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                                        <li><strong>切捨て (Floor):</strong> 1年未満の端数を切り捨てます。（例: 10年11ヶ月 → 10年）</li>
                                        <li><strong>切上げ (Ceil):</strong> 1日でも端数があれば1年とみなします。（例: 10年1ヶ月 → 11年）</li>
                                        <li><strong>四捨五入 (Round):</strong> 6ヶ月以上を切り上げます。</li>
                                        <li><strong>月割計算 (Monthly):</strong> 年数ではなく、月数に応じて按分計算を行います。</li>
                                    </ul>
                                </section>
                            )}

                            {activeTab === 4 && (
                                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h1 className="text-3xl font-bold text-slate-800 mb-6 border-b-2 border-indigo-100 pb-4">5. ポイント計算ロジック</h1>
                                    <p className="text-slate-600 leading-relaxed mb-6">
                                        本システムは、日本企業の退職金制度で最も一般的な「ポイント制退職金」のアルゴリズムを忠実に再現しています。退職金は以下の3つのポイントの累計によって決定されます。
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                                            <h4 className="font-bold text-blue-800 mb-2 text-lg">1. 勤続ポイント</h4>
                                            <p className="text-sm text-blue-700">勤続年数に応じて毎年付与されるポイント。長期勤労を報いるための基礎的な部分です。年数が長くなるほど付与率が上がるカーブを描くことが多いです。</p>
                                        </div>
                                        <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
                                            <h4 className="font-bold text-emerald-800 mb-2 text-lg">2. 資格（等級）ポイント</h4>
                                            <p className="text-sm text-emerald-700">その年度に所属している役割等級（グレード）に応じて付与されるポイント。役職が上がるほど多くのポイントが付与され、貢献度を反映します。</p>
                                        </div>
                                        <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                                            <h4 className="font-bold text-purple-800 mb-2 text-lg">3. 評価ポイント</h4>
                                            <p className="text-sm text-purple-700">毎年の人事評価（S, A, B, Cなど）に応じて付与されるポイント。シミュレーション上は、将来の評価を「標準評価（Bなど）」として一定と仮定して計算します。</p>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">5.1. 将来推計のアルゴリズム</h3>
                                    <p className="text-slate-600 mb-4">
                                        システムは、インポートされた各社員の「現在年齢」から「設定された定年年齢」までの期間について、毎年ループ処理を行い将来ポイントを推計します。
                                    </p>
                                    <ol className="list-decimal list-inside text-slate-600 space-y-3 bg-slate-50 p-6 rounded-lg border border-slate-200">
                                        <li>社員の生年月日と定年年齢設定から、<strong>退職予定日</strong>を算出。</li>
                                        <li>現在から退職予定日までの<strong>残存年数</strong>を算出。</li>
                                        <li>残存期間中、毎年マスタデータ（ポイント表）を参照し、現在の等級に応じたポイントを加算。</li>
                                        <li>年齢が「頭打ち年齢（Cutoff）」に達した時点で、ポイントの加算を停止。</li>
                                        <li>最終的な累計ポイントに「ポイント単価」を乗じて、退職金支給額（退職給付債務）を算出。</li>
                                    </ol>

                                    <div className="mt-6 p-4 bg-indigo-50 text-indigo-800 rounded-lg text-sm">
                                        <strong>※ 昇格シミュレーションについて：</strong><br/>
                                        本バージョンのシミュレーションでは、保守的な財務予測を行うため、将来の昇格（等級アップ）は加味せず、現在の等級が定年まで継続する前提（ステイタス・クオ）で計算を行っています。
                                    </div>
                                </section>
                            )}

                            {activeTab === 5 && (
                                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h1 className="text-3xl font-bold text-slate-800 mb-6 border-b-2 border-indigo-100 pb-4">6. 制度移行と調整措置</h1>
                                    <p className="text-slate-600 leading-relaxed mb-6">
                                        退職金制度を不利益変更（社員にとって不利になる変更）する場合、法的な観点から「既得権の保護」や「激変緩和措置」が必須となります。本システムでは、これらの移行措置を正確にシミュレーションできます。
                                    </p>

                                    <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">6.1. 既得権の保護（2026年時点の確定）</h3>
                                    <p className="text-slate-600 mb-4">
                                        新制度（パターンA）へ移行する際、過去の労働に対する対価である「現時点（例: 2026年）までに貯まった退職金」は既得権として保護され、減額されることはありません。
                                    </p>
                                    <p className="text-slate-600 mb-4">
                                        システム内では、インポートされた <code>losPoints</code>, <code>rankPoints</code>, <code>evalPoints</code> の合計を「移行時既得ポイント」として保持し、新制度の計算のベースとして引き継ぎます。
                                    </p>

                                    <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">6.2. 調整給（調整ポイント）の付与</h3>
                                    <p className="text-slate-600 mb-4">
                                        新制度に移行することで、旧制度のまま定年を迎えた場合（パターンB）と比較して、将来の退職金が大幅に減少する社員が発生する場合があります。これを緩和するための措置です。
                                    </p>
                                    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-6">
                                        <h4 className="font-bold text-slate-800 mb-2">シミュレーション上の挙動</h4>
                                        <p className="text-sm text-slate-600">
                                            パターンAの設定で「調整措置を有効にする」等のフラグ（今後のアップデートでUI実装予定）をオンにした場合、システムはバックグラウンドでパターンAとパターンBの両方を計算し、その差額が一定割合（例: 10%以上の減少）を超える社員に対して、差額を埋めるための「調整ポイント」を自動的に付与して再計算を行います。
                                        </p>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">6.3. 役職定年によるポイント減額</h3>
                                    <p className="text-slate-600 mb-4">
                                        定年延長に伴い、55歳や60歳で「役職定年」を迎え、等級が下がる（またはポイント付与率が下がる）ケースのシミュレーションです。マスタデータの「年齢別係数表」を編集することで、特定の年齢以降の付与ポイントを 70% や 50% に減額する設定が可能です。
                                    </p>
                                </section>
                            )}

                            {activeTab === 6 && (
                                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h1 className="text-3xl font-bold text-slate-800 mb-6 border-b-2 border-indigo-100 pb-4">7. 結果分析とグラフの見方</h1>
                                    <p className="text-slate-600 leading-relaxed mb-6">
                                        シミュレーション結果は、経営陣へのプレゼンテーションにそのまま使用できる視覚的なグラフと、詳細な数値テーブルで出力されます。
                                    </p>

                                    <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">7.1. 将来コスト推移グラフ（棒グラフ・折れ線グラフ）</h3>
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
                                        <ul className="space-y-4 text-slate-700">
                                            <li>
                                                <strong className="text-indigo-600">X軸（横軸）:</strong> 将来の年度（Year）を表します。通常、現在から20〜30年先までプロットされます。
                                            </li>
                                            <li>
                                                <strong className="text-indigo-600">Y軸（縦軸）:</strong> その年度に発生する退職金の「キャッシュアウト（支払額）」の合計を表します。単位は千円または百万円です。
                                            </li>
                                            <li>
                                                <strong className="text-indigo-600">青色のバー（パターンA）:</strong> 新制度案を導入した場合のコスト推移です。
                                            </li>
                                            <li>
                                                <strong className="text-indigo-600">灰色のバー（パターンB）:</strong> 現行制度を維持した場合のコスト推移です。
                                            </li>
                                        </ul>
                                    </div>
                                    <p className="text-slate-600 mb-4">
                                        <strong>分析のポイント：</strong> 定年を60歳から65歳に延長した場合、直近5年間の退職者がゼロになるため、グラフ上では「直近のキャッシュアウトが消滅し、5年後に巨大な山（ピーク）が移動する」という特徴的な波形が観察されます。このピーク時の資金繰り（キャッシュフロー）に耐えられるかが、経営上の重要な判断材料となります。
                                    </p>

                                    <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">7.2. 年度別集計テーブル</h3>
                                    <p className="text-slate-600 mb-4">
                                        グラフの下部には、年度ごとの具体的な数値を表形式で表示しています。
                                    </p>
                                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                                        <li><strong>退職者数:</strong> その年度に定年退職を迎える人数の予測。</li>
                                        <li><strong>総費用（A/B）:</strong> その年度の退職金支払総額。</li>
                                        <li><strong>差額:</strong> パターンAとパターンBのコスト差。プラスの場合は新制度の方がコスト増、マイナスの場合はコスト減を意味します。</li>
                                    </ul>
                                </section>
                            )}

                            {activeTab === 7 && (
                                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h1 className="text-3xl font-bold text-slate-800 mb-6 border-b-2 border-indigo-100 pb-4">8. 個人別シミュレーション</h1>
                                    <p className="text-slate-600 leading-relaxed mb-6">
                                        マクロな全体コストの把握だけでなく、「特定の社員にとって、制度変更がどのような影響を与えるか」をミクロな視点で検証することは、社員への制度説明（従業員代表との交渉など）において非常に重要です。
                                    </p>

                                    <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">8.1. 個人検索機能の使い方</h3>
                                    <ol className="list-decimal list-inside text-slate-600 space-y-4 mb-8 bg-slate-50 p-6 rounded-lg border border-slate-200">
                                        <li>画面下部の「個人別シミュレーション比較」セクションにスクロールします。</li>
                                        <li>検索ボックスに、確認したい社員の<strong>「社員番号」</strong>または<strong>「氏名の一部」</strong>を入力します。</li>
                                        <li>「検索」ボタンをクリックします。</li>
                                        <li>該当する社員が見つかると、詳細な比較カード（ResultCard）が表示されます。</li>
                                    </ol>

                                    <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">8.2. 比較カード（ResultCard）の見方</h3>
                                    <div className="border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden mb-6">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <UserSearch className="w-5 h-5 text-indigo-600" />
                                            表示される情報
                                        </h4>
                                        <ul className="space-y-3 text-sm text-slate-600">
                                            <li><strong>基本情報:</strong> 氏名、社員番号、職種、現在の等級、現在の勤続年数。</li>
                                            <li><strong>退職予定日:</strong> 設定された定年年齢に基づく、具体的な退職予定年月日。</li>
                                            <li><strong>現行制度（パターンB）の予測額:</strong> 現在の制度のまま定年を迎えた場合の退職金支給額と、獲得予定の累計ポイント。</li>
                                            <li><strong>変更案（パターンA）の予測額:</strong> 新制度に移行した場合の退職金支給額と、獲得予定の累計ポイント。</li>
                                            <li><strong>差額（インパクト）:</strong> 新制度になることで、この社員の退職金が「いくら増えるか（または減るか）」。赤字で表示される場合は不利益変更となっているため、前述の「調整措置」の対象とするか検討が必要です。</li>
                                        </ul>
                                    </div>
                                    
                                    <p className="text-slate-600">
                                        <strong>活用シーン：</strong> 労働組合や従業員代表への説明会資料の作成時や、モデルケース（標準的な大卒総合職、高卒技能職など）の抽出に活用します。
                                    </p>
                                </section>
                            )}

                            {activeTab === 8 && (
                                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h1 className="text-3xl font-bold text-slate-800 mb-6 border-b-2 border-indigo-100 pb-4">9. AIコンサルタントの活用</h1>
                                    <p className="text-slate-600 leading-relaxed mb-6">
                                        本システムには、Googleの最新生成AIモデル「Gemini 3.1 Pro」を活用した「AI人事労務コンサルタント」機能が搭載されています。複雑なデータ分析や、制度設計の壁打ち相手として活用できます。
                                    </p>

                                    <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">9.1. AI分析レポートの自動生成</h3>
                                    <p className="text-slate-600 mb-4">
                                        画面下部の「AI分析レポート」セクションにある「レポートを生成」ボタンをクリックすると、現在のシミュレーション結果（A案とB案のコスト差、年度別の推移データ）がAIに送信されます。
                                    </p>
                                    <p className="text-slate-600 mb-6">
                                        AIは数秒でデータを解析し、<strong>経営会議にそのまま提出できるレベルのサマリーレポート</strong>（コストインパクトの要約、長期的なリスク、メリット・デメリット、今後の検討課題）をMarkdown形式で出力します。
                                    </p>

                                    <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">9.2. チャットコンサルタント機能</h3>
                                    <p className="text-slate-600 mb-4">
                                        画面右下のフローティングボタン（チャットアイコン）をクリックすると、AIコンサルタントとの対話ウィンドウが開きます。AIは現在のシミュレーション設定（定年年齢やポイント単価など）をコンテキストとして理解した上で回答します。
                                    </p>
                                    
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
                                        <h4 className="font-bold text-slate-800 mb-3">効果的なプロンプト（質問）の例</h4>
                                        <ul className="space-y-3 text-sm text-slate-700">
                                            <li className="flex gap-3">
                                                <Bot className="w-5 h-5 text-indigo-500 shrink-0" />
                                                <span>「定年を65歳に延長しつつ、総額のコストアップを現行比105%以内に抑えるには、どのような制度設計の工夫（頭打ち年齢の引き下げなど）が考えられますか？」</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <Bot className="w-5 h-5 text-indigo-500 shrink-0" />
                                                <span>「退職金の不利益変更を行う場合、労働契約法第9条および第10条の観点から、どのようなプロセスを踏むべきですか？判例を踏まえて教えてください。」</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <Bot className="w-5 h-5 text-indigo-500 shrink-0" />
                                                <span>「確定拠出年金（DC）への移行を検討しています。現在のポイント制退職金からDCへ移行する際のメリットとデメリットを比較してください。」</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <p className="text-sm text-slate-500">
                                        ※ AIの回答は一般的な人事労務のセオリーに基づくものです。最終的な法的判断や制度改定の決定は、顧問弁護士や社会保険労務士にご確認ください。
                                    </p>
                                </section>
                            )}

                            {activeTab === 9 && (
                                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h1 className="text-3xl font-bold text-slate-800 mb-6 border-b-2 border-indigo-100 pb-4">10. FAQ・トラブルシューティング</h1>
                                    
                                    <div className="space-y-6">
                                        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                                            <h3 className="font-bold text-slate-800 text-lg mb-2 flex items-center gap-2">
                                                <span className="text-indigo-600">Q.</span>
                                                Excelファイルを読み込むとエラーになります。
                                            </h3>
                                            <div className="text-slate-600 text-sm space-y-2">
                                                <p><span className="font-bold text-slate-500">A.</span> 以下の点を確認してください。</p>
                                                <ul className="list-disc list-inside pl-4">
                                                    <li>必須の列ヘッダー（employeeId, name, joinDate, birthDate等）が1行目に正しく入力されているか。スペルミスがないか。</li>
                                                    <li>日付データ（joinDate, birthDate）に、無効な文字列（例: "不明", "1990/13/45"）が含まれていないか。</li>
                                                    <li>ファイル形式が <code>.xlsx</code> または <code>.csv</code> であるか。</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                                            <h3 className="font-bold text-slate-800 text-lg mb-2 flex items-center gap-2">
                                                <span className="text-indigo-600">Q.</span>
                                                計算結果（退職金額）が想定より極端に少ない/多いです。
                                            </h3>
                                            <div className="text-slate-600 text-sm space-y-2">
                                                <p><span className="font-bold text-slate-500">A.</span> パラメータ設定の「ポイント単価（Unit Price）」を確認してください。単価が「1円」になっているか、「10,000円」になっているかで結果が大きく変わります。また、マスタデータのポイント付与テーブルが正しく設定されているか（MasterEditorModalから確認可能）も併せてご確認ください。</p>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                                            <h3 className="font-bold text-slate-800 text-lg mb-2 flex items-center gap-2">
                                                <span className="text-indigo-600">Q.</span>
                                                AI分析レポートの生成ボタンを押しても反応しない、またはエラーが出ます。
                                            </h3>
                                            <div className="text-slate-600 text-sm space-y-2">
                                                <p><span className="font-bold text-slate-500">A.</span> AI機能を利用するには、有効なGemini APIキーが環境変数（<code>GEMINI_API_KEY</code> または <code>API_KEY</code>）としてシステムに設定されている必要があります。システム管理者にAPIキーの設定状況をご確認ください。また、一時的なネットワークエラーの可能性もあるため、数分待ってから再度お試しください。</p>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                                            <h3 className="font-bold text-slate-800 text-lg mb-2 flex items-center gap-2">
                                                <span className="text-indigo-600">Q.</span>
                                                シミュレーション結果を保存して、後で再開することはできますか？
                                            </h3>
                                            <div className="text-slate-600 text-sm space-y-2">
                                                <p><span className="font-bold text-slate-500">A.</span> 現在のバージョンでは、ブラウザを閉じると読み込んだデータや設定したパラメータはリセットされます。作業を中断する場合は、必ず「比較結果をExcel出力」ボタンから計算結果をダウンロードして保存してください。</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
