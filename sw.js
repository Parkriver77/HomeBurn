// 앱 화면(HTML)은 항상 최신 버전을 먼저 받고, 인터넷이 없을 때만 저장본을 쓴다.
// 그 밖의 파일(아이콘, AI 모델 등)은 저장본을 먼저 써서 빠르게 연다.
const C="homeburn-v5",F=["./","index.html","manifest.webmanifest","apple-touch-icon.png","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;
  const isPage=r.mode==="navigate"||r.url.endsWith("/")||r.url.endsWith("index.html");
  if(isPage){e.respondWith(fetch(r,{cache:"no-store"}).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))));return}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp)).catch(()=>{});return res})))});
