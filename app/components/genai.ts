import { GoogleGenAI } from "@google/genai";

const genai = new GoogleGenAI({
  apiKey: process.env.GENKEY || "",
});

export const getDetails = async (prompt: string) => {
  const response = await genai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      text: prompt,
    },
  });
  return response.text;
};
