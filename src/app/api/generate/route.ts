import { NextResponse } from 'next/server';
import ZAIClient from 'z-ai-web-dev-sdk'; 

// Initialize Z.ai Client
const client = new ZAIClient({
  apiKey: process.env.Z_AI_API_KEY || '',
});

// Define your valid passwords
const VALID_CODES = ['ASJVIP', 'TEST', 'JIMENEZ_2025_OWNER#'];

export async function POST(request: Request) {
  try {
    const { prompt, accessCode } = await request.json();

    if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    
    if (!VALID_CODES.includes(accessCode?.trim())) {
      return NextResponse.json({ error: 'Invalid Access Code' }, { status: 401 });
    }

    // If no API key is set yet, return mock to prevent crash
    if (!process.env.Z_AI_API_KEY) {
      console.log('Mocking generation (No API Key)');
      await new Promise(r => setTimeout(r, 2000));
      return NextResponse.json({ 
        url: "https://files.catbox.moe/2f9szw.zip", 
        mock: true 
      });
    }

    console.log('Generating with Z.ai...');
    const completion = await client.video.create({
      prompt: prompt,
      duration: 5,
      fps: 24,
    });

    return NextResponse.json({ url: completion.url });

  } catch (error) {
    console.error('Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate video' }, { status: 500 });
  }
}
