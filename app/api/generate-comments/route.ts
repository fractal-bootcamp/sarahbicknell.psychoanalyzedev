//generate comments api route
import { NextResponse } from "next/server";
import axios from "axios"

export default async function promptWizard(request, response) {
    //pull the code snippet from body of request
    const {code} = request.body
    
    try {
        const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
            prompt: `You are wise mystical mysterious wizard. A traveler shows you the following code and asks for your wisdom. Provide cryptic cryptic critiques of their code, also make inferences about their character based on the code they've written and give them wisdom based around it:\n\n${code}\n\n#`,
            max_tokens: 150,
            temperature: 0.7,
        }, {
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });
    
        const comments = response.data.choices[0].text;
        return NextResponse.json({ comments });

    } catch(error){
        console.error('Error generating comments:', error);
        return NextResponse.error();
    }
}