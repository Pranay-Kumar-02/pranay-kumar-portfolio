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
        const kbd = app?.findObjectByName('keyboard');
        
        function getObjDetails(obj) {
          if (!obj) return null;
          return {
            name: obj.name,
            uuid: obj.uuid,
            type: obj.type,
            parent: obj.parent ? { name: obj.parent.name, type: obj.parent.type, uuid: obj.parent.uuid } : null,
            position: { x: obj.position.x, y: obj.position.y, z: obj.position.z },
            rotation: { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z },
            scale: { x: obj.scale.x, y: obj.scale.y, z: obj.scale.z },
            quaternion: { x: obj.quaternion.x, y: obj.quaternion.y, z: obj.quaternion.z, w: obj.quaternion.w },
            visible: obj.visible,
            childrenCount: obj.children?.length,
            childrenNames: obj.children?.map(c => c.name)
          };
        }

        return {
          bongo: getObjDetails(b),
          keyboard: getObjDetails(kbd)
        };
      })()`,
      returnByValue: true
    });
    console.log(JSON.stringify(res.result?.value, null, 2));
    ws.close();
  };
}
run();
