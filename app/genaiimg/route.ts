import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";
import fs from "fs";

const genai = new GoogleGenAI({
  apiKey: process.env.GENKEY || "",
});

export const POST = async (req: NextRequest) => {
  const { prompt, noi } = await req.json();
  const response = await genai.models.generateImages({
    model: "imagen-4.0-generate-001",
    prompt,
    config: {
      numberOfImages: noi || 1,
    },
  });
  let idx = 1;
  let gi = [];
  if (!fs.existsSync("imgs")) {
    fs.mkdirSync("imgs");
  }
  if (response.generatedImages) {
    for (const generatedImage of response.generatedImages) {
      let imgBytes = generatedImage?.image?.imageBytes;
      if (imgBytes) {
        const buffer = Buffer.from(imgBytes, "base64");
        fs.writeFileSync(`imgs/imagen-${idx}.png`, buffer);
        gi.push(`imgs/imagen-${idx}.png`);
        idx++;
      }
    }
  }
  return new Response(JSON.stringify({ images: gi }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
