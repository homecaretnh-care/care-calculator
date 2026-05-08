/* 全能居家長照機構 — Service Worker v1 */
const CACHE_NAME = 'care-calc-v1';
const FILES = ['./index.html', './manifest.json'];

/* 安裝：預先快取所有檔案 */
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
    );
    self.skipWaiting();
});

/* 啟用：清除舊版快取 */
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

/* 攔截請求：優先使用快取，快取沒有再連網 */
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(cached => cached || fetch(e.request))
    );
});
