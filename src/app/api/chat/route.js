// API Route: /api/chat
// Multi-provider AI engine with KEY ROTATION
// Supports multiple keys per provider — if one key is rate-limited, rotates to next key
// Provider Order: Gemini → Groq → OpenRouter

// ─── KEY ROTATION HELPERS ──────────────────────────────────────────────────
// Reads all keys for a provider (e.g. GEMINI_API_KEY, GEMINI_API_KEY_2, GEMINI_API_KEY_3)
function getKeys(prefix) {
  const keys = [];
  // Try PROVIDER_API_KEY (original single key)
  if (process.env[`${prefix}_API_KEY`]) keys.push(process.env[`${prefix}_API_KEY`]);
  // Try PROVIDER_API_KEY_2, _3, _4, _5
  for (let i = 2; i <= 5; i++) {
    if (process.env[`${prefix}_API_KEY_${i}`]) keys.push(process.env[`${prefix}_API_KEY_${i}`]);
  }
  return keys;
}

// Round-robin key counter per provider (in-memory, resets on server restart)
const keyCounters = { GEMINI: 0, GROQ: 0, OPENROUTER: 0 };

function nextKey(prefix) {
  const keys = getKeys(prefix);
  if (!keys.length) return null;
  const idx = keyCounters[prefix] % keys.length;
  keyCounters[prefix]++;
  return keys[idx];
}

// ─── PROVIDER CALL FUNCTIONS ───────────────────────────────────────────────

async function callGemini(model, messages, systemPrompt) {
  const keys = getKeys('GEMINI');
  if (!keys.length) throw new Error('NO_GEMINI_KEY');

  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  // Try each Gemini key until one works
  for (const apiKey of keys) {
    try {
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

      if (response.status === 429 || response.status === 503) {
        console.warn(`[Gemini:${model}] Key rate-limited (${response.status}), trying next key...`);
        continue; // Try next key
      }

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[Gemini:${model}] HTTP ${response.status}:`, errText.slice(0, 200));
        throw new Error(`GEMINI_ERR_${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!text) throw new Error('GEMINI_EMPTY_RESPONSE');
      return text;
    } catch (err) {
      if (err.message.includes('RATE') || err.name === 'TimeoutError') {
        continue; // Try next key
      }
      throw err;
    }
  }
  throw new Error('GEMINI_ALL_KEYS_EXHAUSTED');
}

async function callGroq(model, messages, systemPrompt) {
  const keys = getKeys('GROQ');
  if (!keys.length) throw new Error('NO_GROQ_KEY');

  // Try each Groq key until one works
  for (const apiKey of keys) {
    try {
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

      if (response.status === 429) {
        console.warn(`[Groq:${model}] Key rate-limited, trying next key...`);
        continue; // Try next key
      }

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[Groq:${model}] HTTP ${response.status}:`, errText.slice(0, 200));
        throw new Error(`GROQ_ERR_${response.status}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content?.trim();
      if (!reply) throw new Error('GROQ_EMPTY_RESPONSE');
      return reply;
    } catch (err) {
      if (err.name === 'TimeoutError') continue;
      throw err;
    }
  }
  throw new Error('GROQ_ALL_KEYS_EXHAUSTED');
}

async function callOpenRouter(model, messages, systemPrompt) {
  const keys = getKeys('OPENROUTER');
  if (!keys.length) throw new Error('NO_OPENROUTER_KEY');

  for (const apiKey of keys) {
    try {
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

      if (response.status === 429) {
        console.warn(`[OpenRouter:${model}] Key rate-limited, trying next key...`);
        continue;
      }

      if (!response.ok) {
        const errText = await response.text();
        // OpenRouter returns 404 when a model's upstream is down — skip model
        if (response.status === 404) throw new Error('OPENROUTER_MODEL_UNAVAILABLE');
        console.warn(`[OpenRouter:${model}] HTTP ${response.status}:`, errText.slice(0, 200));
        throw new Error(`OPENROUTER_ERR_${response.status}`);
      }

      const data = await response.json();
      // Some OpenRouter responses have nested error even with 200 status
      if (data.error) throw new Error('OPENROUTER_ERR: ' + data.error.message);
      const reply = data.choices?.[0]?.message?.content?.trim();
      if (!reply) throw new Error('OPENROUTER_EMPTY_RESPONSE');
      return reply;
    } catch (err) {
      if (err.name === 'TimeoutError') continue;
      throw err;
    }
  }
  throw new Error('OPENROUTER_ALL_KEYS_EXHAUSTED');
}

// ─── REQUEST DEDUPLICATION ─────────────────────────────────────────────────
const inFlight = new Map();

// ─── MAIN ROUTE HANDLER ────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const { messages, systemPrompt, avatarId } = await request.json();

    // Limit chat history to last 16 turns to keep tokens small & speed high
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

    // Provider execution list
    // Each provider tries all its keys internally before failing
    const providers = [
      // 1. Google Gemini (Best quality — all Gemini keys tried per model)
      { name: 'Gemini-2.0-Flash', fn: () => callGemini('gemini-2.0-flash', trimmedMessages, systemPrompt) },
      { name: 'Gemini-2.0-Flash-Lite', fn: () => callGemini('gemini-2.0-flash-lite', trimmedMessages, systemPrompt) },
      { name: 'Gemini-Flash-Latest', fn: () => callGemini('gemini-flash-latest', trimmedMessages, systemPrompt) },

      // 2. Groq AI (Ultra-fast — all Groq keys tried per model)
      { name: 'Groq-Llama3.3-70B', fn: () => callGroq('llama-3.3-70b-versatile', trimmedMessages, systemPrompt) },
      { name: 'Groq-Llama3.1-8B', fn: () => callGroq('llama-3.1-8b-instant', trimmedMessages, systemPrompt) },
      { name: 'Groq-Gemma2-9B', fn: () => callGroq('gemma2-9b-it', trimmedMessages, systemPrompt) },

      // 3. OpenRouter (Free Fallback — all OpenRouter keys tried per model)
      { name: 'OpenRouter-Llama3.3-Free', fn: () => callOpenRouter('meta-llama/llama-3.3-70b-instruct:free', trimmedMessages, systemPrompt) },
      { name: 'OpenRouter-Llama3.2-Free', fn: () => callOpenRouter('meta-llama/llama-3.2-3b-instruct:free', trimmedMessages, systemPrompt) },
      { name: 'OpenRouter-Gemma-Free', fn: () => callOpenRouter('google/gemma-4-31b-it:free', trimmedMessages, systemPrompt) },
    ];

    const requestPromise = (async () => {
      let lastErr = null;
      for (const provider of providers) {
        try {
          const reply = await provider.fn();
          console.log(`[Chat API] ✓ Provider: ${provider.name}`);
          return reply;
        } catch (err) {
          lastErr = err;
          const skipSilently = err.message.startsWith('NO_') || err.message.includes('UNAVAILABLE');
          if (!skipSilently) {
            console.warn(`[Chat API] ✗ ${provider.name}: ${err.message}. Trying next...`);
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
