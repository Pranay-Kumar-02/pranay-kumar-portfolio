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
        const k = app?.findObjectByName('keyboard');
        return {
          bongoParentName: b?.parent?.name,
          bongoParentType: b?.parent?.type,
          bongoIsChildOfKbd: b?.parent === k,
          kbdChildren: k?.children?.map(c => c.name),
          allObjects: app?.getAllObjects()?.map(o => ({ name: o.name, parentName: o.parent?.name }))
        };
      })()`,
      returnByValue: true
    });
    console.log(JSON.stringify(res.result?.value, null, 2));
    ws.close();
  };
}
run();
