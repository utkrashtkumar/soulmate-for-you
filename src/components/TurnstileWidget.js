'use client';
import { useEffect, useRef } from 'react';

// Cloudflare Turnstile Public Test Site Key (overridden by NEXT_PUBLIC_TURNSTILE_SITE_KEY in env)
const DEFAULT_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

export default function TurnstileWidget({ onVerify, onError, onExpire }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    let script = document.getElementById('cf-turnstile-script');

    const renderWidget = () => {
      if (window.turnstile && containerRef.current && widgetIdRef.current === null) {
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: DEFAULT_SITE_KEY,
            callback: (token) => {
              if (onVerify) onVerify(token);
            },
            'error-callback': (err) => {
              if (onError) onError(err);
            },
            'expired-callback': () => {
              if (onExpire) onExpire();
            },
            theme: 'auto',
          });
        } catch (e) {
          console.warn('[Turnstile] Render error:', e);
        }
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = 'cf-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    } else if (window.turnstile) {
      renderWidget();
    }

    return () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [onVerify, onError, onExpire]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '14px 0' }}>
      <div ref={containerRef} />
    </div>
  );
}
