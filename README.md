# Framely — Screenshot-any-URL tool

پروژه Next.js 14 (App Router) + React + Tailwind CSS. کاربر یک آدرس وارد می‌کند و به‌صورت **واقعی** اسکرین‌شات آن صفحه در چند سایز استاندارد (دسکتاپ، تبلت، موبایل، کارت شبکه‌اجتماعی، مربع) گرفته می‌شود — با Playwright روی سرور.

## اجرا روی سیستم خودت

```bash
npm install        # همین دستور مرورگر Chromium مورد نیاز Playwright را هم نصب می‌کند
npm run dev
```

آدرس `http://localhost:3000` را باز کن، یک لینک بده و روی «Generate shots» بزن.

> اگر `npm install` مرورگر را نصب نکرد (مثلاً به‌خاطر دسترسی شبکه محدود)، دستی اجرا کن:
> `npx playwright install chromium`

## چطور کار می‌کند

- `app/api/screenshot/route.js` یک Route Handler است که:
  1. آدرس ورودی را نرمالایز و اعتبارسنجی می‌کند (فقط http/https، و آدرس‌های داخلی/خصوصی مثل `localhost` یا رنج‌های `192.168.x.x` را رد می‌کند تا از سوءاستفاده SSRF جلوگیری شود).
  2. با Playwright یک Chromium headless بالا می‌آورد.
  3. برای هر سایز (Desktop / Tablet / Mobile / Social card / Square) اندازه‌ی viewport را عوض می‌کند، صفحه را لود می‌کند و اسکرین‌شات می‌گیرد.
  4. تصاویر را به‌صورت `base64` در پاسخ JSON برمی‌گرداند.
- کامپوننت `FramelyLanding.jsx` این API را با `fetch` صدا می‌زند، در حین انتظار حالت لودینگ نشان می‌دهد، و بعد از موفقیت تصویر واقعی هر سایز را داخل همان قاب‌های دستگاه (device frame) نشان می‌دهد. روی هر قاب، دکمه‌ی دانلود هم ظاهر می‌شود.

## نکته‌ی مهم درباره‌ی دیپلوی

Chromium کامل که Playwright نصب می‌کند حجیم است و روی هاست‌های serverless معمولی (مثل Vercel Hobby) معمولاً به مشکل محدودیت اندازه/timeout می‌خورد. دو مسیر معمول برای پروداکشن:

1. **ساده‌ترین راه — هاست با سرور دائمی:** یک VPS ساده (Railway, Render, Fly.io, یک سرور Docker خودت) که Node.js معمولی روی آن اجرا می‌شود؛ همین کد بدون تغییر کار می‌کند.
2. **اگر حتماً می‌خوای روی Vercel/serverless باشه:** پکیج `playwright` را با `playwright-core` + `@sparticuz/chromium` جایگزین کن (یک باینری Chromium فشرده مخصوص AWS Lambda/Vercel) — یا از یک سرویس آماده‌ی اسکرین‌شات مثل ScreenshotOne یا urlbox.io استفاده کن و فقط این Route Handler را به آن API وصل کن.

## ساختار پروژه

```
framely-landing/
├── app/
│   ├── api/
│   │   └── screenshot/
│   │       └── route.js   # کپچر واقعی با Playwright
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── components/
│   └── FramelyLanding.jsx # UI + فراخوانی API
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```

## محدودیت‌ها / نکات امنیتی که در نظر گرفته شده

- بلاک‌کردن آدرس‌های داخلی/خصوصی (SSRF guard ساده).
- محدودکردن ابعاد درخواستی به بازه‌ی ۲۰۰ تا ۳۰۰۰ پیکسل.
- محدودکردن تعداد سایزهای درخواستی در هر ریکوئست به حداکثر ۸.
- timeout ۲۰ ثانیه‌ای برای هر ناوبری، تا یک سایت کند کل درخواست را قفل نکند.

برای پروداکشن واقعی بهتره rate-limiting در سطح IP هم اضافه کنی (مثلاً با Upstash Ratelimit یا یک میان‌افزار ساده) تا کسی از این endpoint برای اسکرین‌شات انبوه سوءاستفاده نکنه.
