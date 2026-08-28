# MARIVO.vn — IMPLEMENTATION ANALYSIS

Kết quả khảo sát (Discovery, Phase 0) toàn bộ repo tại `D:\T1\Mario.vn`, đối chiếu với Master Implementation Specification.

> **Phạm vi:** Tài liệu này là READ-ONLY. Không có code nào được viết trong giai đoạn này. Mọi mục "CẦN LÀM" nằm trong `IMPLEMENTATION_PLAN.md`.

---

## 1. TỔNG QUAN HIỆN TRẠNG

| Hạng mục | Hiện trạng | Ghi chú |
|---|---|---|
| Stack | Next.js 15 (App Router) + React 19 + TypeScript | Tailwind CSS 3, Prisma 6, MySQL 8.4.9 |
| Booking | Quote → Booking → My Bookings: **chạy được end-to-end** (ghi MySQL thật) | Payment thủ công (bank transfer) |
| Admin | 7 trang, **100% demo data tĩnh** | Không call API, không quản lý được gì thật |
| Auth | **Login MOCK trên localStorage**; cookie `marivo_session` = `user.id` thuần | **Không có backend xác thực thật** |
| Testing | Vitest: 10 bộ test engine (mock prisma) | Playwright cài nhưng **0 spec E2E** |
| Database | MySQL 8.4.9 local `C:\MySQL`, dùng `db push` (không migrations) | Schema khá đầy đủ (nhiều model được dựng sẵn **nhưng chưa dùng**) |
| Deployment | Không Dockerfile, không CI, không `.env.example` | Chạy `npm run dev` local |

---

## 2. FRONTEND

### 2.1 Kiến trúc
- **Router:** Next.js App Router; route groups `(main)` (public, có Header/Footer) và `(transactional)` (payment success/failed, không shell).
- **Layouts:**
  - `src/app/layout.tsx` — root, load fonts Inter/Montserrat, `globals.css`.
  - `src/app/(main)/layout.tsx` — `AuthProvider` + `Header` + `Footer` ("use client").
  - `src/app/admin/layout.tsx` — sidebar + topbar, `"use client"`, `NAV_ITEMS` 7 mục.
- **Route public hiện có (34 trang):**

| Nhóm | Route |
|---|---|
| Trang chủ | `/` |
| Điều động | `/airport-transfer`, `/private-car`, `/rent-a-car`, `/taxi`, mỗi loại có `/[...]` (slug/id) |
| Du lịch | `/tours`, `/tickets`, `/restaurants`, `/spa`, `/products`, `/guide` + các `/[slug]`/`/[id]` |
| Lưu trú | `/hotels`, `/hotels/[id]`, `/hotels/[slug]` |
| Đặt chỗ | `/booking/[id]` (wizard 5 bước), `/voucher/[id]` |
| Booking của tôi | `/my-bookings`, `/my-bookings/[id]`, `/my-bookings/[id]/payment` |
| Thanh toán | `/payment/[id]`, `/payment/success`, `/payment/failed` (trong `(transactional)`) |
| Auth/khác | `/login`, `/register`, `/forgot-password`, `/reset-password`, `/contact`, `/email/confirmation` |

> **Lưu ý spec §9:** spec liệt kê `/taxi`, `/guide`, `/products`, `/payment/[id]`... — hầu hết đã tồn tại. `/taxi` có page. Không có route `/voucher/[id]` trỏ đúng? — Có, tồn tại. **Route thiếu chưa thấy:** không có `/api/auth` (login/register), `/admin/login` riêng.

- **Kiểu trang:** hầu hết `"use client"`, fetch trực tiếp trong `useEffect` bằng `fetch()` — **không có API client tập trung** (chỉ có wrapper hook `useQuote`, `useBooking`, v.v. trong `src/hooks/`). Các thư mục `src/stores/`, `src/services/` **rỗng** (zustand/registry có cài nhưng chưa dùng).

