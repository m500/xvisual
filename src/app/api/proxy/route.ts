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

    // Fixnutie relatívnych ciest (obrázky, štýly)
    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head><base href="${origin}/">`);
    }

    // --- xVisual Magic Script v4.1 (Orange Highlight & Navigation) ---
    const magicScript = `
      <script>
        (function() {
          console.log('✅ xVisual Engine v4.1 Active (Orange Highlight)');
          
          let xVisualMode = 'browse'; 
          const currentOrigin = '${origin}';

          // --- 1. VYTVORENIE PLÁVAJÚCEHO ZAMERIAVAČA (Oranžový) ---
          const highlightBox = document.createElement('div');
          highlightBox.style.position = 'absolute';
          highlightBox.style.border = '2px solid #f59e0b'; // Tailwind amber-500 farba
          highlightBox.style.backgroundColor = 'rgba(245, 158, 11, 0.15)'; // Polopriehľadná oranžová
          highlightBox.style.pointerEvents = 'none'; // Musí byť none, aby sme cez neho vedeli kliknúť
          highlightBox.style.zIndex = '2147483647'; 
          highlightBox.style.transition = 'all 0.1s ease-out';
          highlightBox.style.borderRadius = '4px';
          highlightBox.style.display = 'none';
          document.body.appendChild(highlightBox);

          // --- 2. POČÚVANIE SPRÁV ZO SIDEBARU ---
          window.addEventListener('message', (event) => {
             // A) Zmena módu (Comment / Browse)
             if (event.data?.type === 'setMode') {
                xVisualMode = event.data.mode;
                document.body.style.cursor = xVisualMode === 'comment' ? 'crosshair' : 'auto';
                highlightBox.style.display = 'none'; 
             }
             
             // B) Highlight elementu po nabehnutí myšou v sidebare
             if (event.data?.type === 'highlightElement' && event.data.selector) {
                try {
                    const el = document.querySelector(event.data.selector);
                    if (el) {
                        const rect = el.getBoundingClientRect();
                        highlightBox.style.display = 'block';
                        highlightBox.style.top = \`\${rect.top + window.scrollY - 2}px\`;
                        highlightBox.style.left = \`\${rect.left + window.scrollX - 2}px\`;
                        highlightBox.style.width = \`\${rect.width + 4}px\`;
                        highlightBox.style.height = \`\${rect.height + 4}px\`;
                    }
                } catch(err) { /* Ignorujeme ak je zlý selektor */ }
             }

             // C) Skrytie highlightu po opustení myši v sidebare
             if (event.data?.type === 'removeHighlight') {
                 highlightBox.style.display = 'none';
             }
          });

          // --- 3. SLEDOVANIE MYŠI PRE TVORBU TICKETU (Iba Comment mode) ---
          document.addEventListener('mousemove', (e) => {
            if (xVisualMode !== 'comment') return;
            const target = e.target;
            
            if (target === document.body || target === document.documentElement) {
                highlightBox.style.display = 'none';
                return;
            }
            
            const rect = target.getBoundingClientRect();
            highlightBox.style.display = 'block';
            highlightBox.style.top = \`\${rect.top + window.scrollY - 2}px\`;
            highlightBox.style.left = \`\${rect.left + window.scrollX - 2}px\`;
            highlightBox.style.width = \`\${rect.width + 4}px\`;
            highlightBox.style.height = \`\${rect.height + 4}px\`;
          });

          document.addEventListener('mouseout', (e) => {
             if (e.target === document.body || e.relatedTarget == null) {
                 highlightBox.style.display = 'none';
             }
          });

          // --- 4. KLIKANIE ---
          document.addEventListener('click', (e) => {
            
            // A) Sme v COMMENT móde -> vytvárame nový pin
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
                  type: 'feedback',
                  selector: selector.substring(0, 40),
                  text: e.target.innerText?.substring(0, 80).trim() || "Nová pripomienka...",
                  x: e.pageX, 
                  y: e.pageY
                };
                window.parent.postMessage(data, '*');
                
                highlightBox.style.display = 'none';
                return;
            }

            // B) Sme v BROWSE móde -> zachytávame prekliky na iné podstránky webe
            if (xVisualMode === 'browse') {
                const link = e.target.closest('a');
                
                if (link && link.href) {
                    e.preventDefault();
                    e.stopPropagation();

                    window.parent.postMessage({
                        source: 'xvisual-iframe',
                        type: 'urlChange',
                        url: link.href
                    }, '*');

                    window.location.href = '/api/proxy?url=' + encodeURIComponent(link.href);
                }
            }
          }, true);
        })();
      </script>
    `;

    // Vloženie nášho skriptu tesne pred </body>
    if (html.includes('</body>')) {
      html = html.replace('</body>', `${magicScript}</body>`);
    } else {
      html += magicScript;
    }

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