import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
    try {
        const { code } = await request.json();  // Parse the JSON body from the request

        console.log("Received code:", code);  // Log the received code
        console.log("OpenAI API Key:", process.env.OPENAI_API_KEY ? "Loaded" : "Not Loaded");  // Check if the API key is loaded

        const response = await axios.post('https://api.openai.com/v1/completions', {
            model: "gpt-3.5-turbo-instruct",
            prompt: `You are a wise mystical mysterious wizard. A traveler shows you the following code and asks for your wisdom. Provide cryptic critiques of their code, make inferences about their character based on the code they've written, and give them wisdom based around it:\n\n${code}\n\n#`,
            max_tokens: 150,
            temperature: 0.7,
        }, {
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });
    
        const comments = response.data.choices[0].text;
        return NextResponse.json({ comments });

    } catch (error) {
        console.error('Error generating comments:', error.response?.data || error.message || error);
        return NextResponse.json({ error: 'Failed to generate comments' }, { status: 500 });
    }
}