### 2.2 Đã có sẵn (reuse được)
- Design tokens đầy đủ trong `globals.css` (`--color-primary #000D22`, `--color-cta #FFB700`, `--color-travel-blue #006CE4`, `--color-surface-*`, typography `--text-*`, `--radius-*`, `--shadow-*`, `--space-*`, container `container-marivo`, `rounded-btn`, `shadow-ambient`).
- Components `src/components/ui/`: `Button`, `Input`, `Select`, `Card`, `Badge`, `Rating`, `Price`, `LoadingSkeleton`, `EmptyState`, `ErrorState`.
- Components booking (`src/components/booking/`): `BookingStepper`, `TripInfoForm`, `CustomerInfoForm`, `PriceBreakdown`, `PaymentSelector`, `BookingConfirmation`.
- Components service: `ServiceCard`, `ServiceFilters`, `ServiceGallery`, `ServiceInfo`, `RecommendedServices`, `CategoryPage`.
- `StatusBadge` (trong `Badge.tsx`) **đã hiểu hầu hết BookingStatus**, kể cả `IN_PROGRESS`.

### 2.3 Lỗ hổng đáng chú ý
1. **Giá HARDCODE trong wizard** (`booking/[id]/page.tsx` — `basePrice = 350000`, `serviceFee = 25000`, "Standard Sedan", "Airport Transfer" cố định) trong StepConfirmation/StepBankTransfer, dù server đã tính giá lại đúng qua quote. **Vi phạm §24, §145.**
2. **`StepBankTransfer`/`StepComplete` trong wizard là fake**: nút "I've Completed Transfer" chỉ set state local, KHÔNG ghi DB (booking chỉ dừng ở `WAITING_PAYMENT`). Phần này đã được thay bằng trang payment độc lập nhưng wizard vẫn còn nhánh cũ.
3. `payment/success` và `payment/failed` **hardcode bookingCode** `MRV250620-0001` — fake state, không đọc từ query/API. **Vi phạm §137.**
4. Không có Empty/Loading/Error state đồng bộ cho mọi trang (một số trang có).

---

## 3. BACKEND

### 3.1 Kiến trúc
- **API:** Route Handlers (App Router). 13 route: `/api/quotes`, `/api/bookings`, `/api/bookings/[id]`, `/api/my-bookings`, `/api/payments`, `/api/payments/webhook`, `/api/services`, `/api/services/[slug]`, `/api/categories`, `/api/locations`, `/api/vouchers/[id]`, `/api/reviews`, `/api/contact`.
- **Service layer:** `src/lib/*-engine.ts` (chuẩn đẹp, spec §7 đồng ý):
  - `booking-engine` — `createBooking`, `markBookingPaid`, `confirmBooking`, `cancelBooking`, `getBookingByCode`, `getUserBookings`.
  - `quote-engine` — `createQuote`, `getQuote`, `validateQuote`, `markQuoteUsed` (quote lưu DB, có `expiresAt`, `isUsed`).
  - `price-engine` — `calculatePrice` (server-side, không tin client). Lưu ý: **dùng `Math.round` + basePrice*0.9 cho round trip; phí cố định `SERVICE_FEE_PERCENTAGE = 5`.**
  - `availability-engine` — `checkAvailability`, `reserveCapacity`, `releaseCapacity` (theo `ServiceAvailability`).
  - `payment-engine` — `initializePayment`, `processPaymentCallback` (provider "mock", idempotency, verify amount; có `Payment` status).
  - `voucher-engine` — `generateVoucher`, `generateVoucherHtml` (QR + email HTML).
  - `notification-engine` — `sendNotification`, `notifyBookingConfirmed`, `notifyPaymentReceived` (lưu DB + email qua `sendEmail` **comment placeholder Resend**).
- **Validation:** `src/schemas/booking.ts` (zod) — `quoteSchema`, `bookingCreateSchema`, `bookingCustomerSchema`, `paymentInitSchema`, `reviewSchema`, `contactSchema`.
- **Error:** `src/lib/errors.ts` — `AppError`, `NotFoundError`, `UnauthorizedError`, `ForbiddenError`, `ValidationError`, `ConflictError`, `handleApiError` (có log requestId).
- **Response:** `src/lib/api-utils.ts` — `successResponse`, `errorResponse`, `getPaginationParams`.

