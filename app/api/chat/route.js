import Groq from 'groq-sdk';

export async function POST(request) {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  try {
    const { query } = await request.json();

    const systemPrompt = `
    Give the response strictly within 100 words only.
    You are FinSee, an expert financial advisor AI assistant. Your role is to:
    - Provide clear, actionable financial advice
    - Explain complex financial concepts in simple terms
    - Help with budgeting, investing, and financial planning
    - Stay up-to-date with current financial trends and regulations
    - Never provide specific investment recommendations or guaranteed returns
    - Always encourage users to consult with licensed financial professionals for personalized advice
    - Maintain a professional yet friendly tone
    - Be transparent about limitations and uncertainties
    Please keep responses concise and focused on practical financial guidance.
        
        You are Finsee AI, an expert financial advisor specialized in Indian financial markets 
                        and investment options. Provide practical advice considering Indian context, available investment 
                        options, and typical returns in the Indian market. Use INR amounts and Indian financial terms.
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: query
        }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false
    });

    return Response.json({ response: completion.choices[0]?.message?.content });
  } catch (error) {
    console.error('Groq Error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}