import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const { prompt } = await request.json();  // Parse the JSON body from the request

    console.log("Received prompt:", prompt);  // Log the received code
    console.log("OpenAI API Key:", process.env.OPENAI_API_KEY ? "Loaded" : "Not Loaded");  // Check if the API key is loaded

    const response = await axios.post('https://api.openai.com/v1/images/generations', {
      prompt: `Take this code snippet and imaginatively interpret it as a dark fantasy scene, conceptually representing what's going on in the code: \n\n${prompt}`,
      n: 1,
      size: "1024x1024"
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    const imageUrl = response.data.data[0].url;
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error.response?.data || error.message || error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
