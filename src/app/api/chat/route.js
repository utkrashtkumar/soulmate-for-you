// API Route: /api/chat
// High-performance Groq AI engine with KEY ROTATION
// Supports multiple keys — if one key is rate-limited, rotates to next key

// ─── KEY ROTATION HELPERS ──────────────────────────────────────────────────
// Reads all keys for a provider (e.g. GROQ_API_KEY, GROQ_API_KEY_2, GROQ_API_KEY_3)
function getKeys(prefix) {
  const keys = [];
  // Try PROVIDER_API_KEY (original single key)
  if (process.env[`${prefix}_API_KEY`]) keys.push(process.env[`${prefix}_API_KEY`]);
  // Try PROVIDER_API_KEY_2 through PROVIDER_API_KEY_15
  for (let i = 2; i <= 15; i++) {
    if (process.env[`${prefix}_API_KEY_${i}`]) keys.push(process.env[`${prefix}_API_KEY_${i}`]);
  }
  return keys;
}

// Round-robin key counter (in-memory, resets on server restart)
const keyCounters = { GROQ: 0 };

function nextKey(prefix) {
  const keys = getKeys(prefix);
  if (!keys.length) return null;
  const idx = keyCounters[prefix] % keys.length;
  keyCounters[prefix]++;
  return keys[idx];
}

// ─── PROVIDER CALL FUNCTIONS ───────────────────────────────────────────────

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

    // Provider execution list (Groq high-performance models with multi-key rotation)
    const providers = [
      { name: 'Groq-Llama3.3-70B', fn: () => callGroq('llama-3.3-70b-versatile', trimmedMessages, systemPrompt) },
      { name: 'Groq-Llama3.1-8B', fn: () => callGroq('llama-3.1-8b-instant', trimmedMessages, systemPrompt) },
      { name: 'Groq-DeepSeek-R1-70B', fn: () => callGroq('deepseek-r1-distill-llama-70b', trimmedMessages, systemPrompt) },
      { name: 'Groq-Mixtral-8x7B', fn: () => callGroq('mixtral-8x7b-32768', trimmedMessages, systemPrompt) },
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
      'Just a second... network seems a little slow 🥺 please send again?',
      'Hmm, the connection is a bit weak right now... try again in a moment 💕',
      'Oops, something went wrong 📶 could you send that again?',
      'Wait a little... I\'ll be right here for you 🌸',
    ];
    const fallback = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
    return Response.json({ reply: fallback }, { status: 200 });
  }
}
