# MARIVO.vn — HANDOFF DOCUMENT

> **Last updated:** 2026-08-25
> **Session status:** Phase 0-2 partially done, Phase 3+ not started
> **Branch:** master (1 commit: initial setup + seed + foundation)
> **Spec:** MARIVO_VN_SPEC.md (139 sections, full product specification)

---

## 📊 CURRENT STATE

### ✅ DONE

#### Infrastructure
- [x] Next.js 15 + React 19 + TypeScript 5.7
- [x] Prisma 6.2 (schema with 25+ models, PostgreSQL)
- [x] Tailwind CSS 3.4 (custom marivo/ocean/sunset palette)
- [x] Package.json (all deps listed but NOT installed — run `npm install`)
- [x] Git initialized (1 commit)
- [x] `.env.example` (database, auth, email, payment, storage, app config)

#### Backend Engines (`src/lib/`)
- [x] `prisma.ts` — Prisma singleton
- [x] `errors.ts` — Custom error classes (AppError, NotFound, Unauthorized, Forbidden, Validation, Conflict)
- [x] `api-utils.ts` — Pagination, response helpers
- [x] `constants.ts` — App constants (rate limits, pagination, booking config)
- [x] `price-engine.ts` — Price calculation (base, round-trip discount, group pricing, promotions)
- [x] `availability-engine.ts` — Check availability + reserve/release capacity
- [x] `quote-engine.ts` — Create/validate quotes with expiry (in-memory store)
- [x] `booking-engine.ts` — Create/confirm/cancel bookings, get by code
- [x] `booking-code.ts` — Generate `MRVYYMMDD-XXXX` unique codes
- [x] `payment-engine.ts` — Payment abstraction + mock provider + webhook processing

#### API Routes (7 routes)
- [x] `GET /api/services` — List with filter, sort, pagination
- [x] `GET /api/services/[slug]` — Detail with all relations
- [x] `POST /api/quotes` — Create quote (Zod validated)
- [x] `POST /api/bookings` — Create booking from quote
- [x] `GET /api/bookings/[id]` — Get by ID or booking code
- [x] `POST /api/payments` — Initialize payment
- [x] `POST /api/payments/webhook` — Process payment callback

#### Schemas & Types
- [x] `src/schemas/booking.ts` — Zod schemas (quote, booking, payment, review, contact)
- [x] `src/types/api.ts` — API response, pagination, request types
- [x] `src/types/index.ts` — Full types (Service, Booking, Quote, Payment, Review, Nav, Filters)

#### Seed Data (`prisma/seed.ts`)
- [x] 3 Users (Admin, Staff, Customer) with hashed passwords
- [x] 10 Service Categories (airport-transfer, private-car, rent-a-car, tours, tickets, hotels, restaurants, spa, products, guide)
- [x] 11 Locations (airport, beaches, attractions, resorts)
- [x] 4 Vehicle Types (sedan, SUV, minivan, motorbike)
- [x] 12 Services (3 airport transfer, 2 private car, 2 tours, 2 tickets, 1 hotel, 1 restaurant, 1 spa)
- [x] 5 Vehicles
- [x] 1 Hotel with 3 room types
- [x] 1 Restaurant with menu
- [x] 1 Spa with services
- [x] 3 Guide articles
- [x] Service images, prices, availability (30 days)

#### UI Components (10 components)
- [x] `Button.tsx` — 6 variants, 6 sizes, loading state
- [x] `Input.tsx` — Label, error, helper text, aria
- [x] `Select.tsx` — Options, error, chevron icon
- [x] `Card.tsx` — Card, CardHeader, CardContent, CardFooter
- [x] `Badge.tsx` — Badge + StatusBadge (booking status mapping)
- [x] `Rating.tsx` — Star rating with review count
- [x] `Price.tsx` — VND formatted price
- [x] `LoadingSkeleton.tsx` — ServiceCard, Detail, Booking, Page skeletons
- [x] `EmptyState.tsx` — NoServices, NoBookings, NoReviews
- [x] `ErrorState.tsx` — Error with retry

#### Layout
- [x] `Header.tsx` — Desktop nav + mobile hamburger + dropdown transport menu
- [x] `Footer.tsx` — 5-column footer with links + contact