### 3.2 Luồng booking hiện tại (đã hoạt động)
```
UI wizard → POST /api/quotes → quote-engine.createQuote (validate availability, recalc price, lưu Quote)
        → POST /api/bookings → booking-engine.createBooking (validateQuote, re-check availability, recalc price,
                                tạo Booking status=WAITING_PAYMENT, BookingItem + serviceSnapshot, reserveCapacity,
                                markQuoteUsed, guest user theo email)
My Bookings → GET /api/my-bookings?email=... (không cần login)
Booking detail → GET /api/bookings/[id]  (tra theo bookingCode "MRV..." hoặc id)
Payment thủ công → PATCH /api/bookings/[id] {status:"PAID"} → markBookingPaid (WAITING_PAYMENT|PENDING → PAID)
Cancel → PATCH /api/bookings/[id] {status:"CANCELLED"} → cancelBooking (giải phóng capacity)
```

### 3.3 Trạng thái booking (STATE MACHINE)
- Enum `BookingStatus` (schema): `DRAFT, PENDING, WAITING_PAYMENT, PAID, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, PAYMENT_FAILED, REFUND_REQUESTED, REFUNDED`.
- **Trong code:** các chuyển trạng thái được ghi:
  - create → `WAITING_PAYMENT`
  - `initializePayment` → `PENDING` + tạo `BookingStatusHistory`
  - callback webhook → `PAID` / `PAYMENT_FAILED` / `CANCELLED` + history
  - `markBookingPaid` → `WAITING_PAYMENT|PENDING` → `PAID`
  - `confirmBooking` → chỉ khi `PAID` → `CONFIRMED`
  - `cancelBooking` → `WAITING_PAYMENT|PENDING|CONFIRMED` → `CANCELLED`
- **LỖ HỔNG LỚN:**
  - `confirmBooking` (booking-engine.ts:149) **KHÔNG được gọi từ bất kỳ API/UI nào** (chỉ có unit test). Nên booking PAID không bao giờ tự thành CONFIRMED từ phía người dùng.
  - **KHÔNG có code nào đưa booking sang `IN_PROGRESS` hay `COMPLETED`** (không có `startTrip`, `completeBooking`).
  - **Không có `transitionBookingStatus()`** (spec §33) — `PATCH /api/bookings/[id]` chỉ switch thủ công, không validate ma trận chuyển trạng thái, **không kiểm tra quyền (admin?)**. Một khách lạ biết id có thể PATCH CANCELLED.
  - **Quyền sở hữu (§68):** `GET /api/bookings/[id]` hiện **KHÔNG kiểm tra ownership/RBAC** — ai biết id/bookingCode là xem được. (Với guest checkout bằng email thì hợp lý phần nào, nhưng booking của user đăng nhập cần kiểm tra).

### 3.4 Payment
- Chỉ có provider **mock** (redirect `/payment/mock?...`), không nhà cung cấp thật. Bank transfer hiện là **self-attestation** (khách bấm nút) — **không có xác minh từ ngân hàng** (spec §50 yêu cầu server-side verification).
- `processPaymentCallback` đã có: verify (mock luôn true), idempotency (đã PAID thì return), **verify amount/currency**, cập nhật Payment + Booking + `BookingStatusHistory` trong `$transaction`. **Chưa kiểm tra chữ ký/replay thật** (mock không có).
- Payment `paidAt` có trong model Payment, **nhưng Booking KHÔNG có `paidAt`** (đã kiểm chứng schema — Booking không có field này; lần trước code thêm đã bị TS lỗi).

### 3.5 Notification / Email
- `notification-engine.ts` có template email (confirmation, payment received, voucher) + `sendNotification` lưu `Notification` + gọi `sendEmail`.
- `sendEmail` hiện **chỉ `console.log`** — dòng chú thích bật Resend nằm ở comment. Không có hàng đợi, không trạng thái `SENT/FAILED` cho email (model `Notification` chỉ có `isRead`), không retry.
- Email confirmation chưa được trigger tự động khi booking CONFIRMED (vì confirmBooking chưa được gọi).

### 3.6 Auth backend
- **KHÔNG có** `src/app/api/auth/**`. `next-auth` có cài (`^5.0.0-beta`) nhưng **chưa cấu hình** (không thấy `auth.ts`, `[...nextauth]`).
- Middleware `src/middleware.ts`: bảo vệ `/admin` bằng cách chỉ kiểm tra **cookie `marivo_session` tồn tại** — `ADMIN_ROUTES = ["/admin"]`. **Không kiểm tra role.** Cookie được set từ client (`AuthContext.setSessionCookie`) = `user.id` json-encoded.
- `bcryptjs` có trong deps (seed dùng để hash) nhưng login page không dùng.

