const fs = require('fs');

async function run() {
  const tabs = await (await fetch('http://127.0.0.1:9222/json')).json();
  const t = tabs.find(x => x.url.includes('localhost:3000'));
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  let id = 1;
  const send = (m, p={}) => new Promise(r => {
    const i = id++;
    const h = (e) => {
      const d = JSON.parse(e.data);
      if (d.id === i) { ws.removeEventListener('message', h); r(d.result); }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: i, method: m, params: p }));
  });

  ws.onopen = async () => {
    await send('Runtime.enable');
    await send('Page.enable');

    await send('Runtime.evaluate', {
      expression: `document.getElementById('projects')?.scrollIntoView({ behavior: 'instant' })`
    });
    await new Promise(r => setTimeout(r, 2000));

    const res = await send('Runtime.evaluate', {
      expression: `(() => {
        const app = window.__splineApp;
        const b = app?.findObjectByName('bongo-cat');
        const k = app?.findObjectByName('keyboard');
        const v3 = (v) => v ? { x: v.x, y: v.y, z: v.z } : null;
        return {
          bongo: {
            pos: v3(b?.position),
            rot: v3(b?.rotation),
            scale: v3(b?.scale),
            visible: b?.visible
          },
          kbd: {
            pos: v3(k?.position),
            rot: v3(k?.rotation),
            scale: v3(k?.scale),
            visible: k?.visible
          },
          scrollY: window.scrollY,
          activeSection: window.location.hash
        };
      })()`,
      returnByValue: true
    });
    console.log(JSON.stringify(res.result?.value, null, 2));

    const snap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('current-projects-view.png', Buffer.from(snap.data, 'base64'));

    ws.close();
  };
}
run();
