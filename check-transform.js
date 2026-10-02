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
        const k = app?.findObjectByName('keyboard');
        const threeScene = app?._scene;
        const threeKbd = threeScene?.getObjectByName('keyboard');
        return {
          splineKbdRot: { x: k?.rotation?.x, y: k?.rotation?.y, z: k?.rotation?.z },
          threeKbdRot: { x: threeKbd?.rotation?.x, y: threeKbd?.rotation?.y, z: threeKbd?.rotation?.z },
          activeSection: window.location.hash || 'hero',
          scrollY: window.scrollY
        };
      })()`,
      returnByValue: true
    });
    console.log(JSON.stringify(res.result.value, null, 2));
    ws.close();
  };
}
run();