---

## 4. ADMIN (HIỆN TRẠNG — TRỌNG TÂM)

### 4.1 Cấu trúc & nội dung
| Module | File | Nội dung hiện tại |
|---|---|---|
| Shell | `admin/layout.tsx` | Sidebar 7 mục (Dashboard, Bookings, Services, Customers, Payments, Reviews, Settings) + topbar "Admin" tĩnh. **Đẹp, dùng token.** |
| Dashboard | `admin/dashboard/page.tsx` | **Demo hoàn toàn**: 4 KPI cứng (1,234 / ₫45M / 48 / 892), bảng recent bookings tĩnh, bar chart tĩnh. Server component, không fetch. |
| Bookings | `admin/bookings/page.tsx` | **Demo**: 8 booking giả (`BK-2024-001`...), search/filter/pagination thuần client trên mock array. Nút Edit/Trash/MoreVertical **không làm gì**. |
| Customers | `admin/customers/page.tsx` | **Demo**: 8 khách giả, search client, không có detail page. |
| Payments | `admin/payments/page.tsx` | **Demo**: summary cards + payments giả. |
| Reviews | `admin/reviews/page.tsx` | **Demo**: 4 review giả (có cả tiếng Việt). |
| Services | `admin/services/page.tsx` | **Demo**: 6 service giả, dùng ảnh Unsplash. |
| Settings | `admin/settings/page.tsx` | Form tĩnh (tên công ty, email, phone, giờ hoạt động) — **không lưu DB**. |

**Kết luận:** Admin hiện tại **chỉ là skeleton UI**, không có dữ liệu thật, không có chi tiết booking, không thể đổi trạng thái booking, không có API admin, không phân quyền. Đây chính là lỗ hổng chính mà spec yêu cầu lấp: "Admin booking management" (CONFIRMED → IN_PROGRESS → COMPLETED).

### 4.2 Không tồn tại
- `/admin/bookings/[id]` (detail + actions).
- `src/app/api/admin/**` (không endpoint admin nào).
- Vehicles / Availability / Vouchers / Notifications / Reports / Content / Users / Roles / Audit-logs modules.
- Không trang admin login riêng (dùng `/login` chung + middleware).
- Không logout button thực sự khiếp… không có logout trong admin layout.

---

## 5. DATABASE (PRISMA / MYSQL)

### 5.1 Đã có (dùng được)
- **Enums:** `UserRole` (CUSTOMER, STAFF, MANAGER, ADMIN, SUPER_ADMIN), `BookingStatus` (11 giá trị), `PaymentStatus` (8), `LocationType`, `PriceType`.
- **Models chính:** `User` (+ `Account`, `Session`, `VerificationToken` — cơ sở NextAuth), `ServiceCategory`, `Service`, `ServiceImage`, `ServicePrice`, `ServiceAvailability`, `VehicleType`, `Vehicle`, `VehicleImage`, `Location`, `Tour`, `Ticket`, `Hotel`+`HotelRoom`, `Restaurant`, `Spa`, `Product`, `Booking`, `BookingItem`, `Quote`, `Review`, `Payment`, `Notification`, `AuditLog`, `Guide`, `Voucher`, `BookingStatusHistory`, `ContactMessage`.
- **Đã có sẵn nhưng CHƯA DÙNG hết:**
  - `AuditLog` (actorId, action, entity, entityId, metadata) — **chưa có code nào ghi audit**.
  - `BookingStatusHistory` — chỉ được tạo bởi payment engine; **chưa được admin dùng**.
  - `Notification` — lưu được nhưng email không gửi.
  - `Voucher` (bookingId, qrCode, code, isRedeemed) — có engine tạo nhưng chưa gắn vào flow.
  - `Account`/`Session`/`VerificationToken` — dựng sẵn cho NextAuth nhưng **chưa cấu hình NextAuth**.
  - Role trên User — có enum nhưng **không được dùng làm authorization** ở đâu.

