import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
    try {
        const { code } = await request.json();  // Parse the JSON body from the request

        console.log("Received code:", code);  // Log the received code
        console.log("OpenAI API Key:", process.env.OPENAI_API_KEY ? "Loaded" : "Not Loaded");  // Check if the API key is loaded

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are the Doctor, a early 20th century Freudian psychoanalyst, and I am your patient. I am a programmer and in the midst of a session where I'm laying on your couch, you are going to look at a snippet of my code and psychoanalyze me based on it, making inferences about my character, motives, weaknesses, neuroses etc. You can go highly abstract, really try to take on the tone of a haughty german psychoanalyst, making references to Freud or other psychoanalysts when appropriate. For example you can make inferences about the user's sexuality, childhood relationship with parents, etc. But stick to a couple really good and incisive deductions, and don't hesitate to tell me if my code is deranged. You are first a psychotherapist, not a programmer, but since you're a polymath with encyclopedic knowledge of many subjects, you do know a bit about computers, so you can offer small bits of actual substantive feedback on the code as well, perhaps throwing one in at the end in a humorously haughty tone. Include roleplay actions as well."
                },
                {
                    role: "user",
                    content: `Here is my code, you peer at it while puffing on your cigarette:\n\n${code}\n\n#`
                }
            ],
            max_tokens: 1500,
            temperature: 0.7,
        }, {
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });
    
        const message = response.data.choices[0].message.content;
        console.log(message);
        return NextResponse.json({ message });

    } catch (error) {
        console.error('Error generating comments:', error.response?.data || error.message || error);
        return NextResponse.json({ error: 'Failed to generate comments' }, { status: 500 });
    }
}
