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
    const res = await send('Runtime.evaluate', {
      expression: `(() => {
        const app = window.__splineApp;
        const b = app?.findObjectByName('bongo-cat');
        const f1 = app?.findObjectByName('frame-1');
        const f2 = app?.findObjectByName('frame-2');
        const v3 = (v) => v ? { x: v.x, y: v.y, z: v.z } : null;
        return {
          bongo: {
            pos: v3(b?.position),
            rot: v3(b?.rotation),
            scale: v3(b?.scale),
            visible: b?.visible,
            parent: b?.parent?.name
          },
          f1: {
            pos: v3(f1?.position),
            rot: v3(f1?.rotation),
            scale: v3(f1?.scale),
            visible: f1?.visible,
            parent: f1?.parent?.name
          },
          f2: {
            pos: v3(f2?.position),
            rot: v3(f2?.rotation),
            scale: v3(f2?.scale),
            visible: f2?.visible,
            parent: f2?.parent?.name
          }
        };
      })()`,
      returnByValue: true
    });
    console.log(JSON.stringify(res.result?.value, null, 2));
    ws.close();
  };
}
run();
