# BetonLab — بتن‌لب (PWA)

نرم‌افزار مدیریت نمونه‌های بتن آزمایشگاهی و محاسبه مقاومت فشاری — نسخه وبِ قابل نصب (PWA).

## ساختار پروژه

```
betonlab/
├── index.html              ← همان «مدیریت نمونه.html» (تغییرنام‌یافته + بهینه‌سازی PWA)
├── manifest.webmanifest    ← شناسنامه اپلیکیشن (نام، آیکون‌ها، حالت standalone)
├── sw.js                   ← Service Worker برای کارکرد آفلاین
├── icon-192.png            ← آیکون ۱۹۲×۱۹۲
├── icon-512.png            ← آیکون ۵۱۲×۵۱۲
├── icon-maskable-192.png   ← آیکون maskable (اندروید)
├── icon-maskable-512.png   ← آیکون maskable (اندروید)
├── apple-touch-icon.png    ← آیکون iOS (۱۸۰×۱۸۰)
├── fonts/                  ← فونت وزیرمتن به‌صورت لوکال (بدون وابستگی به Google Fonts)
│   ├── vazirmatn.css
│   ├── vazirmatn-arabic.woff2
│   ├── vazirmatn-latin.woff2
│   └── vazirmatn-latin-ext.woff2
├── .nojekyll               ← غیرفعال‌سازی Jekyll در GitHub Pages
└── README.md
```

## انتشار روی GitHub Pages

1. محتویات همین پوشه را به مخزن گیت‌هاب خود push کنید:

   ```bash
   git init
   git add .
   git commit -m "BetonLab PWA"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO.git
   git push -u origin main
   ```

2. در GitHub به مسیر زیر بروید:
   **Settings → Pages → Build and deployment → Source = Deploy from a branch**
   و Branch را روی `main` و پوشه را روی `/ (root)` بگذارید و Save کنید.

3. پس از چند دقیقه، برنامه روی آدرس زیر در دسترس است:
   `https://USERNAME.github.io/REPO/`

> نکته: چون همه مسیرها نسبی (`./`) هستند، برنامه هم روی `username.github.io/repo/` و هم روی دامنه اختصاصی بدون هیچ تغییری کار می‌کند.

## نصب به‌عنوان اپلیکیشن (PWA)

- **اندروید / Chrome:** باز کردن آدرس برنامه → منوی سه‌نقطه → «Install app / نصب برنامه / افزودن به صفحه اصلی». یا دکمه «نصب اپلیکیشن (PWA)» در بخش تنظیمات برنامه.
- **دسکتاپ / Chrome و Edge:** آیکون نصب در انتهای نوار آدرس (⊕) یا منوی سه‌نقطه → «Install BetonLab».
- **iOS / Safari:** دکمه Share → «Add to Home Screen».

پس از نصب، آیکون برنامه روی صفحه قرار می‌گیرد و در پنجره مستقل (بدون نوار تب مرورگر) اجرا می‌شود و بدون اینترنت هم کار می‌کند (داده‌ها در IndexedDB مرورگر ذخیره می‌شوند).

## نگهداری / به‌روزرسانی

- هنگام انتشار نسخه جدید، اگر فایل `sw.js` یا فایل‌های کش‌شونده تغییر کرد، مقدار `VERSION` در ابتدای `sw.js` را عوض کنید (مثلاً `betonlab-v1.1.0`) تا کش کاربران به‌صورت خودکار تازه شود.
- فونت وزیرمتن به‌صورت لوکال در پوشه `fonts/` قرار دارد؛ بنابراین کارکرد آفلاین به اینترنت وابسته نیست. (همگام‌سازی ابری kvdb.io فقط وقتی آنلاین باشد کار می‌کند.)

## الزامات PWA که رعایت شده‌اند

- ✅ HTTPS (GitHub Pages)
- ✅ `manifest.webmanifest` با `name`, `icons 192/512 (+maskable)`, `display: standalone`, `start_url`
- ✅ Service Worker ثبت‌شده با استراتژی آفلاین
- ✅ آیکون‌های PNG در سایزهای استاندارد
- ✅ `theme-color` و متاتگ‌های iOS برای تجربه یکپارچه
