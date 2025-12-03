import { GoogleGenAI } from "@google/genai";
import { MOCK_RECEIPT_PROMPT } from "../constants";

// Initialize Gemini Client
const apiKey = process.env.API_KEY || ''; 
// Note: In a real production app, we would handle missing keys gracefully in the UI.
// For this code generation, we assume the environment is set up as per instructions.

const ai = new GoogleGenAI({ apiKey });

export interface ParsedReceipt {
  items: { name: string; price: number }[];
  subtotal?: number;
  tax?: number;
  tip?: number;
}

export const parseReceiptImage = async (base64Image: string, mimeType: string): Promise<ParsedReceipt> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: MOCK_RECEIPT_PROMPT
          }
        ]
      },
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text);
    return data as ParsedReceipt;

  } catch (error) {
    console.error("Error parsing receipt:", error);
    throw error;
  }
};