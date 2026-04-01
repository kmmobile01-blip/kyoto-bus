import { describe, it, expect, vi } from 'vitest';
import { calculateAggregatedCosts } from './aggregationUtils';
import { 
    EmployeeInputRow, 
    SimulationConfig, 
    CalculationResult 
} from './types';
import { 
    DEFAULT_TABLE_1_1, 
    DEFAULT_TABLE_1_2, 
    DEFAULT_TABLE_1_3, 
    DEFAULT_TABLE_2, 
    DEFAULT_COEF_SETTINGS 
} from './constants';

const mockConfig: SimulationConfig = {
    label: 'Test Config',
    unitPrice: 10000,
    masterDataSource: 'default',
    defaultYearlyEval: 0,
    retirementAges: { type1: 60, type2: 60, type3: 60, type4: 60 },
    cutoffYears: { type1: 35, type2: 36, type3: 37 },
    defaultYearlyEvalFuture: 0,
    retirementAgesFuture: { type1: 60, type2: 60, type3: 60, type4: 60 },
    cutoffYearsFuture: { type1: 35, type2: 36, type3: 37 },
    transitionConfig: { enabled: false, date: new Date(2027, 2, 31) },
    adjustmentConfig: { enabled: false },
    unifyNewSystemConfig: { enabled: false },
    masterData1_1: DEFAULT_TABLE_1_1,
    masterData1_2: DEFAULT_TABLE_1_2,
    masterData1_3: DEFAULT_TABLE_1_3,
    masterData2: DEFAULT_TABLE_2,
    masterDataFuture: {
        type1: [], type2: [], type3: [], type4: []
    },
    coefSettings: DEFAULT_COEF_SETTINGS,
    coefSettingsFuture: DEFAULT_COEF_SETTINGS,
};

describe('calculateAggregatedCosts', () => {
    it('aggregates data correctly for a single employee', async () => {
        const data: EmployeeInputRow[] = [
            { '社員番号': '1', '氏名': 'User 1', '生年月日': '1990-01-01', '入社日': '2015-04-01', '資格': '1等級' }
        ];

        const mockRunCalculation = vi.fn().mockReturnValue({
            employeeId: '1',
            name: 'User 1',
            joinDate: new Date(2015, 3, 1),
            retirementDate: new Date(2050, 0, 1),
            retirementAllowance: 1000000,
            yearlyDetails: [
                { year: 2025, amountInc: 10000, totalPt: 1, age: 35, losPtInc: 1, rankPtInc: 0, evalPtInc: 0, adjustmentPtInc: 0, coef: 1 },
                { year: 2026, amountInc: 15000, totalPt: 2, age: 36, losPtInc: 1, rankPtInc: 0, evalPtInc: 0, adjustmentPtInc: 0, coef: 1 }
            ]
        } as CalculationResult);

        const results = await calculateAggregatedCosts({
            data,
            configA: mockConfig,
            configB: mockConfig,
            runCalculation: mockRunCalculation
        });

        expect(results.length).toBeGreaterThan(0);
        const data2025 = results.find(r => r.year === 2025);
        expect(data2025?.A.total).toBe(10000);
        expect(data2025?.B.total).toBe(10000);
        expect(data2025?.counts.total).toBe(1);

        const data2026 = results.find(r => r.year === 2026);
        expect(data2026?.A.total).toBe(15000);
        expect(data2026?.counts.total).toBe(1);
    });

    it('handles empty data', async () => {
        const results = await calculateAggregatedCosts({
            data: [],
            configA: mockConfig,
            configB: mockConfig,
            runCalculation: vi.fn()
        });
        expect(results).toEqual([]);
    });

    it('respects cancellation', async () => {
        const data: EmployeeInputRow[] = [
            { '社員番号': '1', '氏名': 'User 1', '生年月日': '1990-01-01', '入社日': '2015-04-01', '資格': '1等級' }
        ];
        const results = await calculateAggregatedCosts({
            data,
            configA: mockConfig,
            configB: mockConfig,
            runCalculation: vi.fn(),
            isCancelled: () => true
        });
        expect(results).toEqual([]);
    });
});
