// app/api/ocr/route.ts
import { NextResponse } from 'next/server';
import scribe from 'scribe.js-ocr';

export async function POST(req: Request) {
    const { imageUrl } = await req.json();
    const text = await scribe.recognize(imageUrl);
    return NextResponse.json({ text });
}
