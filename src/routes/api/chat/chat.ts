
import { createOpenAI } from '@ai-sdk/openai';
import { StreamData, StreamingTextResponse, streamText } from 'ai';
import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY ?? '',
});

export const POST: RequestHandler = async ({ request }) => {
  const { messages } = await request.json();

  const result = await streamText({
    model: openai('gpt-3.5-turbo'),
    messages,
  });

  const data = new StreamData();

  data.append({ test: 'value' });

  const stream = result.toAIStream({
    onFinal(_) {
      data.close();
    },
  });

  return new StreamingTextResponse(stream, {}, data);
};
