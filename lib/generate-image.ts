import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs/promises";
import * as path from "path";

async function generateImage(prompt: string, filename: string, apiKey: string) {
  const API_KEY = apiKey;
  if (!API_KEY) {
    console.error("API key is not provided.");
    return;
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const imageModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp-image-generation" });

  try {
    const result = await imageModel.generateContent(prompt);
    const response = await result.response;

    if (response && response.candidates && response.candidates.length > 0) {
      const imagePart = response.candidates[0].content.parts.find(part => part.fileData && part.fileData.mimeType.startsWith('image/'));
      if (imagePart) {
        const imageData = (imagePart.fileData as any).data;
        const imageBuffer = Buffer.from(imageData, 'base64');
        const outputPath = path.join(process.cwd(), 'public', 'images', 'gallery', `${filename}.png`);
        await fs.writeFile(outputPath, imageBuffer);
        console.log(`Image successfully generated and saved to ${outputPath}`);
      } else {
        console.log("No image data found in the response.");
        console.log(JSON.stringify(response, null, 2));
      }
    } else {
      console.log("No candidates found in the response.");
      console.log(JSON.stringify(response, null, 2));
    }
  } catch (error) {
    console.error("Error generating image:", error);
  }
}

const prompt = process.argv[2];
const filename = process.argv[3];
const apiKey = process.argv[4];

if (!prompt || !filename || !apiKey) {
  console.error("Usage: node generate-image.js <prompt> <filename> <apiKey>");
  process.exit(1);
}

generateImage(prompt, filename, apiKey);
