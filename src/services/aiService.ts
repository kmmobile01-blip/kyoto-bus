import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface AISuggestion {
    reasoning: string;
    suggestedConfig: {
        retirementAges: { type1: number; type2: number; type3: number; type4: number };
        pointValue: number;
        defaultYearlyEval: number;
        cutoffYears: { type1: number; type2: number; type3: number };
    };
}

export const getAISuggestion = async (
    currentConfig: any, 
    currentResults: any,
    userGoal: string
): Promise<AISuggestion> => {
    const model = "gemini-3-flash-preview";
    
    const prompt = `
あなたは人事労務コンサルタントです。現在の退職金制度シミュレーション結果に基づき、ユーザーの目標を達成するための最適なパラメータを提案してください。

【現在の設定】
${JSON.stringify(currentConfig, null, 2)}

【現在のシミュレーション結果】
${JSON.stringify(currentResults, null, 2)}

【ユーザーの目標】
${userGoal}

以下の形式のJSONで回答してください。
- reasoning: なぜその数値を提案したかの理由（日本語）
- suggestedConfig: 提案するパラメータ
  - retirementAges: 各区分の定年年齢 (50-80)
  - pointValue: ポイント単価 (100-10000)
  - defaultYearlyEval: 標準考課ポイント (0-100)
  - cutoffYears: 職能ポイントの上限年数 (10-60)
`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    reasoning: { type: Type.STRING },
                    suggestedConfig: {
                        type: Type.OBJECT,
                        properties: {
                            retirementAges: {
                                type: Type.OBJECT,
                                properties: {
                                    type1: { type: Type.NUMBER },
                                    type2: { type: Type.NUMBER },
                                    type3: { type: Type.NUMBER },
                                    type4: { type: Type.NUMBER },
                                },
                                required: ['type1', 'type2', 'type3', 'type4']
                            },
                            pointValue: { type: Type.NUMBER },
                            defaultYearlyEval: { type: Type.NUMBER },
                            cutoffYears: {
                                type: Type.OBJECT,
                                properties: {
                                    type1: { type: Type.NUMBER },
                                    type2: { type: Type.NUMBER },
                                    type3: { type: Type.NUMBER },
                                },
                                required: ['type1', 'type2', 'type3']
                            }
                        },
                        required: ['retirementAges', 'pointValue', 'defaultYearlyEval', 'cutoffYears']
                    }
                },
                required: ['reasoning', 'suggestedConfig']
            }
        }
    });

    return JSON.parse(response.text || '{}') as AISuggestion;
};
