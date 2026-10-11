// API Route: /api/chat
// Hybrid Multi-Provider AI Engine (Groq + OpenRouter + DeepSeek + Cerebras + Gemini)
// Seamless automatic failover: If primary provider is rate-limited or unavailable,
// instantly cascades to next configured provider without interrupting the user.

export const dynamic = 'force-dynamic';

// ─── KEY ROTATION & DISCOVERY HELPERS ──────────────────────────────────────
function getKeys(prefix) {
  const keys = [];
  // Standard single key: e.g. GROQ_API_KEY
  if (process.env[`${prefix}_API_KEY`]) keys.push(process.env[`${prefix}_API_KEY`]);
  // Additional rotation keys: e.g. GROQ_API_KEY_2 .. GROQ_API_KEY_15
  for (let i = 2; i <= 15; i++) {
    if (process.env[`${prefix}_API_KEY_${i}`]) keys.push(process.env[`${prefix}_API_KEY_${i}`]);
  }
  return keys;
}

// ─── PROVIDER 1: GROQ (Ultra-fast LPU inference) ───────────────────────────
async function callGroq(model, messages, systemPrompt) {
  const keys = getKeys('GROQ');
  if (!keys.length) throw new Error('NO_GROQ_KEY');

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
        signal: AbortSignal.timeout(10000),
      });

      if (response.status === 429 || response.status === 401) {
        console.warn(`[Groq:${model}] Key ${apiKey.slice(0, 10)}... status ${response.status}, rotating to next key...`);
        continue;
      }

      if (response.status === 404) {
        throw new Error(`GROQ_MODEL_NOT_FOUND`);
      }

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[Groq:${model}] HTTP ${response.status}:`, errText.slice(0, 150));
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

// ─── PROVIDER 2: OPENROUTER (200+ models, free tier & roleplay tuned) ──────
async function callOpenRouter(model, messages, systemPrompt) {
  const keys = getKeys('OPENROUTER');
  if (!keys.length) throw new Error('NO_OPENROUTER_KEY');

  for (const apiKey of keys) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://soulmate-companion.app',
          'X-Title': 'Soulmate AI Companion',
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
        }),
        signal: AbortSignal.timeout(12000),
      });

      if (response.status === 429) {
        console.warn(`[OpenRouter:${model}] Rate limited (429), trying next...`);
        continue;
      }

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[OpenRouter:${model}] HTTP ${response.status}:`, errText.slice(0, 150));
        throw new Error(`OPENROUTER_ERR_${response.status}`);
      }

      const data = await response.json();
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

