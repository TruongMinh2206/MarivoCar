# MARIVO.vn — HANDOFF DOCUMENT

> **Last updated:** 2026-09-10
> **Session status:** Platform feature-complete for the P0 booking flow; all tests green
> **Branch:** master
> **Spec:** MARIVO_VN_SPEC.md (139 sections, full product specification)

---

## 📊 CURRENT STATE

### ✅ DONE

#### Infrastructure
- [x] Next.js 15 + React 19 + TypeScript 5.7
- [x] Prisma 6.2 (schema with 25+ models, **MySQL**)
- [x] Tailwind CSS 3.4 (custom marivo/ocean/sunset palette)
- [x] Local MySQL database `marivo` created, schema pushed, seeded
- [x] `.env` (gitignored) with `DATABASE_URL`, `PAYMENT_PROVIDER=mock`
- [x] `.env.example` (mysql URL, auth, email, payment, storage, app config)

#### Backend Engines (`src/lib/`)
- [x] `prisma.ts` — Prisma singleton
- [x] `errors.ts` — Custom error classes (AppError, NotFound, Unauthorized, Forbidden, Validation, Conflict)
- [x] `api-utils.ts` — Pagination, response helpers
- [x] `constants.ts` — App constants (rate limits, pagination, booking config)
- [x] `price-engine.ts` — Price calculation (base, round-trip discount, group pricing, promotions)
- [x] `availability-engine.ts` — Check availability + reserve/release capacity
- [x] `quote-engine.ts` — Create/validate quotes with expiry (in-memory store)
- [x] `booking-engine.ts` — Create/confirm/cancel bookings, get by code
- [x] `admin-booking-engine.ts` — Admin booking management
- [x] `auth.ts` + auth-engine tests — Session auth (login/logout/me routes)
- [x] `booking-code.ts` — Generate `MRVYYMMDD-XXXX` unique codes
- [x] `payment-engine.ts` — Payment abstraction + mock provider + webhook processing
- [x] `email.ts` — Resend integration with console fallback when `RESEND_API_KEY` unset
- [x] `notification-engine.ts` — Sends notifications + emails (uses `email.ts`, never throws)
- [x] `booking-summary.ts` — Shared helpers for payment result pages (loads booking by code)

#### API Routes (16 routes)
- [x] `GET /api/services` — List with filter, sort, pagination
- [x] `GET /api/services/[slug]` — Detail with all relations
- [x] `POST /api/quotes` — Create quote (Zod validated)
- [x] `POST /api/bookings` — Create booking from quote
- [x] `GET /api/bookings/[id]` — Get by ID or booking code
- [x] `POST /api/payments` — Initialize payment
- [x] `POST /api/payments/webhook` — Process payment callback (mock provider supported)
- [x] `GET /api/categories` — List categories
- [x] `GET /api/locations` — List locations
- [x] `GET /api/my-bookings` — Bookings by email (guest mode) / by session (logged-in)
- `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- [x] `POST /api/reviews` — Submit review
- [x] `POST /api/contact` — Submit contact message
- [x] `GET /api/vouchers/[id]` — Get voucher data

#### Pages — complete
- [x] Home page (hero, categories, featured services)
- [x] 10 category list pages — all use shared `CategoryPage` component (dynamic, API-backed)
- [x] Service detail pages (`/[category]/[slug]` + per-category `[id]` routes)
- [x] Booking wizard `booking/[id]` — 4-step flow (trip → customer → confirm → payment), server-side quote + booking creation
- [x] Payment mock page `/payment/mock` — simulated provider UI (PAID/CANCELLED)
- [x] Payment success/failed pages — real DB-backed booking summary
- [x] My Bookings — email lookup (guest) + tabs; booking detail; retry payment
- [x] Voucher page
- [x] Login / Register / Forgot password / Reset password
- [x] Admin panel — dashboard, services, bookings, customers, payments, reviews, settings
- [x] Contact page

#### SEO
- [x] `src/app/sitemap.ts` — dynamic (static pages + categories + services + guides)
- [x] `src/app/robots.ts` — disallows admin/api/booking/payment/my-bookings/auth routes

#### Tests — all green
- [x] **Unit (Vitest):** 15 suites / 110 tests — engines (price, availability, quote, booking, payment, auth, admin-booking, booking-code, email, notification), API contact, payment components (MockPaymentForm, PaymentResultCard)
- [x] **E2E (Playwright):** 6 tests — full P0 flow: home → category list → service detail → 4-step guest booking wizard → my-bookings email lookup → mock payment webhook → PAID → success page
- [x] `npx tsc --noEmit` clean

---

## 🔴 NOT DONE (What to build next)

#### Priority: HIGH (P1 — essential for production)

**1. Real payment providers**
- [ ] MoMo / VNPay / Stripe integration (currently mock-only)
- [ ] Webhook signature verification per provider
- [ ] Payment retry/refund flows

**2. Production email templates**
- [ ] `src/lib/email-templates/` — branded HTML templates (booking confirmation, payment receipt)
- [ ] Wire notification-engine to send on booking/payment events in production

**3. Auth hardening**
- [ ] Rate limiting on login/register endpoints
- [ ] Password reset tokens persisted (currently session/cookie based)
- [ ] CSRF protection on state-changing forms

**4. Deployment**
- [ ] Production DB (managed MySQL) + migrations (replace `db push`)
- [ ] Environment secrets (Resend key, payment keys)
- [ ] CSP + security headers (see `next.config.ts`)
- [ ] Real images (seed data references `/images/` that don't exist yet)

#### Priority: MEDIUM (P2 — quality & polish)

**5. Review system UI**
- [ ] Review form on service detail (API exists)
- [ ] Review display integration

**6. Data layer upgrades**
- [ ] Quote store → Redis or DB (in-memory doesn't survive restarts / multi-instance)
- [ ] Availability reservations in DB transaction

**7. Monitoring & analytics**
- [ ] Error tracking (Sentry)
- [ ] Analytics (page views, conversion funnel)

---

## 🔧 SETUP COMMANDS

```bash
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Testing:
```bash
npm run test:run        # Vitest unit suite (110 tests)
npm run e2e             # Playwright E2E (starts dev server automatically)
npm run typecheck       # tsc --noEmit
```

Local DB: MySQL `marivo` database on localhost:3306 (root/admin in `.env`).

---

## ⚠️ KNOWN ISSUES / NOTES

1. **Quote store is in-memory** — replace with Redis/DB before production
2. **Payment is mock-only** — real providers need integration + signature verification
3. **`RESEND_API_KEY` is empty** — emails fall back to console logging (by design for dev)
4. **Seed images don't exist** — image paths reference `/images/` placeholders
5. **Git hook issue** — `rtk` command not found; use `/mingw64/bin/git` in Git Bash or plain `git` in PowerShell
6. **Taxi page** — is a "Call Taxi Now" CTA landing page, not a service list (taxi is not a DB category); kept intentionally
7. **Node ICU locale** — `vi-VN` price formatting uses "." thousands separator in Node (limited ICU); tests use regex `/^375[.,]000/` to cover both
8. **Emails on booking creation** — notification-engine writes to DB + console-logs emails; swap in real Resend key to send

---

## 🔐 SEED CREDENTIALS

| User | Email | Password | Role |
|------|-------|----------|------|
| Admin | admin@marivo.vn | Admin@123456 | SUPER_ADMIN |
| Staff | staff@marivo.vn | Customer@123456 | STAFF |
| Customer | customer@example.com | Customer@123456 | CUSTOMER |
