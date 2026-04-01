import { 
    EmployeeInputRow, 
    SimulationConfig, 
    AggregatedYearlyData, 
    YearlyDetail,
    CalculationResult
} from './types';

interface AggregationParams {
    data: EmployeeInputRow[];
    configA: SimulationConfig;
    configB: SimulationConfig;
    runCalculation: (row: EmployeeInputRow, config: SimulationConfig, targetB?: number, targetReserve2026?: number) => CalculationResult | null;
    onProgress?: (progress: number, remainingTime: number) => void;
    isCancelled?: () => boolean;
}

export const calculateAggregatedCosts = async ({
    data,
    configA,
    configB,
    runCalculation,
    onProgress,
    isCancelled = () => false
}: AggregationParams): Promise<AggregatedYearlyData[]> => {
    if (!data || data.length === 0) {
        return [];
    }

    const costsMap = new Map<number, {
        A: { t1: number, t2: number, t3: number, t4: number },
        B: { t1: number, t2: number, t3: number, t4: number },
        counts: { t1: number, t2: number, t3: number, t4: number }
    }>();

    // 2025年度から集計開始 (期間延長: 2080まで)
    for (let y = 2025; y <= 2080; y++) {
        costsMap.set(y, {
            A: { t1: 0, t2: 0, t3: 0, t4: 0 },
            B: { t1: 0, t2: 0, t3: 0, t4: 0 },
            counts: { t1: 0, t2: 0, t3: 0, t4: 0 }
        });
    }

    const d1999 = new Date(1999, 2, 31);
    const d2000 = new Date(2000, 2, 31);
    const d2011 = new Date(2011, 8, 30);

    let index = 0;
    const BATCH_SIZE = 50;
    const startTime = Date.now();

    while (index < data.length) {
        if (isCancelled()) return [];
        let count = 0;
        while (index < data.length && count < BATCH_SIZE) {
            const row = data[index];
            // Must calculate B first to handle Adjustment Mode in A
            const resB = runCalculation(row, configB);
            const targetAmount = (configA.adjustmentConfig?.enabled || configA.unifyNewSystemConfig?.enabled) && resB ? resB.retirementAllowance : undefined;
            const targetReserve = (configA.adjustmentConfig?.enabled || configA.unifyNewSystemConfig?.enabled) && resB ? resB.reserve2026 : undefined;
            
            const resA = runCalculation(row, configA, targetAmount, targetReserve);

            if (resA && resB) {
                // Determine System Type based on join date
                const jd = resA.joinDate;
                let typeKey: 't1' | 't2' | 't3' | 't4' = 't4';
                if (jd <= d1999) typeKey = 't1';
                else if (jd <= d2000) typeKey = 't2';
                else if (jd <= d2011) typeKey = 't3';

                // For counts: check if active at fiscal year end
                // 2025年度から集計
                for (let y = 2025; y <= 2080; y++) {
                    const fiscalYearEnd = new Date(y + 1, 2, 31);
                    if (resA.retirementDate >= fiscalYearEnd) {
                        if(costsMap.has(y)) costsMap.get(y)!.counts[typeKey] += 1;
                    }
                }

                // For costs
                resA.yearlyDetails.forEach((d: YearlyDetail) => { if (costsMap.has(d.year)) costsMap.get(d.year)!.A[typeKey] += d.amountInc; });
                resB.yearlyDetails.forEach((d: YearlyDetail) => { if (costsMap.has(d.year)) costsMap.get(d.year)!.B[typeKey] += d.amountInc; });
            }
            index++;
            count++;
        }
        
        const currentProgress = Math.round((index / data.length) * 100);
        const elapsedTime = Date.now() - startTime;
        const estimatedTotalTime = (elapsedTime / index) * data.length;
        const remainingTime = Math.max(0, Math.round((estimatedTotalTime - elapsedTime) / 1000));
        
        if (onProgress) {
            onProgress(currentProgress, remainingTime);
        }
        
        await new Promise(r => setTimeout(r, 0));
    }

    if (isCancelled()) return [];

    const sorted: AggregatedYearlyData[] = Array.from(costsMap.entries())
        .map(([year, val]) => {
            const totalA = val.A.t1 + val.A.t2 + val.A.t3 + val.A.t4;
            const totalB = val.B.t1 + val.B.t2 + val.B.t3 + val.B.t4;
            const totalCount = val.counts.t1 + val.counts.t2 + val.counts.t3 + val.counts.t4;
            return {
                year,
                A: { type1: val.A.t1, type2: val.A.t2, type3: val.A.t3, type4: val.A.t4, total: totalA },
                B: { type1: val.B.t1, type2: val.B.t2, type3: val.B.t3, type4: val.B.t4, total: totalB },
                counts: { type1: val.counts.t1, type2: val.counts.t2, type3: val.counts.t3, type4: val.counts.t4, total: totalCount }
            };
        })
        .sort((a, b) => a.year - b.year);
    
    return sorted;
};
