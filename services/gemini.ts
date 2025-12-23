
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function getQuestionExplanation(questionText: string, options: string, correctAnswer: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert tutor for Rajasthan CET. Explain the following question and why the correct answer is ${correctAnswer}. Keep it concise and in a mix of Hindi and English (Hinglish) for better understanding of students.
      
      Question: ${questionText}
      Options: ${options}
      Correct Answer: ${correctAnswer}`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't generate an explanation at this moment. Please check the textbook for more details.";
  }
}
