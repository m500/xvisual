import { NextRequest } from 'next/server';
import dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');

if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let targetUrl = searchParams.get('url');

  if (!targetUrl) return new Response("Chýba URL", { status: 400 });

  targetUrl = targetUrl.trim();
  if (!targetUrl.startsWith('http')) targetUrl = `https://${targetUrl}`;
  if (targetUrl.includes('/api/proxy')) return new Response("Rekurzia!", { status: 400 });

  try {
    const response = await fetch(targetUrl, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) throw new Error(`Status ${response.status}`);

    let html = await response.text();
    const origin = new URL(targetUrl).origin;

    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head><base href="${origin}/">`);
    }

    // --- xVisual Magic Script v3 (Navigation Handler) ---
    const magicScript = `
      <script>
        (function() {
          console.log('✅ xVisual Engine v3 Active');
          
          let xVisualMode = 'comment'; 
          const currentOrigin = '${origin}'; // Pôvodná doména webu

          // 1. Počúvame zmenu módu
          window.addEventListener('message', (event) => {
             if (event.data?.type === 'setMode') {
                xVisualMode = event.data.mode;
                document.body.style.cursor = xVisualMode === 'comment' ? 'crosshair' : 'auto';
             }
          });

          // 2. Hover efekt (iba Comment mode)
          document.addEventListener('mouseover', (e) => {
            if (xVisualMode !== 'comment') return;
            if (e.target === document.body) return;
            e.target.style.outline = '2px dashed #3b82f6';
            e.target.style.cursor = 'crosshair';
          });
          document.addEventListener('mouseout', (e) => {
             e.target.style.outline = '';
             e.target.style.cursor = '';
          });

          // 3. KLIKANIE (Jadro problému)
          document.addEventListener('click', (e) => {
            
            // A) Ak sme v COMMENT móde -> vytvárame ticket
            if (xVisualMode === 'comment') {
                e.preventDefault();
                e.stopPropagation();

                let selector = e.target.tagName.toLowerCase();
                if (e.target.id) selector += '#' + e.target.id;
                if (e.target.className && typeof e.target.className === 'string') {
                   const classes = e.target.className.trim().split(/\\s+/).filter(c => c).join('.');
                   if (classes) selector += '.' + classes;
                }

                const data = {
                  source: 'xvisual-iframe',
                  type: 'feedback', // Pridal som typ správy
                  selector: selector.substring(0, 40),
                  text: e.target.innerText?.substring(0, 80).trim() || "Prvok",
                  x: e.clientX,
                  y: e.clientY
                };
                window.parent.postMessage(data, '*');
                return;
            }

            // B) Ak sme v BROWSE móde -> musíme zachytiť navigáciu
            if (xVisualMode === 'browse') {
                // Nájdi najbližší odkaz (ak klikol na span vnútri a)
                const link = e.target.closest('a');
                
                // Ak je to odkaz a má href
                if (link && link.href) {
                    e.preventDefault(); // Zastavíme štandardné načítanie
                    e.stopPropagation();

                    console.log('🔗 Intercepting navigation to:', link.href);

                    // Povieme rodičovi (Sidebar), že meníme URL (aby sa aktualizoval URL bar)
                    window.parent.postMessage({
                        source: 'xvisual-iframe',
                        type: 'urlChange',
                        url: link.href
                    }, '*');

                    // Presmerujeme iframe ZNOVA CEZ PROXY
                    window.location.href = '/api/proxy?url=' + encodeURIComponent(link.href);
                }
            }
          }, true);
        })();
      </script>
    `;

    html = html.replace('</body>', `${magicScript}</body>`);

    return new Response(html, {
      headers: { 
        'Content-Type': 'text/html; charset=utf-8',
        'X-Frame-Options': 'ALLOWALL', 
        'Content-Security-Policy': "frame-ancestors *;" 
      },
    });

  } catch (error: any) {
    return new Response(`Proxy Error: ${error.message}`, { status: 500 });
  }
}