#### Foundation
- [x] `src/app/layout.tsx` — Root layout (Inter + Plus Jakarta Sans fonts)
- [x] `src/app/globals.css` — Full design token system (CSS custom properties)
- [x] `src/middleware.ts` — Route protection + request ID header

---

### 🔴 NOT DONE (What to build next)

#### Priority: CRITICAL (P0 — blocking full flow)

**1. Pages — `src/app/(main)/`**
> These are the actual screens the user interacts with.

- [ ] `src/app/page.tsx` — **HOME PAGE**
  - Hero section with search bar
  - Service shortcuts grid (8 categories)
  - "Why Choose MARIVO" section
  - Recommended services carousel
  - Must be responsive (mobile/desktop)

- [ ] `src/app/(main)/airport-transfer/page.tsx` — **SERVICE LIST**
  - Filter sidebar (desktop) / filter sheet (mobile)
  - Sort (popular, price, rating)
  - Service cards grid
  - Pagination
  - Reusable for all categories (pass category as prop/layout)

- [ ] `src/app/(main)/airport-transfer/[slug]/page.tsx` — **SERVICE DETAIL**
  - Breadcrumb
  - Image gallery
  - Service info + rating
  - Booking summary card (desktop: sidebar, mobile: sticky bottom)
  - Description, Included, Policies, Reviews sections
  - Recommended services
  - Reusable via layout for: `/hotels/[slug]`, `/tours/[slug]`, `/tickets/[slug]`, etc.

- [ ] `src/app/(main)/booking/[id]/page.tsx` — **BOOKING FLOW (4 steps)**
  - Step 1: Trip Information (trip type, from, to, date, time, flight, passengers, luggage)
  - Step 2: Customer Information (name, email, phone, hotel, special request)
  - Step 3: Confirm Booking (full summary + price breakdown)
  - Step 4: Payment (payment method selector)
  - Progress stepper
  - Form validation (Zod + react-hook-form)
  - Quote-based pricing (server recalculates)

- [ ] `src/app/(main)/payment/success/page.tsx` — **PAYMENT SUCCESS**
  - Fetches booking state from backend (NOT from URL params)
  - Shows booking code, checkmark animation
  - "View My Booking" + "Back to Home" buttons

- [ ] `src/app/(main)/payment/failed/page.tsx` — **PAYMENT FAILED**
  - Shows failure reason
  - Retry button
  - Back to booking button

- [ ] `src/app/(main)/my-bookings/page.tsx` — **MY BOOKINGS**
  - Tabs: Upcoming / Completed / Cancelled
  - Booking cards with status badge
  - Empty states per tab

- [ ] `src/app/(main)/my-bookings/[id]/page.tsx` — **BOOKING DETAIL**
  - Booking info + status timeline
  - Trip information
  - Customer information
  - Payment info
  - Voucher link
  - Cancel button (if eligible)

- [ ] `src/app/(main)/voucher/[id]/page.tsx` — **VOUCHER**
  - Booking confirmation card
  - QR code (use `qrcode` package from deps)
  - Print/Download buttons
  - Contact information

- [ ] `src/app/(main)/contact/page.tsx` — **CONTACT US**
  - Contact form (name, email, phone, subject, message)
  - Business info + map placeholder
  - Form validation

- [ ] Category pages (simple list pages that reuse service list):
  - [ ] `/hotels/page.tsx`
  - [ ] `/private-car/page.tsx`
  - [ ] `/rent-a-car/page.tsx`
  - [ ] `/tours/page.tsx`
  - [ ] `/tickets/page.tsx`
  - [ ] `/restaurants/page.tsx`
  - [ ] `/spa/page.tsx`
  - [ ] `/products/page.tsx`
  - [ ] `/guide/page.tsx`

**2. Service List + Service Detail Components**
> Shared components used by all category pages.

- [ ] `src/components/service/ServiceCard.tsx` — Reusable card (adapts to category)
- [ ] `src/components/service/ServiceFilters.tsx` — Filter sidebar/sheet
- [ ] `src/components/service/ServiceGallery.tsx` — Image gallery with thumbnails
- [ ] `src/components/service/ServiceInfo.tsx` — Description, included, policies
- [ ] `src/components/service/RecommendedServices.tsx` — Related services row

**3. Booking Flow Components**

