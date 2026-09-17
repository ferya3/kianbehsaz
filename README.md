# کیان بهساز — وب‌سایت شرکتی

سایت شرکتی و چندزبانه کیان بهساز: Next.js (App Router) + TypeScript + Tailwind CSS
+ Payload CMS + PostgreSQL.

سه زبان از ابتدا پشتیبانی می‌شود: **فارسی (پیش‌فرض، RTL)**، **English**، **العربية (RTL)**.

مستندات کامل معماری و دلیل هر تصمیم: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

---

## Stack

| لایه | انتخاب |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components) |
| زبان | TypeScript (strict) |
| استایل | Tailwind CSS 4 (پیکربندی CSS-first) |
| CMS | Payload CMS 3 (درون همان اپلیکیشن Next.js) |
| دیتابیس | PostgreSQL 16 — اسکیمای `cms` برای Payload، اسکیمای `app` برای Prisma |
| ORM (داده‌های عملیاتی) | Prisma 7 |
| i18n | next-intl |
| اعتبارسنجی | Zod |
| انیمیشن | Framer Motion (محدود و کنترل‌شده) |
| زیرساخت | Docker + Nginx + Cloudflare |

---

## راه‌اندازی محلی

نیازمندی‌ها: Node.js 22 و یک PostgreSQL در دسترس.

```bash
# ۱) وابستگی‌ها (postinstall کلاینت Prisma را می‌سازد)
npm install

# ۲) متغیرهای محیطی
cp .env.example .env
#    و مقادیر DATABASE_URI / DATABASE_URL / PAYLOAD_SECRET را تنظیم کنید

# ۳) اسکیماها
psql "$DATABASE_URI" -c "CREATE SCHEMA IF NOT EXISTS cms; CREATE SCHEMA IF NOT EXISTS app;"

# ۴) مهاجرت‌ها
npx prisma migrate deploy   # جدول‌های app
npm run db:migrate          # جدول‌های cms (Payload)

# ۵) داده نمونه (اختیاری، فقط برای توسعه)
npm run seed

# ۶) اجرا
npm run dev
```

| آدرس | توضیح |
| --- | --- |
| `http://localhost:3000/fa` | سایت (فارسی) |
| `http://localhost:3000/en` | سایت (انگلیسی) |
| `http://localhost:3000/ar` | سایت (عربی) |
| `http://localhost:3000/admin` | پنل مدیریت Payload |

کاربر ادمینِ ساخته‌شده توسط `npm run seed`:
`admin@kianbehsaz.local` / `ChangeMe123!` — **فقط برای محیط توسعه**.

---

## اسکریپت‌ها

| دستور | کار |
| --- | --- |
| `npm run dev` | سرور توسعه |
| `npm run build` | بیلد پروداکشن (به دیتابیس نیاز دارد: صفحات از CMS پیش‌رندر می‌شوند) |
| `npm run start` | اجرای بیلد پروداکشن |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run generate:types` | تولید `src/payload-types.ts` از روی پیکربندی CMS |
| `npm run generate:importmap` | تولید import map پنل ادمین |
| `npm run db:migrate` | اجرای مهاجرت‌های Payload |
| `npm run prisma:migrate` | ساخت/اجرای مهاجرت Prisma (توسعه) |
| `npm run prisma:deploy` | اجرای مهاجرت‌های Prisma (پروداکشن) |
| `npm run seed` | داده نمونه سه‌زبانه (idempotent، روی پروداکشن اجرا نمی‌شود) |

پس از هر تغییر در Collectionها یا Globalها:

```bash
npm run generate:types      # تایپ‌ها
npm run generate:importmap  # اگر کامپوننت ادمین سفارشی اضافه شد
npx payload migrate:create  # مهاجرت جدید
```

CI تازه بودن `src/payload-types.ts` را بررسی می‌کند، پس فراموش کردن مرحله اول باعث شکست بیلد می‌شود.

---

## ساختار پروژه

```
src/
├── app/
│   ├── (frontend)/[locale]/     صفحات عمومی سایت
│   ├── (payload)/               پنل ادمین و REST/GraphQL API سی‌ام‌اس
│   ├── api/                     API خود اپلیکیشن (فرم‌ها، revalidate، health)
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/                      دیزاین سیستم (Button, Card, Section, …)
│   ├── layout/                  Header, Footer, ناوبری، تعویض زبان
│   ├── home/                    بخش‌های صفحه اصلی
│   ├── products/ projects/ articles/
│   └── shared/                  اجزای مشترک (فرم‌ها، گالری، SEO)
├── lib/
│   ├── cms/                     لایه دسترسی به داده + کش
│   ├── db/                      کلاینت Prisma
│   ├── i18n/                    پیکربندی زبان‌ها و مسیریابی
│   ├── seo/                     Metadata، hreflang، JSON-LD
│   ├── security/                Rate limit و هش IP
│   ├── validation/              اسکیماهای Zod
│   └── utils/
├── payload/                     Collectionها، Globalها، فیلدهای مشترک، seed
├── payload.config.ts
└── styles/globals.css           توکن‌های دیزاین سیستم (Tailwind v4)

messages/{fa,en,ar}.json         متن‌های ثابت رابط کاربری
migrations/                      مهاجرت‌های Payload
prisma/                          اسکیما و مهاجرت‌های Prisma
deploy/                          پیکربندی Nginx و Postgres
docs/ARCHITECTURE.md             مستند معماری
```

---

## استقرار

```bash
cp .env.example .env   # مقادیر واقعی را قرار دهید
docker compose up -d --build
```

سرویس‌ها: `nginx` (۸۰/۴۴۳) → `app` (Next.js standalone) → `postgres`.
دیتابیس روی هاست publish نمی‌شود.

قبل از سوئیچ به نسخه جدید، مهاجرت‌ها را اجرا کنید:

```bash
docker compose run --rm app npx prisma migrate deploy
docker compose run --rm app npx payload migrate
```

جزئیات Cloudflare، هدرهای امنیتی، بکاپ و نکات عملیاتی در
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
