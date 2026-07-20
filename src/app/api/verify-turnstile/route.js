// API Route: /api/verify-turnstile
// Verifies Cloudflare Turnstile CAPTCHA response token

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return Response.json({ success: false, error: 'CAPTCHA token is missing. Please complete the security verification.' }, { status: 400 });
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY || '1x00000000000000000000AA00000000000';

    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await res.json();

    if (!data.success) {
      console.warn('[Turnstile API] Verification failed:', data['error-codes']);
      return Response.json({
        success: false,
        error: 'Security verification failed. Please try completing the CAPTCHA again.'
      }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('[Turnstile API] Error:', err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
