// API Route: /api/chat
// Connects to Groq (FREE) for AI responses
// Handles rate limits with retry + model fallback for multiple concurrent users

// Model fallback chain — try faster/lighter models if primary is rate-limited
const MODEL_CHAIN = [
  'llama-3.3-70b-versatile',       // Primary: Best quality
  'llama-3.1-8b-instant',          // Fallback 1: Faster, less likely rate-limited
  'gemma2-9b-it',                  // Fallback 2: Google Gemma, separate rate limit pool
  'mixtral-8x7b-32768',            // Fallback 3: Mixtral, separate pool
];

// In-memory request queue to prevent duplicate simultaneous calls per avatar
const inFlight = new Map();

async function callGroq(model, messages, systemPrompt, retries = 2) {
  const body = JSON.stringify({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    temperature: 0.88,
    max_tokens: 200,        // Reduced from 250 to lower token usage & latency
    top_p: 0.92,
    stream: false,
  });

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body,
        // Add a 15-second timeout to prevent hanging
        signal: AbortSignal.timeout(15000),
      });

      if (response.status === 429) {
        // Rate limited — extract retry-after if available
        const retryAfter = parseInt(response.headers.get('retry-after') || '2', 10);
        if (attempt < retries) {
          // Exponential backoff: 1s, 2s, 4s...
          await new Promise(r => setTimeout(r, Math.min(retryAfter * 1000, (attempt + 1) * 1000)));
          continue;
        }
        // Signal to caller that this model is rate-limited
        throw new Error('RATE_LIMITED');
      }

      if (!response.ok) {
        const errText = await response.text();
        console.error(`Groq error [${model}]:`, errText);
        throw new Error(`HTTP_${response.status}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content?.trim();
      if (!reply) throw new Error('EMPTY_RESPONSE');
      return reply;

    } catch (err) {
      if (err.name === 'TimeoutError' || err.message === 'RATE_LIMITED') {
        throw err; // Propagate to try next model
      }
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, (attempt + 1) * 500));
        continue;
      }
      throw err;
    }
  }
}

export async function POST(request) {
  try {
    const { messages, systemPrompt, avatarId } = await request.json();

    // Trim message history to last 12 exchanges to reduce token usage for concurrent calls
    const trimmedMessages = messages.slice(-24);

    // Deduplicate: if same avatar already has a request in-flight, wait for it
    const dedupeKey = avatarId || 'unknown';
    if (inFlight.has(dedupeKey)) {
      try {
        const existingReply = await inFlight.get(dedupeKey);
        return Response.json({ reply: existingReply });
      } catch {
        // Previous request failed, proceed with new one
      }
    }

    // Try each model in the fallback chain
    let lastError = null;
    const requestPromise = (async () => {
      for (const model of MODEL_CHAIN) {
        try {
          const reply = await callGroq(model, trimmedMessages, systemPrompt);
          console.log(`[chat] Responded with model: ${model}`);
          return reply;
        } catch (err) {
          lastError = err;
          console.warn(`[chat] Model ${model} failed: ${err.message}, trying next...`);
          if (err.message === 'RATE_LIMITED' || err.name === 'TimeoutError') {
            continue; // Try next model
          }
          break; // Non-rate-limit errors — don't retry other models
        }
      }
      throw lastError || new Error('All models failed');
    })();

    // Register in-flight
    inFlight.set(dedupeKey, requestPromise);

    let reply;
    try {
      reply = await requestPromise;
    } finally {
      inFlight.delete(dedupeKey);
    }

    return Response.json({ reply });

  } catch (err) {
    console.error('Chat API error:', err.message);

    // Contextual fallback messages (not always same response)
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
