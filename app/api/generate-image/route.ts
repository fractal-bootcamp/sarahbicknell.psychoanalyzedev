//generate images api 

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  const { prompt } = await request.json();
  try {
    const response = await axios.post('https://api.openai.com/v1/images/generations', {
      prompt: `Take this code snippet and imaginatively interpret it as a dark fantasy image, conceptually representing something about what's going on in the code: \n\n${prompt}`,
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
    console.error('Error generating image:', error);
    return NextResponse.error();
  }
}
