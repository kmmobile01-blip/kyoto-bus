import React, { useState } from 'react';
import { SimulationConfig, TableRowT1, TableRowT2, CoefRow } from '../types';
import { X, Download, Upload, FileSpreadsheet, Edit3, Table as TableIcon } from 'lucide-react';
import * as XLSX from 'xlsx';

interface MasterEditorModalProps {
    pattern: 'A' | 'B';
    config: SimulationConfig;
    setConfig: React.Dispatch<React.SetStateAction<SimulationConfig>>;
    onClose: () => void;
}

type TabType = 
    | 'md1_1' | 'md1_2' | 'md1_3' | 'md2' | 'coef'
    | 'f_md_t1' | 'f_md_t2' | 'f_md_t3' | 'f_md_t4' | 'f_coef';

export const MasterEditorModal: React.FC<MasterEditorModalProps> = ({ pattern, config, setConfig, onClose }) => {
    const [activeTab, setActiveTab] = useState<TabType>('md2');
    const [editMode, setEditMode] = useState(false);

    const handleDownloadTemplate = () => {
        const wb = XLSX.utils.book_new();
        
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(config.masterData1_1), "旧制度1");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(config.masterData1_2), "旧制度2");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(config.masterData1_3), "旧制度3");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(config.masterData2), "新制度");
        
        const coefData = config.coefSettings.type1.map((_, i) => ({
            years: config.coefSettings.type1[i].years,
            type1: config.coefSettings.type1[i].coef,
            type2: config.coefSettings.type2[i].coef,
            type3: config.coefSettings.type3[i].coef,
            type4: config.coefSettings.type4[i].coef,
        }));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(coefData), "支給率");

        if (pattern === 'A') {
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(config.masterDataFuture.type1), "移行後_旧制度1");
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(config.masterDataFuture.type2), "移行後_旧制度2");
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(config.masterDataFuture.type3), "移行後_旧制度3");
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(config.masterDataFuture.type4), "移行後_新制度");
            
            const coefFutureData = config.coefSettingsFuture.type1.map((_, i) => ({
                years: config.coefSettingsFuture.type1[i].years,
                type1: config.coefSettingsFuture.type1[i].coef,
                type2: config.coefSettingsFuture.type2[i].coef,
                type3: config.coefSettingsFuture.type3[i].coef,
                type4: config.coefSettingsFuture.type4[i].coef,
            }));
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(coefFutureData), "移行後_支給率");
        }

        XLSX.writeFile(wb, `マスタデータ_テンプレート_パターン${pattern}.xlsx`);
    };

    const handleUploadExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                
                const newConfig = { ...config };
                
                const validateRows = (rows: any[], fields: string[]) => {
                    if (!rows || rows.length === 0) return false;
                    return rows.every(r => fields.every(f => r[f] !== undefined));
                };

                if (wb.SheetNames.includes("旧制度1")) {
                    const rows = XLSX.utils.sheet_to_json(wb.Sheets["旧制度1"]);
                    if (validateRows(rows, ['y', 'los1', 'r1_1'])) newConfig.masterData1_1 = rows as any;
                }
                if (wb.SheetNames.includes("旧制度2")) {
                    const rows = XLSX.utils.sheet_to_json(wb.Sheets["旧制度2"]);
                    if (validateRows(rows, ['y', 'los1', 'r1_1'])) newConfig.masterData1_2 = rows as any;
                }
                if (wb.SheetNames.includes("旧制度3")) {
                    const rows = XLSX.utils.sheet_to_json(wb.Sheets["旧制度3"]);
                    if (validateRows(rows, ['y', 'los1', 'r1_1'])) newConfig.masterData1_3 = rows as any;
                }
                if (wb.SheetNames.includes("新制度")) {
                    const rows = XLSX.utils.sheet_to_json(wb.Sheets["新制度"]);
                    if (validateRows(rows, ['y', 'los', 'r1'])) newConfig.masterData2 = rows as any;
                }
                
                if (wb.SheetNames.includes("支給率")) {
                    const coefData: any[] = XLSX.utils.sheet_to_json(wb.Sheets["支給率"]);
                    if (validateRows(coefData, ['years', 'type1', 'type2', 'type3', 'type4'])) {
                        newConfig.coefSettings = {
                            type1: coefData.map(d => ({ years: Number(d.years), coef: Number(d.type1) })),
                            type2: coefData.map(d => ({ years: Number(d.years), coef: Number(d.type2) })),
                            type3: coefData.map(d => ({ years: Number(d.years), coef: Number(d.type3) })),
                            type4: coefData.map(d => ({ years: Number(d.years), coef: Number(d.type4) })),
                        };
                    }
                }

                if (pattern === 'A') {
                    if (wb.SheetNames.includes("移行後_旧制度1")) {
                        const rows = XLSX.utils.sheet_to_json(wb.Sheets["移行後_旧制度1"]);
                        if (validateRows(rows, ['y', 'los', 'r1'])) newConfig.masterDataFuture.type1 = rows as any;
                    }
                    if (wb.SheetNames.includes("移行後_旧制度2")) {
                        const rows = XLSX.utils.sheet_to_json(wb.Sheets["移行後_旧制度2"]);
                        if (validateRows(rows, ['y', 'los', 'r1'])) newConfig.masterDataFuture.type2 = rows as any;
                    }
                    if (wb.SheetNames.includes("移行後_旧制度3")) {
                        const rows = XLSX.utils.sheet_to_json(wb.Sheets["移行後_旧制度3"]);
                        if (validateRows(rows, ['y', 'los', 'r1'])) newConfig.masterDataFuture.type3 = rows as any;
                    }
                    if (wb.SheetNames.includes("移行後_新制度")) {
                        const rows = XLSX.utils.sheet_to_json(wb.Sheets["移行後_新制度"]);
                        if (validateRows(rows, ['y', 'los', 'r1'])) newConfig.masterDataFuture.type4 = rows as any;
                    }
                    
                    if (wb.SheetNames.includes("移行後_支給率")) {
                        const coefData: any[] = XLSX.utils.sheet_to_json(wb.Sheets["移行後_支給率"]);
                        if (validateRows(coefData, ['years', 'type1', 'type2', 'type3', 'type4'])) {
                            newConfig.coefSettingsFuture = {
                                type1: coefData.map(d => ({ years: Number(d.years), coef: Number(d.type1) })),
                                type2: coefData.map(d => ({ years: Number(d.years), coef: Number(d.type2) })),
                                type3: coefData.map(d => ({ years: Number(d.years), coef: Number(d.type3) })),
                                type4: coefData.map(d => ({ years: Number(d.years), coef: Number(d.type4) })),
                            };
                        }
                    }
                }

                newConfig.masterDataSource = 'custom';
                setConfig(newConfig);
                alert('マスタデータを読み込みました。');
            } catch (err) {
                alert('ファイルの読み込みに失敗しました。テンプレートと同じ形式か確認してください。');
            }
        };
        reader.readAsBinaryString(file);
        e.target.value = ''; // reset
    };

    const updateValue = (tab: TabType, rowIndex: number, field: string, value: string) => {
        const numVal = parseFloat(value) || 0;
        const newConfig = { ...config };
        newConfig.masterDataSource = 'custom';

        if (tab === 'md1_1') (newConfig.masterData1_1[rowIndex] as any)[field] = numVal;
        if (tab === 'md1_2') (newConfig.masterData1_2[rowIndex] as any)[field] = numVal;
        if (tab === 'md1_3') (newConfig.masterData1_3[rowIndex] as any)[field] = numVal;
        if (tab === 'md2') (newConfig.masterData2[rowIndex] as any)[field] = numVal;
        
        if (tab === 'coef') {
            (newConfig.coefSettings[field as keyof typeof newConfig.coefSettings][rowIndex] as any).coef = numVal;
        }

        if (tab === 'f_md_t1') (newConfig.masterDataFuture.type1[rowIndex] as any)[field] = numVal;
        if (tab === 'f_md_t2') (newConfig.masterDataFuture.type2[rowIndex] as any)[field] = numVal;
        if (tab === 'f_md_t3') (newConfig.masterDataFuture.type3[rowIndex] as any)[field] = numVal;
        if (tab === 'f_md_t4') (newConfig.masterDataFuture.type4[rowIndex] as any)[field] = numVal;

        if (tab === 'f_coef') {
            (newConfig.coefSettingsFuture[field as keyof typeof newConfig.coefSettingsFuture][rowIndex] as any).coef = numVal;
        }

        setConfig(newConfig);
    };

    const renderTable = () => {
        let data: any[] = [];
        let columns: { key: string, label: string }[] = [];

        if (activeTab === 'md1_1') {
            data = config.masterData1_1;
            columns = [
                { key: 'y', label: '年度' }, { key: 'los1', label: '勤続Pt' }, 
                { key: 'r1_1', label: '職能1' }, { key: 'r2', label: '職能2' }, { key: 'r3', label: '職能3' },
                { key: 'r4', label: '職能4' }, { key: 'r5', label: '職能5' }, { key: 'r6', label: '職能6' }
            ];
        } else if (activeTab === 'md1_2') {
            data = config.masterData1_2;
            columns = [
                { key: 'y', label: '年度' }, { key: 'los1', label: '勤続Pt' }, 
                { key: 'r1_1', label: '職能1' }, { key: 'r2', label: '職能2' }, { key: 'r3', label: '職能3' },
                { key: 'r4', label: '職能4' }, { key: 'r5', label: '職能5' }, { key: 'r6', label: '職能6' }
            ];
        } else if (activeTab === 'md1_3') {
            data = config.masterData1_3;
            columns = [
                { key: 'y', label: '年度' }, { key: 'los1', label: '勤続Pt' }, 
                { key: 'r1_1', label: '職能1' }, { key: 'r2', label: '職能2' }, { key: 'r3', label: '職能3' },
                { key: 'r4', label: '職能4' }, { key: 'r5', label: '職能5' }, { key: 'r6', label: '職能6' }
            ];
        } else if (activeTab === 'md2') {
            data = config.masterData2;
            columns = [
                { key: 'y', label: '年度' }, { key: 'los', label: '勤続Pt' }, 
                { key: 'r1', label: '職能1' }, { key: 'r2', label: '職能2' }, { key: 'r3', label: '職能3' },
                { key: 'r4', label: '職能4' }, { key: 'r5', label: '職能5' }, { key: 'r6', label: '職能6' }
            ];
        } else if (activeTab === 'coef') {
            // Combine all 4 types for editing
            data = config.coefSettings.type1.map((d, i) => ({
                years: d.years,
                type1: config.coefSettings.type1[i].coef,
                type2: config.coefSettings.type2[i].coef,
                type3: config.coefSettings.type3[i].coef,
                type4: config.coefSettings.type4[i].coef,
            }));
            columns = [
                { key: 'years', label: '勤続年数' }, 
                { key: 'type1', label: '支給率1' }, { key: 'type2', label: '支給率2' }, 
                { key: 'type3', label: '支給率3' }, { key: 'type4', label: '支給率4' }
            ];
        } else if (activeTab === 'f_md_t1') {
            data = config.masterDataFuture.type1;
            columns = [
                { key: 'y', label: '年度' }, { key: 'los', label: '勤続Pt' }, 
                { key: 'r1', label: '職能1' }, { key: 'r2', label: '職能2' }, { key: 'r3', label: '職能3' },
                { key: 'r4', label: '職能4' }, { key: 'r5', label: '職能5' }, { key: 'r6', label: '職能6' }
            ];
        } else if (activeTab === 'f_md_t2') {
            data = config.masterDataFuture.type2;
            columns = [
                { key: 'y', label: '年度' }, { key: 'los', label: '勤続Pt' }, 
                { key: 'r1', label: '職能1' }, { key: 'r2', label: '職能2' }, { key: 'r3', label: '職能3' },
                { key: 'r4', label: '職能4' }, { key: 'r5', label: '職能5' }, { key: 'r6', label: '職能6' }
            ];
        } else if (activeTab === 'f_md_t3') {
            data = config.masterDataFuture.type3;
            columns = [
                { key: 'y', label: '年度' }, { key: 'los', label: '勤続Pt' }, 
                { key: 'r1', label: '職能1' }, { key: 'r2', label: '職能2' }, { key: 'r3', label: '職能3' },
                { key: 'r4', label: '職能4' }, { key: 'r5', label: '職能5' }, { key: 'r6', label: '職能6' }
            ];
        } else if (activeTab === 'f_md_t4') {
            data = config.masterDataFuture.type4;
            columns = [
                { key: 'y', label: '年度' }, { key: 'los', label: '勤続Pt' }, 
                { key: 'r1', label: '職能1' }, { key: 'r2', label: '職能2' }, { key: 'r3', label: '職能3' },
                { key: 'r4', label: '職能4' }, { key: 'r5', label: '職能5' }, { key: 'r6', label: '職能6' }
            ];
        } else if (activeTab === 'f_coef') {
            data = config.coefSettingsFuture.type1.map((d, i) => ({
                years: d.years,
                type1: config.coefSettingsFuture.type1[i].coef,
                type2: config.coefSettingsFuture.type2[i].coef,
                type3: config.coefSettingsFuture.type3[i].coef,
                type4: config.coefSettingsFuture.type4[i].coef,
            }));
            columns = [
                { key: 'years', label: '勤続年数' }, 
                { key: 'type1', label: '支給率1' }, { key: 'type2', label: '支給率2' }, 
                { key: 'type3', label: '支給率3' }, { key: 'type4', label: '支給率4' }
            ];
        }

        return (
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-xs text-left text-slate-500 border-collapse">
                    <thead className="bg-slate-50 text-slate-700 uppercase font-bold sticky top-0 z-10">
                        <tr>
                            {columns.map(col => (
                                <th key={col.key} className="px-3 py-2 border-b border-r border-slate-200">{col.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, idx) => (
                            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                                {columns.map(col => (
                                    <td key={col.key} className="px-3 py-1 border-r border-slate-100">
                                        {editMode && col.key !== 'y' && col.key !== 'years' ? (
                                            <input 
                                                type="number" 
                                                step="any"
                                                defaultValue={row[col.key]}
                                                onBlur={(e) => updateValue(activeTab, idx, col.key, e.target.value)}
                                                className="w-full p-1 border border-indigo-200 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                                            />
                                        ) : (
                                            <span className={col.key === 'y' || col.key === 'years' ? 'font-bold text-slate-700' : ''}>
                                                {row[col.key]}
                                            </span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[95vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-slate-800">
                            マスタ編集 - パターン{pattern}
                        </h2>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${config.masterDataSource === 'custom' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                            {config.masterDataSource === 'custom' ? 'カスタム設定中' : '標準設定'}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-48 bg-slate-50 border-r border-slate-200 overflow-y-auto p-2 space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">基本マスタ</div>
                        <button onClick={() => setActiveTab('md1_1')} className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors ${activeTab === 'md1_1' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'}`}>旧制度1</button>
                        <button onClick={() => setActiveTab('md1_2')} className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors ${activeTab === 'md1_2' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'}`}>旧制度2</button>
                        <button onClick={() => setActiveTab('md1_3')} className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors ${activeTab === 'md1_3' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'}`}>旧制度3</button>
                        <button onClick={() => setActiveTab('md2')} className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors ${activeTab === 'md2' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'}`}>新制度</button>
                        <button onClick={() => setActiveTab('coef')} className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors ${activeTab === 'coef' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'}`}>支給率</button>

                        {pattern === 'A' && (
                            <>
                                <div className="text-[10px] font-bold text-slate-400 px-2 py-1 mt-4 uppercase tracking-wider">移行後マスタ</div>
                                <button onClick={() => setActiveTab('f_md_t1')} className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors ${activeTab === 'f_md_t1' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'}`}>移行後1</button>
                                <button onClick={() => setActiveTab('f_md_t2')} className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors ${activeTab === 'f_md_t2' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'}`}>移行後2</button>
                                <button onClick={() => setActiveTab('f_md_t3')} className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors ${activeTab === 'f_md_t3' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'}`}>移行後3</button>
                                <button onClick={() => setActiveTab('f_md_t4')} className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors ${activeTab === 'f_md_t4' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'}`}>移行後4</button>
                                <button onClick={() => setActiveTab('f_coef')} className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors ${activeTab === 'f_coef' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'}`}>移行後支給率</button>
                            </>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setEditMode(!editMode)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${editMode ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                >
                                    <Edit3 className="w-4 h-4" />
                                    {editMode ? '編集を終了' : '直接編集を開始'}
                                </button>
                                {editMode && (
                                    <span className="text-xs text-amber-600 font-medium animate-pulse">
                                        ※数値を変更すると自動的に「カスタムマスタ」として保存されます。
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={handleDownloadTemplate} 
                                    className="flex items-center gap-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                                >
                                    <Download className="w-4 h-4" />
                                    テンプレートDL
                                </button>
                                <label className="flex items-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-emerald-700 transition">
                                    <Upload className="w-4 h-4" />
                                    Excelアップロード
                                    <input type="file" className="hidden" accept=".xlsx,.xls" onChange={handleUploadExcel} />
                                </label>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <TableIcon className="w-5 h-5 text-indigo-600" />
                                    {activeTab === 'md1_1' ? '旧制度1 (T1)' : 
                                     activeTab === 'md1_2' ? '旧制度2 (T1)' :
                                     activeTab === 'md1_3' ? '旧制度3 (T1)' :
                                     activeTab === 'md2' ? '新制度 (T2)' :
                                     activeTab === 'coef' ? '支給率テーブル' :
                                     activeTab.startsWith('f_md') ? '移行後マスタ' : '移行後支給率'}
                                </h3>
                                <div className="text-xs text-slate-500">
                                    全 {activeTab === 'coef' || activeTab === 'f_coef' ? config.coefSettings.type1.length : config.masterData2.length} 行
                                </div>
                            </div>
                            
                            {renderTable()}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-200 flex justify-between items-center bg-slate-50">
                    <div className="text-xs text-slate-500">
                        ※ マスタデータの変更は、現在のパターンのみに適用されます。
                    </div>
                    <button onClick={onClose} className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-2 rounded-lg font-bold transition-colors shadow-lg">
                        完了
                    </button>
                </div>
            </div>
        </div>
    );
};