- [ ] `src/components/booking/BookingStepper.tsx` — Progress indicator
- [ ] `src/components/booking/TripInfoForm.tsx` — Step 1 form
- [ ] `src/components/booking/CustomerInfoForm.tsx` — Step 2 form
- [ ] `src/components/booking/BookingConfirmation.tsx` — Step 3 summary
- [ ] `src/components/booking/PaymentSelector.tsx` — Step 4 payment methods
- [ ] `src/components/booking/PriceBreakdown.tsx` — Price summary card

**4. Hooks (data fetching)**

- [ ] `src/hooks/useServices.ts` — Fetch service list with filters
- [ ] `src/hooks/useServiceDetail.ts` — Fetch single service
- [ ] `src/hooks/useQuote.ts` — Create/manage quotes
- [ ] `src/hooks/useBooking.ts` — Create/manage bookings
- [ ] `src/hooks/useMyBookings.ts` — User's bookings

**5. Layout for category pages**

- [ ] `src/app/(main)/layout.tsx` — Main layout with Header/Footer
- [ ] `src/app/(main)/[category]/layout.tsx` — Category layout with breadcrumb

---

#### Priority: HIGH (P1 — essential for production)

**6. Auth (NextAuth v5)**
- [ ] `src/lib/auth.ts` — NextAuth configuration (credentials + Google provider)
- [ ] `src/app/api/auth/[...nextauth]/route.ts` — NextAuth API route
- [ ] `src/app/(auth)/login/page.tsx` — Login page
- [ ] `src/app/(auth)/register/page.tsx` — Register page
- [ ] `src/hooks/useAuth.ts` — Auth session hook
- [ ] Update middleware to use real session

**7. Admin Panel**
- [ ] `src/app/(admin)/layout.tsx` — Admin layout (sidebar + topbar)
- [ ] `src/app/(admin)/admin/page.tsx` — Dashboard with charts
- [ ] `src/app/(admin)/admin/services/page.tsx` — Service management
- [ ] `src/app/(admin)/admin/bookings/page.tsx` — Booking management
- [ ] Admin API routes (`/api/admin/*`)
- [ ] Role-based access control

**8. Email System**
- [ ] `src/lib/email.ts` — Email sender (Resend)
- [ ] `src/lib/email-templates/` — Booking confirmation, payment, etc.
- [ ] `src/lib/notifications.ts` — Notification queue/worker

**9. Voucher System**
- [ ] `src/lib/voucher-engine.ts` — Generate voucher with QR code
- [ ] `src/app/(main)/voucher/[id]/page.tsx` — Voucher display + print

---

#### Priority: MEDIUM (P2 — quality & testing)

**10. Tests**
- [ ] Unit tests for engines (price, availability, quote, booking)
- [ ] API route tests
- [ ] E2E tests (Playwright) for full P0 flow
- [ ] `vitest.config.ts` setup

**11. Review System**
- [ ] `src/app/(main)/review/[bookingId]/page.tsx` — Review form
- [ ] `POST /api/reviews` — Submit review
- [ ] Review display on service detail

**12. Missing API Routes**
- [ ] `GET /api/categories` — List categories
- [ ] `GET /api/locations` — List locations (for pickup/dropoff selects)
- [ ] `GET /api/my-bookings` — User's bookings (authenticated)
- [ ] `POST /api/reviews` — Submit review
- [ ] `POST /api/contact` — Submit contact message
- [ ] `GET /api/vouchers/[id]` — Get voucher data

**13. SEO & Meta**
- [ ] Dynamic `generateMetadata()` for all pages
- [ ] Open Graph images
- [ ] `src/app/sitemap.ts` — Dynamic sitemap
- [ ] `src/app/robots.ts` — Robots.txt

---

## 🔧 SETUP COMMANDS

```bash
cd E:\Mario.vn
npm install
npx prisma generate
npx prisma db push        # or: npx prisma migrate dev --name init
npx tsx prisma/seed.ts
npm run dev
```

---

## 📁 FILE STRUCTURE (current + planned)

