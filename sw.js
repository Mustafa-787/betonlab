/* ============================================================
 * BetonLab — Service Worker (offline-first PWA)
 * نسخه را هنگام هر انتشار تغییر دهید تا کش کاربران تازه شود.
 * ============================================================ */
const VERSION = 'betonlab-v1.5.0';
const CACHE_STATIC  = VERSION + '-static';
const CACHE_RUNTIME = VERSION + '-runtime';

/* پوسته اصلی برنامه — پیش‌کش می‌شود تا آفلاین کامل کار کند */
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './fonts/vazirmatn.css',
  './fonts/vazirmatn-arabic.woff2',
  './fonts/vazirmatn-latin.woff2',
  './fonts/vazirmatn-latin-ext.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => { console.warn('SW precache failed:', err); })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((k) => k !== CACHE_STATIC && k !== CACHE_RUNTIME)
        .map((k) => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

/* اجازه می‌دهد تب‌های باز با پیام SKIP_WAITING به نسخه جدید سوئیچ کنند */
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  /* درخواست‌های خارج از.origin (مثل همگام‌سازی ابری kvdb.io)
     بدون کش، مستقیم به شبکه می‌روند تا داده‌ها همیشه تازه بمانند */
  if (url.origin !== self.location.origin) return;

  /* ناوبری‌ها: اول شبکه (برای دریافت نسخه جدید)، در قطع اینترنت از کش */
  if (req.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(req));
    return;
  }

  /* سایر فایل‌های خود برنامه: کش با به‌روزرسانی در پس‌زمینه */
  event.respondWith(staleWhileRevalidate(req));
});

async function networkFirstNavigation(req) {
  const cache = await caches.open(CACHE_STATIC);
  try {
    const res = await fetch(req);
    if (res && (res.ok || res.type === 'opaqueredirect')) {
      cache.put('./index.html', res.clone());
      cache.put('./', res.clone());
    }
    return res;
  } catch (err) {
    const cached = (await cache.match('./index.html')) || (await cache.match('./')) ||
                   (await caches.match(req));
    if (cached) return cached;
    return new Response(offlinePage(), {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
}

async function staleWhileRevalidate(req) {
  const cachePromise = caches.open(CACHE_RUNTIME);
  const cache = await cachePromise;
  const cached = await cache.match(req);

  const network = fetch(req).then((res) => {
    if (res && (res.ok || res.type === 'basic')) {
      cache.put(req, res.clone());
    }
    return res;
  }).catch(() => cached);

  return cached || network;
}

/* صفحه آفلاین ساده وقتی هیچ کشی وجود ندارد */
function offlinePage() {
  return '<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>بتن‌لب — آفلاین</title><style>' +
    'body{font-family:Tahoma,sans-serif;background:#1e3a5f;color:#fff;display:grid;' +
    'place-items:center;min-height:100vh;margin:0;text-align:center}' +
    '.box{padding:32px}.h{font-size:20px;font-weight:700;margin-bottom:10px}' +
    'p{opacity:.8;line-height:1.9}</style></head><body><div class="box">' +
    '<div class="h">بتن‌لب</div>' +
    '<p>اتصال اینترنت برقرار نیست و این صفحه قبلاً کش نشده است.<br>لطفاً اتصال را بررسی و دوباره تلاش کنید.</p>' +
    '</div></body></html>';
}
