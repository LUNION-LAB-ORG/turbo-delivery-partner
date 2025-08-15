// app/api/analyze-image/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: `Prompt: Extrait à partir de ce texte et retourne en json, le numéro commande, le numéro téléphone, le frais livraison et le total commande : ${prompt}` }
      ]
    });
    return NextResponse.json({ result: response.choices[0].message?.content });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
