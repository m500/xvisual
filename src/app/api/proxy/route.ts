import { NextRequest } from 'next/server';
import dns from 'node:dns';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'sk,cs;q=0.9,en;q=0.8',
      },
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) throw new Error(`Status ${response.status}`);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let charset = 'utf-8';
    const contentType = response.headers.get('content-type') || '';
    const charsetMatch = contentType.match(/charset=([^;]+)/i);

    if (charsetMatch) {
        charset = charsetMatch[1].trim().toLowerCase();
    } else {
        const headSnippet = buffer.subarray(0, 2048).toString('ascii');
        const metaMatch = headSnippet.match(/charset=["']?([^"'>\s]+)["']?/i);
        if (metaMatch) charset = metaMatch[1].trim().toLowerCase();
    }

    if (charset === 'windows-1250' || charset === 'cp1250') charset = 'windows-1250';
    else if (charset === 'iso-8859-2') charset = 'iso-8859-2';
    else charset = 'utf-8';

    let html = '';
    try {
        html = new TextDecoder(charset).decode(buffer);
    } catch (e) {
        html = new TextDecoder('utf-8').decode(buffer);
    }

    const origin = new URL(targetUrl).origin;
    html = html.replace(/<meta[^>]*charset=["']?[^"'>]+["']?[^>]*>/gi, '<meta charset="utf-8">');

    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head><base href="${origin}/">`);
    } else {
      html = `<head><base href="${origin}/"></head>` + html;
    }

    const magicScript = `
      <script>
        (function() {
          console.log('✅ xVisual Engine Active (Precision Clicks)');
          
          let xVisualMode = 'browse'; 
          let trackedItems = []; 
          
          const highlightBox = document.createElement('div');
          highlightBox.style.position = 'absolute';
          highlightBox.style.border = '2px solid #f59e0b'; 
          highlightBox.style.backgroundColor = 'rgba(245, 158, 11, 0.15)'; 
          highlightBox.style.pointerEvents = 'none'; 
          highlightBox.style.zIndex = '2147483647'; 
          highlightBox.style.borderRadius = '4px';
          highlightBox.style.transition = 'all 0.15s ease-out'; 
          highlightBox.style.display = 'none';
          document.body.appendChild(highlightBox);

          const globalStyle = document.createElement('style');
          document.head.appendChild(globalStyle);

          let lockedElement = null; 

          function trackLockedElement() {
              if (lockedElement) { 
                  const rect = lockedElement.getBoundingClientRect();
                  highlightBox.style.display = 'block';
                  highlightBox.style.top = \`\${rect.top + window.scrollY - 2}px\`;
                  highlightBox.style.left = \`\${rect.left + window.scrollX - 2}px\`;
                  highlightBox.style.width = \`\${rect.width + 4}px\`;
                  highlightBox.style.height = \`\${rect.height + 4}px\`;
              }
              requestAnimationFrame(trackLockedElement);
          }
          requestAnimationFrame(trackLockedElement);

          function createFingerprint(el, e) {
              if (!el) return null;
              if (el.nodeType === 3) el = el.parentNode; 
              
              let path = [];
              let curr = el;
              while (curr && curr.nodeType === Node.ELEMENT_NODE) {
                  let selector = curr.nodeName.toLowerCase();
                  if (curr.id) {
                      selector += '#' + curr.id;
                      path.unshift(selector);
                      break; 
                  } else {
                      let sib = curr, nth = 1;
                      while (sib = sib.previousElementSibling) {
                          if (sib.nodeName.toLowerCase() === selector) nth++;
                      }
                      if (nth !== 1) selector += ":nth-of-type(" + nth + ")";
                  }
                  path.unshift(selector);
                  curr = curr.parentNode;
              }
              const exactPath = path.join(" > ");
              
              let semanticPath = el.nodeName.toLowerCase();
              if (el.className && typeof el.className === 'string') {
                  const classes = el.className.split(' ').filter(c => c && !c.includes(':')).join('.');
                  if (classes) semanticPath += '.' + classes;
              }

              const textContent = el.textContent ? el.textContent.replace(/\\s+/g, ' ').trim().substring(0, 50) : '';
              const tagName = el.tagName;

              const maxW = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, window.innerWidth);
              const maxH = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, window.innerHeight);
              const relativeX = e.pageX / maxW;
              const relativeY = e.pageY / maxH;

              return { exactPath, semanticPath, textContent, tagName, relativeX, relativeY };
          }

          function findElementByFingerprint(fp) {
              if (!fp) return { el: null, orphaned: true };
              let el = null;
              
              try { if (fp.exactPath) el = document.querySelector(fp.exactPath); } catch(e){}
              if (el) return { el, orphaned: false };
              
              try { if (fp.semanticPath && fp.semanticPath.includes('.')) el = document.querySelector(fp.semanticPath); } catch(e){}
              if (el) return { el, orphaned: false };
              
              if (fp.tagName && fp.textContent) {
                  const elements = document.getElementsByTagName(fp.tagName);
                  for (let i=0; i<elements.length; i++) {
                      const text = elements[i].textContent ? elements[i].textContent.replace(/\\s+/g, ' ').trim().substring(0, 50) : '';
                      if (text === fp.textContent) return { el: elements[i], orphaned: false };
                  }
              }
              return { el: null, orphaned: true }; 
          }

          function reportPositions() {
             if (trackedItems.length === 0) return;
             const positions = {};
             const maxW = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, window.innerWidth);
             const maxH = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, window.innerHeight);

             trackedItems.forEach(item => {
                 const match = findElementByFingerprint(item.fingerprint);
                 if (match.el) {
                     const rect = match.el.getBoundingClientRect();
                     positions[item.id] = {
                         x: rect.left + window.scrollX + (rect.width / 2), 
                         y: rect.top + window.scrollY + (rect.height / 2),
                         orphaned: false
                     };
                 } else if (match.orphaned) {
                     positions[item.id] = {
                         x: item.fingerprint.relativeX * maxW,
                         y: item.fingerprint.relativeY * maxH,
                         orphaned: true
                     };
                 }
             });
             window.parent.postMessage({ source: 'xvisual-iframe', type: 'itemPositions', positions: positions }, '*');
          }

          setInterval(reportPositions, 200);

          const sendHeight = () => {
              const height = Math.max(
                  document.body.scrollHeight, document.documentElement.scrollHeight,
                  document.body.offsetHeight, document.documentElement.offsetHeight
              );
              window.parent.postMessage({ type: 'resize', height: height }, '*');
          };

          window.addEventListener('load', sendHeight);
          sendHeight();

          window.addEventListener('message', (event) => {
             if (event.data?.type === 'setMode') {
                xVisualMode = event.data.mode;
                if (xVisualMode === 'comment') {
                    globalStyle.textContent = '* { cursor: crosshair !important; }';
                    lockedElement = null; 
                    highlightBox.style.display = 'none'; 
                } else {
                    globalStyle.textContent = '';
                }
             }
             
             if (event.data?.type === 'trackItems') {
                 trackedItems = event.data.items || [];
                 reportPositions(); 
             }
             
             if (event.data?.type === 'highlightElement' && event.data.fingerprint) {
                const match = findElementByFingerprint(event.data.fingerprint);
                if (match.el) {
                    lockedElement = match.el; 
                    let bColor = '#f59e0b'; let bgCol = 'rgba(245, 158, 11, 0.15)';
                    if (event.data.status === 'resolved') { bColor = '#2563eb'; bgCol = 'rgba(37, 99, 235, 0.15)'; }
                    else if (event.data.status === 'closed') { bColor = '#16a34a'; bgCol = 'rgba(22, 163, 74, 0.15)'; }
                    
                    highlightBox.style.borderColor = bColor;
                    highlightBox.style.backgroundColor = bgCol;
                } else {
                    highlightBox.style.display = 'none';
                }
             }

             if (event.data?.type === 'removeHighlight') {
                 lockedElement = null;
                 highlightBox.style.display = 'none';
             }
          });

          document.addEventListener('mousemove', (e) => {
            if (xVisualMode !== 'comment' || lockedElement) return;
            if (e.target === document.body || e.target === document.documentElement) {
                highlightBox.style.display = 'none'; return;
            }
            highlightBox.style.borderColor = '#f59e0b';
            highlightBox.style.backgroundColor = 'rgba(245, 158, 11, 0.15)';
            const rect = e.target.getBoundingClientRect();
            highlightBox.style.display = 'block';
            highlightBox.style.top = \`\${rect.top + window.scrollY - 2}px\`;
            highlightBox.style.left = \`\${rect.left + window.scrollX - 2}px\`;
            highlightBox.style.width = \`\${rect.width + 4}px\`;
            highlightBox.style.height = \`\${rect.height + 4}px\`;
          }, true);

          document.addEventListener('mouseout', (e) => {
             if (xVisualMode !== 'comment' || lockedElement) return;
             if (e.target === document.body || e.relatedTarget == null) highlightBox.style.display = 'none';
          }, true);

          document.addEventListener('click', (e) => {
            if (xVisualMode === 'comment') {
                e.preventDefault(); e.stopPropagation();
                // OPRAVA: Iframe teraz posiela priamo presné súradnice kliknutia!
                window.parent.postMessage({ 
                    source: 'xvisual-iframe', 
                    type: 'feedback', 
                    fingerprint: createFingerprint(e.target, e),
                    x: e.pageX,
                    y: e.pageY
                }, '*');
                highlightBox.style.display = 'none';
                return;
            }
            if (xVisualMode === 'browse') {
                const link = e.target.closest('a');
                if (link && link.href) {
                    if (link.href.startsWith('javascript:') || link.getAttribute('href') === '#') return;
                    e.preventDefault(); 
                    e.stopPropagation();
                    window.parent.postMessage({ source: 'xvisual-iframe', type: 'urlChange', url: link.href }, '*');
                }
            }
          }, true);

          window.parent.postMessage({ source: 'xvisual-iframe', type: 'iframeReady' }, '*');
        })();
      </script>
    `;

    if (html.includes('</body>')) html = html.replace('</body>', `${magicScript}</body>`);
    else html += magicScript;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Frame-Options': 'ALLOWALL', 'Content-Security-Policy': "frame-ancestors *;" },
    });

  } catch (error: any) {
    return new Response(`Proxy Error: ${error.message}`, { status: 500 });
  }
}