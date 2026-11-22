/* FINANCE service worker: lets the app install and open fast. Data always comes live from Firebase. */
const V='finance-v19';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const keep=(r,res)=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res};
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.origin===location.origin){
    if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>keep('index.html',res)).catch(()=>caches.match('index.html')));return}
    e.respondWith(fetch(r).then(res=>keep(r,res)).catch(()=>caches.match(r)));return;
  }
  const lib=u.hostname==='cdnjs.cloudflare.com'||u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'||(u.hostname==='www.gstatic.com'&&u.pathname.startsWith('/firebasejs/'));
  if(lib)e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>keep(r,res))));
});
