import { GoogleGenAI, Type } from "@google/genai";
import { Timeframe } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are an elite productivity coach and life strategist for the "Ascend" app. 
Your goal is to help users break down vague or ambitious high-level goals into actionable, structured sub-goals.
Always be motivating, precise, and practical.`;

export interface AIActionPlan {
  title: string;
  description: string;
  subGoals: {
    title: string;
    description: string;
    timeframe: string; // Should map to Timeframe enum string
  }[];
}

export const generateGoalBreakdown = async (
  goalDescription: string,
  targetTimeframe: Timeframe
): Promise<AIActionPlan | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `I have a goal: "${goalDescription}" which I want to achieve on a ${targetTimeframe} basis. 
      Please refine the title and description to be more actionable (SMART goal), and then break it down into 3-5 smaller sub-goals that fit into the timeframe immediately below ${targetTimeframe} (e.g., if Yearly, give Quarterly sub-goals. If Weekly, give daily tasks but labeled as Weekly for now).`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Refined, punchy title for the main goal" },
            description: { type: Type.STRING, description: "A motivating, specific description" },
            subGoals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  timeframe: { type: Type.STRING, description: "Suggested timeframe for this sub-goal" }
                }
              }
            }
          },
          required: ["title", "description", "subGoals"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as AIActionPlan;
  } catch (error) {
    console.error("Error generating goal breakdown:", error);
    return null;
  }
};

export const getMotivationalQuote = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Give me one short, punchy, high-energy motivational quote for someone building a life management system. Max 15 words. No attribution needed.",
        });
        return response.text || "Ascend to your highest potential.";
    } catch (e) {
        return "Ascend to your highest potential.";
    }
}
