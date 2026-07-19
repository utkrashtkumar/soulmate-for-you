// API Route: /api/chat
// Multi-provider AI fallback system (Google Gemini + Groq + OpenRouter)
// Guarantees high availability & zero downtime during simultaneous multi-user chats

const inFlight = new Map();

// Helper to call Google Gemini API (Free 1,500 requests/day, 15 req/min)
async function callGemini(model, messages, systemPrompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('NO_GEMINI_KEY');

  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 250,
        topP: 0.9,
      },
    }),
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.warn(`[Gemini:${model}] error ${response.status}:`, errText);
    throw new Error(`GEMINI_ERR_${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error('GEMINI_EMPTY_RESPONSE');
  return text;
}

// Helper to call Groq API (Free 14,400 requests/day)
async function callGroq(model, messages, systemPrompt) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('NO_GROQ_KEY');

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.88,
      max_tokens: 220,
      top_p: 0.92,
      stream: false,
    }),
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.warn(`[Groq:${model}] error ${response.status}:`, errText);
    throw new Error(`GROQ_ERR_${response.status}`);
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content?.trim();
  if (!reply) throw new Error('GROQ_EMPTY_RESPONSE');
  return reply;
}

// Helper to call OpenRouter API (Free models tier)
async function callOpenRouter(model, messages, systemPrompt) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('NO_OPENROUTER_KEY');

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://soulmatelove.in',
      'X-Title': 'Soulmate AI',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.85,
      max_tokens: 220,
    }),
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.warn(`[OpenRouter:${model}] error ${response.status}:`, errText);
    throw new Error(`OPENROUTER_ERR_${response.status}`);
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content?.trim();
  if (!reply) throw new Error('OPENROUTER_EMPTY_RESPONSE');
  return reply;
}

export async function POST(request) {
  try {
    const { messages, systemPrompt, avatarId } = await request.json();

    // Limit chat history to last 16 turns to keep prompt token size small & speed high
    const trimmedMessages = messages.slice(-16);

    // Request deduplication per avatar ID
    const dedupeKey = avatarId || 'global';
    if (inFlight.has(dedupeKey)) {
      try {
        const existingReply = await inFlight.get(dedupeKey);
        return Response.json({ reply: existingReply });
      } catch {
        // Previous in-flight failed, proceed with new request
      }
    }

    // Provider execution list — tries Gemini first if key exists, then Groq, then OpenRouter
    const providers = [
      // 1. Google Gemini (Best quality & high free tier limits)
      { name: 'Gemini-2.0-Flash', fn: () => callGemini('gemini-2.0-flash', trimmedMessages, systemPrompt) },
      { name: 'Gemini-2.0-Flash-Lite', fn: () => callGemini('gemini-2.0-flash-lite', trimmedMessages, systemPrompt) },
      { name: 'Gemini-Flash-Latest', fn: () => callGemini('gemini-flash-latest', trimmedMessages, systemPrompt) },

      // 2. Groq AI (Ultra-fast inference)
      { name: 'Groq-Llama3.3-70B', fn: () => callGroq('llama-3.3-70b-versatile', trimmedMessages, systemPrompt) },
      { name: 'Groq-Llama3.1-8B', fn: () => callGroq('llama-3.1-8b-instant', trimmedMessages, systemPrompt) },
      { name: 'Groq-Gemma2-9B', fn: () => callGroq('gemma2-9b-it', trimmedMessages, systemPrompt) },

      // 3. OpenRouter (Free Fallback Pool)
      { name: 'OpenRouter-Llama3.3-Free', fn: () => callOpenRouter('meta-llama/llama-3.3-70b-instruct:free', trimmedMessages, systemPrompt) },
      { name: 'OpenRouter-Llama3.2-Free', fn: () => callOpenRouter('meta-llama/llama-3.2-3b-instruct:free', trimmedMessages, systemPrompt) },
      { name: 'OpenRouter-Gemma-Free', fn: () => callOpenRouter('google/gemma-4-31b-it:free', trimmedMessages, systemPrompt) },
    ];

    const requestPromise = (async () => {
      let lastErr = null;
      for (const provider of providers) {
        try {
          const reply = await provider.fn();
          console.log(`[Chat API] Successfully responded using provider: ${provider.name}`);
          return reply;
        } catch (err) {
          lastErr = err;
          // Silently skip if key missing, otherwise log fallback
          if (!err.message.startsWith('NO_')) {
            console.warn(`[Chat API] Provider ${provider.name} failed: ${err.message}. Trying next...`);
          }
        }
      }
      throw lastErr || new Error('ALL_PROVIDERS_EXHAUSTED');
    })();

    inFlight.set(dedupeKey, requestPromise);

    let reply;
    try {
      reply = await requestPromise;
    } finally {
      inFlight.delete(dedupeKey);
    }

    return Response.json({ reply });

  } catch (err) {
    console.error('[Chat API] Final failure:', err.message);

    const FALLBACKS = [
      'Ek sec ruko... thoda busy hai network 🥺 dobara bhejo?',
      'Arrey yaar, connection thoda slow lag raha hai... phir try karo 💕',
      'Hmm... kuch toh ho gaya signal mein 📶 ek baar aur bhejo?',
      'Wait karo thodi der... abhi aati hoon 🌸',
    ];
    const fallback = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];

    return Response.json({ reply: fallback }, { status: 200 });
  }
}
