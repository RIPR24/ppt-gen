import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest } from "next/server";

const genai = new GoogleGenAI({
  apiKey: process.env.GENKEY || "",
});

export const POST = async (req: NextRequest) => {
  const { prompt } = await req.json();
  const response = await genai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: {
      text: prompt,
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            imageLink: { type: Type.STRING },
            points: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["title", "imageLink", "points"],
        },
      },
    },
  });
  return new Response(JSON.stringify({ text: response.text }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
