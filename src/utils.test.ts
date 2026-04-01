import { describe, it, expect } from 'vitest';
import { 
    calculatePeriodYears, 
    processRow, 
    parseDate 
} from './utils';
import { 
    DEFAULT_TABLE_1_1, 
    DEFAULT_TABLE_1_2, 
    DEFAULT_TABLE_1_3, 
    DEFAULT_TABLE_2, 
    DEFAULT_COEF_SETTINGS 
} from './constants';
import { 
    TableRowT2, 
    RetirementAgeSettings, 
    CutoffYears, 
    FractionConfig, 
    TransitionConfig,
    AdjustmentConfig,
    UnifyNewSystemConfig
} from './types';

// Helper to convert T1 to T2 for masterDataFuture
const convertT1toT2 = (t1: any[]): TableRowT2[] => {
    return t1.map(row => ({
        y: row.y,
        los: row.los1,
        r1: row.r1_1,
        r2: row.r2,
        r3: row.r3,
        r4: row.r4,
        r5: row.r5,
        r6: row.r6
    }));
};

const defaultMasterDataFuture = {
    type1: convertT1toT2(DEFAULT_TABLE_1_1),
    type2: convertT1toT2(DEFAULT_TABLE_1_2),
    type3: convertT1toT2(DEFAULT_TABLE_1_3),
    type4: DEFAULT_TABLE_2,
};

const defaultRetirementAges: RetirementAgeSettings = { type1: 60, type2: 60, type3: 60, type4: 60 };
const defaultCutoffYears: CutoffYears = { type1: 35, type2: 36, type3: 37 };
const defaultFractionConfig: FractionConfig = { 
    los: 'ceil', rank: 'ceil', eval: 'ceil', 
    losDateMode: 'end_of_month', rankDateMode: 'end_of_month', evalDateMode: 'end_of_month' 
};
const defaultTransitionConfig: TransitionConfig = { enabled: false, date: new Date(2027, 2, 31) };

describe('calculatePeriodYears', () => {
    it('calculates years correctly in ceil mode', () => {
        const start = new Date(2020, 0, 1);
        const end = new Date(2021, 0, 1);
        expect(calculatePeriodYears(start, end, 'ceil')).toBe(1);
        
        const endPlus1Day = new Date(2021, 0, 2);
        expect(calculatePeriodYears(start, endPlus1Day, 'ceil')).toBe(1.0833); // 1 year + 1 month (1/12)
    });

    it('calculates years correctly in daily mode', () => {
        const start = new Date(2020, 0, 1);
        const end = new Date(2020, 0, 31); // 30 days
        expect(calculatePeriodYears(start, end, 'daily')).toBe(0.0822); // 30/365 = 0.08219...
    });
});

