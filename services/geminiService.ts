import { GoogleGenAI } from "@google/genai";

// Initialize the client
// The API key is injected via the environment variable process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash-image'; 

/**
 * Helper to extract mime type and base64 data from a data URL
 */
const parseDataUrl = (dataUrl: string): { mimeType: string; base64Data: string } => {
  const matches = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (matches && matches.length === 3) {
    return {
      mimeType: matches[1],
      base64Data: matches[2]
    };
  }
  // Fallback if format is unexpected, though usually input should be a valid data URL
  return {
    mimeType: 'image/jpeg',
    base64Data: dataUrl.replace(/^data:image\/\w+;base64,/, "")
  };
};

/**
 * Sends an image and a prompt to Gemini to generate an edited version.
 */
export const generateEditedImage = async (
  imageBase64: string,
  prompt: string
): Promise<string> => {
  try {
    const { mimeType, base64Data } = parseDataUrl(imageBase64);

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: `${prompt} Maintain the same aspect ratio and resolution if possible. Return ONLY the image.`,
          },
        ],
      },
    });

    // Iterate through parts to find the image
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
        const parts = candidates[0].content.parts;
        for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }

    throw new Error("No image data received from AI response.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};