### 5.2 Thiếu (cần cho admin dashboard)
- `Booking.paidAt` (chỉ Payment có) — để hiển thị thời gian thanh toán.
- Timestamp cho các mốc: `confirmedAt`, `startedAt`, `completedAt` (hoặc dùng `BookingStatusHistory` ghi mốc — không cần thêm field, chỉ cần query history).
- `Vehicle.status` / `registration` — Vehicle hiện chỉ là mô hình giá niêm yết (pricePerTrip), chưa phải "đơn vị xe thật" để GÁN cho booking (spec §40). §42 yêu cầu `/admin/vehicles`.
- Driver/DriverAssignment — không có model driver.
- `Booking.assignedVehicleId` / `assignedDriverId` — không có.
- Cột trạng thái gửi email cho `Notification` (SENT/FAILED) — §46.
- Không có cột `rateLimit`/cache table — §72 (rate limit chỉ khai báo constant, chưa middleware).

> **Chiến lược:** không cần đại trận migration. Có thể dùng `BookingStatusHistory` sẵn có để track mốc thời gian (kèm `note`), tránh thêm field. Nếu cần `paidAt`, `assignedVehicleId`... thì `prisma db push` thêm field — repo đang dùng db push (không migrations folder).

---

## 6. AUTH & SECURITY (ĐÁNH GIÁ NGuy hiểm)

| Hạng mục | Hiện trạng | Mức độ |
|---|---|---|
| Login | **MOCK** — so email/password với `localStorage["marivo_users"]` (register cũng lưu localStorage). Không gọi API, không bcrypt verify. | 🔴 Nghiêm trọng |
| Cookie | `marivo_session` = `encodeURIComponent(user.id)`; không HttpOnly, Secure, SameSite=Lax. Set từ **client**. | 🔴 Nghiêm trọng |
| Admin guard | Middleware chỉ check **cookie tồn tại**, không check role → **Customer set cookie là vào được `/admin`**; **cửa sau**: bất kỳ ai tự set cookie. | 🔴 Nghiêm trọng |
| Ownership | `GET /api/bookings/[id]`, `PATCH /api/bookings/[id]`, `/api/my-bookings` — không kiểm tra chủ sở hữu / quota. | 🟠 Cao |
| Mass assignment | `PATCH /api/bookings/[id]` nhận `{status}` tự do, chỉ switch — không DTO chặt, dễ bỏ sót transition không hợp lệ. | 🟠 Cao |
| Payment | provider mock; webhook không verify signature thật. | 🟠 Cao |
| CSRF | Cookie SameSite=Lax giảm thiểu phần nào cho request path-method; PATCH API không có CSRF token. | 🟠 Cao |
| Secrets | `.env` chứa `DATABASE_URL` root/password thật "password" (local). Không `.env.example`. Không git (chưa thấy). | 🟡 Vừa |
| Password hash | Seed dùng bcryptjs **đúng** chuẩn (SALT_ROUNDS=10) — chỉ là login chưa dùng. | 🟢 Tốt nền tảng |
| Rate limit | Chỉ khai báo trong `constants.ts` (`RATE_LIMIT`), chưa có middleware/service. | 🟡 Vừa |
| Upload | Review images dạng `Json` (URL), chưa có upload thật; constants đã khai `MAX_FILE_SIZE`, `ALLOWED_IMAGE_TYPES`. | 🟡 Vừa |

> **Xem chi tiết thêm:** `docs/SECURITY.md` (cần viết sau khi triển khai, hoặc ngay trước Phase 10).

---

## 7. TESTING

- **Unit:** Vitest 2 + jsdom. 10 bộ test: `booking-code`, `price-engine`, `availability-engine`, `payment-engine`, `quote-engine`, `booking-engine`, `voucher-engine`, `notification-engine`, `api-bookings`, `api-contact`. Tất cả **mock prisma** (không cần DB). Convention: `vi.mock("@prisma/client")`, `vi.mock("../prisma")`.
- **Config:** `vitest.config.ts` (alias `@`, setup `src/__tests__/setup.ts`, coverage v8).
- **E2E:** Playwright cài (`@playwright/test` + script `e2e`) nhưng **không có file `*.spec.ts`** nào. Không `playwright.config`.
- **CI:** không có `.github/workflows`.
- **Lint/Typecheck:** scripts `lint` (next lint) và `typecheck` (`tsc --noEmit`) có sẵn.