describe('processRow', () => {
    const commonParams = [
        DEFAULT_TABLE_1_1,
        DEFAULT_TABLE_1_2,
        DEFAULT_TABLE_1_3,
        DEFAULT_TABLE_2,
        defaultMasterDataFuture,
        defaultRetirementAges,
        defaultCutoffYears,
        DEFAULT_COEF_SETTINGS,
        DEFAULT_COEF_SETTINGS,
        0, // defaultYearlyEval
        defaultFractionConfig,
        false, // includeCurrentFiscalYear
        10000, // unitPrice
        defaultTransitionConfig
    ] as const;

    it('calculates retirement for a standard new system employee (Type 4)', () => {
        const row = {
            '社員番号': 'T4-001',
            '氏名': 'Test T4',
            '生年月日': '1990-01-01',
            '入社日': '2015-04-01',
            '資格': '1等級'
        };

        const result = processRow(row, ...commonParams);
        expect(result).not.toBeNull();
        if (result) {
            expect(result.typeName).toBe('新制度');
            expect(result.retirementDate.getFullYear()).toBe(2050);
            expect(result.retirementAllowance).toBeGreaterThan(0);
        }
    });

    it('calculates retirement for an old system employee (Type 1)', () => {
        const row = {
            '社員番号': 'T1-001',
            '氏名': 'Test T1',
            '生年月日': '1970-01-01',
            '入社日': '1995-04-01',
            '資格': '課長'
        };

        const result = processRow(row, ...commonParams);
        expect(result).not.toBeNull();
        if (result) {
            expect(result.typeName).toBe('旧制度①');
            expect(result.retirementDate.getFullYear()).toBe(2030);
        }
    });

    it('handles transition mode correctly', () => {
        const row = {
            '社員番号': 'TRANS-001',
            '氏名': 'Test Transition',
            '生年月日': '1980-01-01',
            '入社日': '2005-04-01',
            '資格': '係長'
        };

        const transitionConfig: TransitionConfig = { enabled: true, date: new Date(2030, 3, 1) };
        const retirementAgesFuture: RetirementAgeSettings = { type1: 65, type2: 65, type3: 65, type4: 65 };

        const result = processRow(
            row,
            DEFAULT_TABLE_1_1,
            DEFAULT_TABLE_1_2,
            DEFAULT_TABLE_1_3,
            DEFAULT_TABLE_2,
            defaultMasterDataFuture,
            defaultRetirementAges,
            defaultCutoffYears,
            DEFAULT_COEF_SETTINGS,
            DEFAULT_COEF_SETTINGS,
            0,
            defaultFractionConfig,
            false,
            10000,
            transitionConfig,
            retirementAgesFuture
        );

        expect(result).not.toBeNull();
        if (result) {
            // Retirement age should be 65 because retirement date (2040) is after transition date (2030)
            expect(result.retirementDate.getFullYear()).toBe(2045);
        }
    });

    it('handles adjustment mode correctly', () => {
        const row = {
            '社員番号': 'ADJ-001',
            '氏名': 'Test Adjustment',
            '生年月日': '1980-01-01',
            '入社日': '2005-04-01',
            '資格': '係長'
        };

        const adjustmentConfig: AdjustmentConfig = { 
            enabled: true, 
            retirementAges: { type1: 65, type2: 65, type3: 65, type4: 65 } 
        };

        const result = processRow(
            row,
            DEFAULT_TABLE_1_1,
            DEFAULT_TABLE_1_2,
            DEFAULT_TABLE_1_3,
            DEFAULT_TABLE_2,
            defaultMasterDataFuture,
            defaultRetirementAges,
            defaultCutoffYears,
            DEFAULT_COEF_SETTINGS,
            DEFAULT_COEF_SETTINGS,
            0,
            defaultFractionConfig,
            false,
            10000,
            defaultTransitionConfig,
            undefined, // retirementAgesFuture
            undefined, // cutoffYearsFuture
            undefined, // defaultYearlyEvalFuture
            adjustmentConfig,
            undefined, // unifyNewSystemConfig
            5000000 // targetRetirementAllowance
        );

        expect(result).not.toBeNull();
        if (result) {
            expect(result.retirementDate.getFullYear()).toBe(2045);
            // In adjustment mode, the final allowance should be close to target
            expect(Math.abs(result.retirementAllowance - 5000000)).toBeLessThan(100);
        }
    });

    it('applies 6-year rule for employees joined after 2014/4/3', () => {
        const row = {
            '社員番号': 'RULE6-001',
            '氏名': 'Test 6Year Rule',
            '生年月日': '2000-01-01',
            '入社日': '2015-01-01', // Joined after 2014/4/3
            '資格': '1等級'
        };

        // Mock a case where they retire before 6 years (unlikely in real scenario but good for test)
        // We can manipulate the retirement age to be very young or just check the logic
        // Actually, the logic checks retireDateLos < dJoinPlus6Years
        
        const youngRetirementAges: RetirementAgeSettings = { type1: 20, type2: 20, type3: 20, type4: 20 };

        const result = processRow(
            row,
            DEFAULT_TABLE_1_1,
            DEFAULT_TABLE_1_2,
            DEFAULT_TABLE_1_3,
            DEFAULT_TABLE_2,
            defaultMasterDataFuture,
            youngRetirementAges,
            defaultCutoffYears,
            DEFAULT_COEF_SETTINGS,
            DEFAULT_COEF_SETTINGS,
            0,
            defaultFractionConfig,
            false,
            10000,
            defaultTransitionConfig
        );

        expect(result).not.toBeNull();
        if (result) {
            expect(result.retirementAllowance).toBe(0); // Should be 0 due to 6-year rule
        }
    });

    it('handles unifyNewSystemConfig correctly', () => {
        const row = {
            '社員番号': 'UNIFY-001',
            '氏名': 'Test Unify',
            '生年月日': '1980-01-01',
            '入社日': '2005-04-01', // Type 3
            '資格': '係長'
        };

        const unifyNewSystemConfig: UnifyNewSystemConfig = {
            enabled: true,
            retirementAges: { type1: 60, type2: 60, type3: 65, type4: 65 },
            targetTypes: { type1: false, type2: false, type3: true, type4: true }
        };

        const result = processRow(
            row,
            DEFAULT_TABLE_1_1,
            DEFAULT_TABLE_1_2,
            DEFAULT_TABLE_1_3,
            DEFAULT_TABLE_2,
            defaultMasterDataFuture,
            defaultRetirementAges,
            defaultCutoffYears,
            DEFAULT_COEF_SETTINGS,
            DEFAULT_COEF_SETTINGS,
            0,
            defaultFractionConfig,
            false,
            10000,
            defaultTransitionConfig,
            undefined,
            undefined,
            undefined,
            undefined,
            unifyNewSystemConfig
        );

        expect(result).not.toBeNull();
        if (result) {
            // Retirement age should be 65 for Type 3
            expect(result.retirementDate.getFullYear()).toBe(2045);
        }
    });
});
