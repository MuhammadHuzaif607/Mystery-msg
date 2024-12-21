import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export async function GET(req: Request) {
  //   const { prompt } = await req.json();

  try {
    const { text } = await generateText({
      model: openai('gpt-3.5-turbo'),
      prompt: 'Write a vegetarian lasagna recipe for 4 people.',
    });

    return Response.json(
      {
        success: true,
        text,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error('Error getting response', err);
    return Response.json(
      {
        success: false,
        message: 'Error getting response',
      },
      {
        status: 500,
      }
    );
  }
}