```
E:\Mario.vn\
├── prisma/
│   ├── schema.prisma          ✅ DONE
│   └── seed.ts                ✅ DONE
├── src/
│   ├── app/
│   │   ├── layout.tsx         ✅ DONE
│   │   ├── globals.css        ✅ DONE
│   │   ├── page.tsx           🔴 TODO (home page)
│   │   ├── (auth)/
│   │   │   ├── login/         🔴 TODO
│   │   │   └── register/      🔴 TODO
│   │   ├── (main)/
│   │   │   ├── layout.tsx     🔴 TODO
│   │   │   ├── hotels/        🔴 TODO
│   │   │   ├── airport-transfer/  🔴 TODO
│   │   │   ├── private-car/   🔴 TODO
│   │   │   ├── rent-a-car/    🔴 TODO
│   │   │   ├── tours/         🔴 TODO
│   │   │   ├── tickets/       🔴 TODO
│   │   │   ├── restaurants/   🔴 TODO
│   │   │   ├── spa/           🔴 TODO
│   │   │   ├── products/      🔴 TODO
│   │   │   ├── guide/         🔴 TODO
│   │   │   ├── contact/       🔴 TODO
│   │   │   ├── booking/       🔴 TODO
│   │   │   ├── payment/       🔴 TODO
│   │   │   ├── my-bookings/   🔴 TODO
│   │   │   └── voucher/       🔴 TODO
│   │   ├── (admin)/
│   │   │   └── admin/         🔴 TODO
│   │   └── api/
│   │       ├── services/      ✅ DONE
│   │       ├── quotes/        ✅ DONE
│   │       ├── bookings/      ✅ DONE
│   │       ├── payments/      ✅ DONE
│   │       ├── categories/    🔴 TODO
│   │       ├── locations/     🔴 TODO
│   │       ├── reviews/       🔴 TODO
│   │       ├── contact/       🔴 TODO
│   │       ├── my-bookings/   🔴 TODO
│   │       └── admin/         🔴 TODO
│   ├── components/
│   │   ├── ui/                ✅ DONE (10 components)
│   │   ├── layout/
│   │   │   ├── Header.tsx     ✅ DONE
│   │   │   └── Footer.tsx     ✅ DONE
│   │   ├── service/           🔴 TODO
│   │   └── booking/           🔴 TODO
│   ├── hooks/                 🔴 TODO
│   ├── lib/                   ✅ DONE (10 files)
│   ├── schemas/               ✅ DONE
│   ├── types/                 ✅ DONE
│   └── utils/                 ✅ DONE
├── package.json               ✅ DONE
├── tailwind.config.ts         ✅ DONE
├── next.config.ts             ✅ DONE
├── tsconfig.json              ✅ DONE
└── .env.example               ✅ DONE
```

---

## 🎯 NEXT SESSION PLAN

### Recommended order:

1. **Create `src/app/(main)/layout.tsx`** — Header/Footer wrapper
2. **Create `src/app/page.tsx`** — Home page (hero, shortcuts, recommended)
3. **Create `ServiceCard.tsx` + `ServiceFilters.tsx`** — Reusable service components
4. **Create service list page** — Airport Transfer first (P0), then replicate for others
5. **Create `ServiceGallery.tsx` + service detail page**
6. **Create booking flow** — 4-step wizard with forms
7. **Create payment pages** — Success/Failed
8. **Create My Bookings page** — With tabs and booking detail
9. **Auth** — NextAuth login/register
10. **Admin** — Dashboard + management pages

### Estimated files remaining: ~40-50 files
### Estimated time: 3-4 sessions

---

## ⚠️ KNOWN ISSUES / NOTES

1. **`npm install` not run yet** — node_modules doesn't exist, must run first
2. **Quote store is in-memory** — Replace with Redis/DB in production
3. **Auth is placeholder** — Middleware checks cookie but no real NextAuth yet
4. **Payment is mock-only** — Real providers (MoMo, VNPay, Stripe) need integration
5. **No email sending** — Resend is in deps but not wired up
6. **No real images** — All image paths point to `/images/` which don't exist yet
7. **Git hook issue** — `rtk` command not found; use `/mingw64/bin/git` directly or fix hook
8. **Booking flow needs URL state** — Use search params or client state for multi-step
9. **Service list page is reusable** — One component, pass category as prop/layout param

---

## 🔐 SEED CREDENTIALS

| User | Email | Password | Role |
|------|-------|----------|------|
| Admin | admin@marivo.vn | Admin@123456 | SUPER_ADMIN |
| Staff | staff@marivo.vn | Customer@123456 | STAFF |
| Customer | customer@example.com | Customer@123456 | CUSTOMER |
