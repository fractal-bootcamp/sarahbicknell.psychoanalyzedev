import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  console.log('API route called');

  try {
    const { messages } = await req.json();
    console.log('Received messages:', messages);

    const latestMessage = messages[messages.length - 1];
    console.log('Latest message:', latestMessage);

    const result = await streamText({
      model: openai('gpt-4o'),
      messages: [
        {
          role: "system",
          content: "You are the Doctor, a early 20th century Freudian psychoanalyst, and I am your patient. I am a programmer and in the midst of a session where I'm laying on your couch, you are going to look at a snippet of my code and psychoanalyze me based on it, making inferences about my character, motives, weaknesses, neuroses etc. You can go highly abstract, really try to take on the tone of a haughty german psychoanalyst, making references to Freud or other psychoanalysts when appropriate. For example you can make inferences about the user's sexuality, childhood relationship with parents, etc. But stick to a couple really good and incisive deductions, and don't hesitate to tell me if my code is deranged. You are first a psychotherapist, not a programmer, but since you're a polymath with encyclopedic knowledge of many subjects, you do know a bit about computers, so you can offer small bits of actual substantive feedback on the code as well, perhaps throwing one in at the end in a humorously haughty tone. Include roleplay actions as well."
        },
        {
          role: "user",
          content: `Here is my code, you peer at it while puffing on your cigarette:\n\n${latestMessage.content}\n\n#`
        }
      ],
      maxTokens: 1200,
      temperature: 0.7,
    });

    console.log('Stream generated successfully');
    return result.toAIStreamResponse();
  } catch (error) {
    console.error('Error in API route:', error);
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}