// ─── PROVIDER 3: DEEPSEEK DIRECT (Best emotional & bilingual chemistry) ───
async function callDeepSeek(messages, systemPrompt) {
  const keys = getKeys('DEEPSEEK');
  if (!keys.length) throw new Error('NO_DEEPSEEK_KEY');

  for (const apiKey of keys) {
    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
          ],
          temperature: 0.9,
          max_tokens: 220,
        }),
        signal: AbortSignal.timeout(12000),
      });

      if (response.status === 429) continue;
      if (!response.ok) {
        throw new Error(`DEEPSEEK_ERR_${response.status}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content?.trim();
      if (!reply) throw new Error('DEEPSEEK_EMPTY_RESPONSE');
      return reply;
    } catch (err) {
      if (err.name === 'TimeoutError') continue;
      throw err;
    }
  }
  throw new Error('DEEPSEEK_ALL_KEYS_EXHAUSTED');
}

// ─── PROVIDER 4: CEREBRAS (1800+ tokens/sec ultra fast) ────────────────────
async function callCerebras(model, messages, systemPrompt) {
  const keys = getKeys('CEREBRAS');
  if (!keys.length) throw new Error('NO_CEREBRAS_KEY');

  for (const apiKey of keys) {
    try {
      const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
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
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (response.status === 429) continue;
      if (!response.ok) throw new Error(`CEREBRAS_ERR_${response.status}`);

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content?.trim();
      if (!reply) throw new Error('CEREBRAS_EMPTY_RESPONSE');
      return reply;
    } catch (err) {
      if (err.name === 'TimeoutError') continue;
      throw err;
    }
  }
  throw new Error('CEREBRAS_ALL_KEYS_EXHAUSTED');
}

// ─── PROVIDER 5: GOOGLE GEMINI (Multilingual, empathetic) ──────────────────
async function callGemini(messages, systemPrompt) {
  const keys = [...getKeys('GEMINI'), ...getKeys('GOOGLE')];
  if (!keys.length) throw new Error('NO_GEMINI_KEY');

  for (const apiKey of keys) {
    try {
      const geminiContents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content || '' }],
      }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: geminiContents,
            generationConfig: {
              temperature: 0.88,
              maxOutputTokens: 220,
            },
          }),
          signal: AbortSignal.timeout(10000),
        }
      );

      if (response.status === 429) continue;
      if (!response.ok) throw new Error(`GEMINI_ERR_${response.status}`);

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!reply) throw new Error('GEMINI_EMPTY_RESPONSE');
      return reply;
    } catch (err) {
      if (err.name === 'TimeoutError') continue;
      throw err;
    }
  }
  throw new Error('GEMINI_ALL_KEYS_EXHAUSTED');
}

// ─── IN-FLIGHT DEDUPLICATION ───────────────────────────────────────────────
const inFlight = new Map();

// ─── MAIN POST ROUTE ───────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const { messages, systemPrompt, avatarId } = await request.json();

    // Limit conversation context to last 16 turns to maintain speed
    const trimmedMessages = (messages || []).slice(-16);

    const dedupeKey = avatarId || 'global';
    if (inFlight.has(dedupeKey)) {
      try {
        const existingReply = await inFlight.get(dedupeKey);
        return Response.json({ reply: existingReply });
      } catch {
        // Continue if previous promise failed
      }
    }

    // ── Build Priority Cascade List Based on Configured Keys ───────────────
    const providers = [];

    // 1. Primary: Groq (Blazing fast inference with key rotation)
    if (getKeys('GROQ').length) {
      providers.push(
        { name: 'Groq: Qwen 3.8 27B', fn: () => callGroq('qwen/qwen3.8-27b', trimmedMessages, systemPrompt) },
        { name: 'Groq: GPT-OSS 120B', fn: () => callGroq('openai/gpt-oss-120b', trimmedMessages, systemPrompt) },
        { name: 'Groq: GPT-OSS 20B', fn: () => callGroq('openai/gpt-oss-20b', trimmedMessages, systemPrompt) },
        { name: 'Groq: Llama 3.3 70B', fn: () => callGroq('llama-3.3-70b-versatile', trimmedMessages, systemPrompt) },
        { name: 'Groq: Llama 3.1 8B', fn: () => callGroq('llama-3.1-8b-instant', trimmedMessages, systemPrompt) },
      );
    }

    // 2. Cerebras (Ultra-fast 1800+ t/s if configured)
    if (getKeys('CEREBRAS').length) {
      providers.push(
        { name: 'Cerebras: Llama 3.3 70B', fn: () => callCerebras('llama-3.3-70b', trimmedMessages, systemPrompt) },
        { name: 'Cerebras: Llama 3.1 8B', fn: () => callCerebras('llama3.1-8b', trimmedMessages, systemPrompt) },
      );
    }

    // 3. OpenRouter (Rich companion roleplay models & free tier)
    if (getKeys('OPENROUTER').length) {
      providers.push(
        { name: 'OpenRouter: DeepSeek-V3', fn: () => callOpenRouter('deepseek/deepseek-chat', trimmedMessages, systemPrompt) },
        { name: 'OpenRouter: Llama 3.3 70B (Free)', fn: () => callOpenRouter('meta-llama/llama-3.3-70b-instruct:free', trimmedMessages, systemPrompt) },
        { name: 'OpenRouter: DeepSeek (Free)', fn: () => callOpenRouter('deepseek/deepseek-chat:free', trimmedMessages, systemPrompt) },
      );
    }

    // 4. DeepSeek Direct (Empathetic & bilingual)
    if (getKeys('DEEPSEEK').length) {
      providers.push(
        { name: 'DeepSeek Direct: V3', fn: () => callDeepSeek(trimmedMessages, systemPrompt) },
      );
    }

    // 5. Google Gemini (1500 free requests/day)
    if (getKeys('GEMINI').length || getKeys('GOOGLE').length) {
      providers.push(
        { name: 'Gemini 2.0 Flash', fn: () => callGemini(trimmedMessages, systemPrompt) },
      );
    }

    // If no keys configured at all:
    if (!providers.length) {
      console.warn('[Chat API] No AI provider keys found in environment variables.');
      throw new Error('NO_API_KEYS_CONFIGURED');
    }

    const requestPromise = (async () => {
      let lastErr = null;
      for (const provider of providers) {
        try {
          const reply = await provider.fn();
          console.log(`[Chat API] ✓ Provider answered: ${provider.name}`);
          return reply;
        } catch (err) {
          lastErr = err;
          const isSilent = err.message.startsWith('NO_') || err.message.includes('UNAVAILABLE');
          if (!isSilent) {
            console.warn(`[Chat API] ✗ ${provider.name} failed (${err.message}). Trying fallback...`);
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
    console.error('[Chat API] All providers failed:', err.message);

    const NATURAL_FALLBACKS = [
      'Babe, network is a little slow right now 🥺 can you send that once more?',
      'Hmm, connection dropped for a second... I\'m right here though 💕',
      'Oops! Text got lost in transit 📶 send it again na please?',
      'Just a second sweetheart, tell me again? 🌸',
    ];
    const fallback = NATURAL_FALLBACKS[Math.floor(Math.random() * NATURAL_FALLBACKS.length)];
    return Response.json({ reply: fallback }, { status: 200 });
  }
}
