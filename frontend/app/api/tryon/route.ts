import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const personFile = formData.get("person") as File | null;
    const clothingFile = formData.get("clothing") as File | null;

    if (!personFile || !clothingFile) {
      return NextResponse.json(
        { error: "Both a person photo and a clothing photo are required." },
        { status: 400 }
      );
    }

    // Convert browser File objects → base64 strings so Gemini can read them.
    const personBase64 = Buffer.from(await personFile.arrayBuffer()).toString("base64");
    const clothingBase64 = Buffer.from(await clothingFile.arrayBuffer()).toString("base64");

    // New SDK (@google/genai): initialised differently from the old @google/generative-ai.
    // The API key is read from .env.local — never sent to the browser.
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! });

    const prompt =
      "You are a virtual try-on assistant. " +
      "The first image is a photo of a person. " +
      "The second image is a clothing item. " +
      "Generate a photorealistic image of that person wearing that clothing item. " +
      "Keep the person's face, body proportions, and background consistent with the original photo.";

    // New SDK uses ai.models.generateContent() — a top-level call instead of
    // instantiating a model object first. contents is an array of Parts.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        { text: prompt },
        { inlineData: { mimeType: personFile.type || "image/jpeg", data: personBase64 } },
        { inlineData: { mimeType: clothingFile.type || "image/jpeg", data: clothingBase64 } },
      ],
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      return NextResponse.json({ error: "Gemini returned an empty response." }, { status: 500 });
    }

    // Find the image part in the response
    const imagePart = parts.find((p) => p.inlineData?.mimeType?.startsWith("image/"));
    if (!imagePart?.inlineData) {
      const textPart = parts.find((p) => p.text);
      return NextResponse.json(
        { error: "Gemini did not return an image.", detail: textPart?.text },
        { status: 500 }
      );
    }

    // Return as a data URL so <img src="..."> can render it directly in the browser
    const dataUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
    return NextResponse.json({ imageUrl: dataUrl });
  } catch (err) {
    console.error("[/api/tryon]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected server error." },
      { status: 500 }
    );
  }
}