---

## 8. GAP SUMMARY (MISSING → CẦN LÀM)

### P0 — Luồng cốt lõi (phải có để "hoàn chỉnh")
1. **Admin booking management thật** — lấp admin bằng data thật từ DB:
   - `/admin/bookings` list từ API (pagination, search, filter status).
   - `/admin/bookings/[id]` detail + **actions: Confirm, Start Trip, Complete, Cancel** + status timeline + activity/audit.
   - Backend: expose `confirmBooking`, thêm `startTrip`, `completeBooking`; route `PATCH /api/admin/bookings/[id]` (hoặc mở rộng PATCH hiện có) **có kiểm tra admin**.
2. **Auth thật + phân quyền admin:**
   - `POST /api/auth/login` (bcrypt verify user trong DB, check `isActive`), `/api/auth/logout`, đăng ký.
   - Cookie session **HttpOnly, có signature/DB-backed** (có thể tận dụng model `Session` có sẵn).
   - Admin guard backend: middleware hoặc `requireAdmin()` helper kiểm tra session → user → `role ∈ {ADMIN, SUPER_ADMIN}` (hoặc STAFF/MANAGER tùy quyền).
3. **State machine có kiểm soát** (`transitionBookingStatus`) + ghi `BookingStatusHistory` + `AuditLog` cho mọi chuyển trạng thái admin.
4. **Email thật (hoặc ít nhất làm trạng thái SENT/FAILED + retry)** khi booking CONFIRMED — vì confirm giờ có người thực hiện (admin).

### P1 — Củng cố
5. Bỏ hardcode giá trong wizard / payment success-failed (đọc từ quote/booking thật). *(Không phải ưu tiên chặn ngang, nhưng spec §137 & §145).*
6. Ownership + quan tâm IDOR trên booking detail API.
7. Rate limiting cho login/booking/quotes.
8. Vehicles/availability management (P1, nếu khách chạy được thì sau).

### P2 — Hoàn thiện chuẩn spec §118–§136
9. Voucher UI/trang `/voucher/[id]` nối backend.
10. Payments admin (review + refund).
11. Reviews admin (moderation: `isVisible` toggle).
12. E2E Playwright cho luồng customer + admin.
13. CI (install → lint → typecheck → unit → build → e2e).
14. SECURITY.md, API.md, TESTING.md, DEPLOYMENT.md...

---

## 9. RỦI RO & XUNG ĐỘT

1. **Xung đột auth:** Admin hiện dùng cookie client tự set → nếu đổi sang HttpOnly session thì middleware + AuthContext cần sửa đồng bộ. Cần quyết định: giữ guest checkout (không login) cho `/booking`, `/my-bookings`, **nhưng `/admin` phải session thật**.
2. **Giá hardcode trong wizard** khác với giá server (quote) — nếu khách để ý thấy phí lệch là mất tin. Ưu tiên dọn ở P1.
3. **`markBookingPaid` hiện công khai** qua `PATCH /api/bookings/[id]` (không cần admin) — khách tự khai "đã chuyển khoản". Chấp nhận tạm cho bank transfer thủ công, nhưng **phải log AuditLog** và demo rõ là trạng thái "chờ xác minh" chứ không tự CONFIRMED.
4. **`confirmBooking` chưa được gọi** — nếu admin mới confirm, cần chắc chắn không làm hỏng flow payment hiện có (PAID → CONFIRMED là hợp lệ).
5. **Prisma client** dễ lỗi EPERM khi dev server đang giữ DLL nếu chạy `prisma generate` — cần tắt server khi thay đổi schema.

---

## 10. KẾT LUẬN

Repo có nền tảng **rất tốt**: engine layer chuẩn, schema giàu, design token đầy đủ, booking customer chạy thật. Phần **thiếu nhiều nhất và quan trọng nhất chính là ADMIN BOOKING MANAGEMENT + AUTH THẬT** — đúng phần người dùng yêu cầu. Hướng triển khai = **mở rộng code hiện có**, không viết lại: tận dụng `BookingStatusHistory` + `AuditLog` + engine đã có + admin layout đã có.

Xem kế hoạch chi tiết theo giai đoạn ở `IMPLEMENTATION_PLAN.md`.