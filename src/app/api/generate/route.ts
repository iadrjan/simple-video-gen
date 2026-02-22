import { NextResponse } from 'next/server';

// DEFINING THE CLIENT
// We use 'require' here to avoid strict TypeScript build errors
let client: any;
try {
  const sdk = require('z-ai-web-dev-sdk');
  // Handle both default and named exports automatically
  const ZAIClient = sdk.ZAIClient || sdk.default || sdk; 
  client = new ZAIClient({
    apiKey: process.env.Z_AI_API_KEY || '',
  });
} catch (e) {
  console.error('Failed to load SDK:', e);
}

const VALID_CODES = ['ASJVIP', 'TEST', 'JIMENEZ_2025_OWNER#'];

export async function POST(request: Request) {
  try {
    const { prompt, accessCode } = await request.json();

    if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    
    if (!VALID_CODES.includes(accessCode?.trim())) {
      return NextResponse.json({ error: 'Invalid Access Code' }, { status: 401 });
    }

    // CHECK IF API KEY IS READY
    if (!process.env.Z_AI_API_KEY) {
      console.log('No API Key found. Returning mock video.');
      await new Promise(r => setTimeout(r, 1000));
      return NextResponse.json({ 
        url: "https://files.catbox.moe/2f9szw.zip", 
        mock: true,
        message: "Please add Z_AI_API_KEY to Vercel Settings"
      });
    }

    console.log('Generating Real Video with Z.ai...');
    
    const completion = await client.video.create({
      prompt: prompt,
      duration: 5,
      fps: 24,
    });

    return NextResponse.json({ url: completion.url });

  } catch (error) {
    console.error('Generation Error:', error);
    // If the real generation fails, we fall back to a helpful error
    return NextResponse.json({ 
      error: 'Generation Failed', 
      details: error instanceof Error ? error.message : 'Unknown' 
    }, { status: 500 });
  }
}
