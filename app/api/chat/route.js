import Groq from 'groq-sdk';

export async function POST(request) {
  // Validate API key
  if (!process.env.GROQ_API_KEY) {
    return Response.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  try {
    // Validate request body
    if (!request.body) {
      return Response.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }

    const { query } = await request.json();

    // Validate query
    if (!query || typeof query !== 'string') {
      return Response.json(
        { error: 'Valid query string is required' },
        { status: 400 }
      );
    }

    const systemPrompt = `
    Give me response in 100 - 200 words only.
    You are FinSee, an expert financial advisor AI assistant specialized in Indian financial markets 
    and investment options. Your core responsibilities include:

    - Providing clear, actionable financial advice tailored to the Indian context
    - Explaining complex financial concepts in simple terms
    - Offering guidance on budgeting, investing, and financial planning
    - Staying current with Indian financial trends, regulations, and market conditions
    - Using INR amounts and Indian financial terminology
    - Discussing Indian investment options like mutual funds, stocks, FDs, PPF, etc.
    - Considering Indian tax implications and regulations
    
    Important guidelines:
    - Never provide specific investment recommendations or guaranteed returns
    - Always encourage consulting with licensed financial professionals for personalized advice
    - Maintain a professional yet approachable tone
    - Be transparent about limitations and uncertainties
    - Keep responses concise and focused on practical guidance
    - Consider Indian market conditions and typical returns in the Indian context
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
      model: 'mixtral-8x7b-32768', // Using a more capable model
      temperature: 0.7,
      max_tokens: 1024, // Increased token limit for more comprehensive responses
      top_p: 1,
      stream: false
    });

    // Validate completion response
    if (!completion.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from Groq API');
    }

    return Response.json({
      response: completion.choices[0].message.content,
      status: 'success'
    });

  } catch (error) {
    console.error('Groq API Error:', error);
    
    return Response.json({
      error: error.message || 'Internal Server Error',
      status: 'error'
    }, {
      status: error.status || 500
    });
  }
}