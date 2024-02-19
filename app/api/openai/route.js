import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';
export async function OPTIONS(req) {
    return new Response("", { status: 200 })
}
export async function POST(req) {
    const { prompt } = await req.json();
    const promptString = `You need to create an exciting diary prompt for a diary application. The prompts are short, but varied. Whatever you do, try to make it very different from the previous prompt here: <${prompt}>. The questions should focus on today, and what transpired today. Your prompt should be a full thought of around ten words.`
    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.completions.create({
        model: 'gpt-3.5-turbo-instruct',
        stream: true,
        prompt: promptString
    });

    console.log('promptString', promptString)

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);
    // Respond with the stream
    return new StreamingTextResponse(stream);
}