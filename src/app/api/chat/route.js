// API Route: /api/chat
// Connects to Groq (FREE) for AI responses

export async function POST(request) {
  try {
    const { messages, systemPrompt } = await request.json();

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.88,
        max_tokens: 250,
        top_p: 0.92,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq error:', errText);
      return Response.json({ reply: 'Abhi network thoda slow hai yaar... dobara try karo 🥺' }, { status: 200 });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Hmm... kuch toh sochna pad raha hai mujhe 🤔';

    return Response.json({ reply });
  } catch (err) {
    console.error('Chat API error:', err);
    return Response.json({ reply: 'Kuch toh gadbad ho gayi... try karo ek baar aur 💕' }, { status: 200 });
  }
}
