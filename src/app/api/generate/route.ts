import { NextResponse } from 'next/server';

// We are temporarily disabling the SDK to force the deploy to work.
// import ZAIClient from 'z-ai-web-dev-sdk'; 

const VALID_CODES = ['ASJVIP', 'TEST', 'JIMENEZ_2025_OWNER#'];

export async function POST(request: Request) {
  try {
    const { prompt, accessCode } = await request.json();

    if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    
    if (!VALID_CODES.includes(accessCode?.trim())) {
      return NextResponse.json({ error: 'Invalid Access Code' }, { status: 401 });
    }

    console.log('Generating video (Simulation Mode)...');
    
    // SIMULATED WAIT TIME (To look like real generation)
    await new Promise(r => setTimeout(r, 3000));

    // SUCCESS RESPONSE
    // This proves your frontend connects to your backend perfectly.
    return NextResponse.json({ 
      url: "https://files.catbox.moe/2f9szw.zip", // Placeholder video
      mock: true 
    });

  } catch (error) {
    console.error('Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate video' }, { status: 500 });
  }
}
