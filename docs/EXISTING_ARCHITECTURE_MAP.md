# MARIVO.vn — EXISTING ARCHITECTURE MAP

Bản đồ **kiến trúc hiện có** (read-only) để mọi bước triển khai sau này "extend, not rewrite" theo đúng spec §141.

> **Quy ước:** `✅ ĐANG DÙNG` = code đường chính đang chạy. `🟡 CHỜ` = engine/model có sẵn nhưng chưa được gọi trong flow thực. `🔴 THIẾU` = không tồn tại, cần tạo.

---

## 1. CẤU TRÚC THƯ MỤC (CORE)

```
D:\T1\Mario.vn
├─ prisma/
│  ├─ schema.prisma        # 26 models + 5 enums (MySQL provider)
│  └─ seed.ts              # 3 users, 10 categories, 11 locations, 4 vehicleTypes, 11 services
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                # root fonts + globals
│  │  ├─ globals.css               # DESIGN TOKENS (màu, typo, radius, shadow)
│  │  ├─ (main)/                   # public shell (AuthProvider + Header + Footer)
│  │  ├─ (transactional)/          # payment success/failed (không shell)
│  │  ├─ admin/                    # ADMIN (7 modules, hiện demo)
│  │  └─ api/                      # 13 route handlers
│  ├─ components/
│  │  ├─ ui/                       # Button Input Select Card Badge Rating Price Skeleton Empty Error
│  │  ├─ booking/                  # BookingStepper TripInfoForm CustomerInfoForm PriceBreakdown PaymentSelector Confirmation
│  │  └─ service/                  # ServiceCard ServiceFilters Gallery Info Recommended CategoryPage
│  ├─ contexts/AuthContext.tsx     # ✅ auth MOCK (localStorage + cookie client)
│  ├─ hooks/                       # useQuote useBooking useMyBookings useServiceDetail useServices
│  ├─ lib/
│  │  ├─ prisma.ts                 # PrismaClient singleton
│  │  ├─ *.engine.ts               # booking quote price availability payment voucher notification
│  │  ├─ errors.ts  api-utils.ts  constants.ts  booking-code.ts
│  ├─ schemas/booking.ts           # zod schemas
│  ├─ types/index.ts  types/api.ts
│  ├─ middleware.ts                # admin guard (chỉ check cookie tồn tại)
│  └─ (các thư mục khác)
├─ vitest.config.ts
├─ package.json
└─ .env                            # DATABASE_URL mysql://root:password@localhost:3306/marivo
```

---

## 2. DATABASE (prisma/schema.prisma)

### 2.1 Enums
| Enum | Giá trị |
|---|---|
| `UserRole` | CUSTOMER, STAFF, MANAGER, ADMIN, SUPER_ADMIN |
| `BookingStatus` | DRAFT, PENDING, WAITING_PAYMENT, PAID, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, PAYMENT_FAILED, REFUND_REQUESTED, REFUNDED |
| `PaymentStatus` | CREATED, PENDING, PROCESSING, PAID, FAILED, CANCELLED, REFUND_REQUESTED, REFUNDED |
| `LocationType` | (airport, city, pier, resort...) |
| `PriceType` | (flat, per_km, per_hour...) |

### 2.2 Models chính dùng trong booking/admin flow

| Model | Field quan trọng | Trạng thái |
|---|---|---|
| `User` | email, passwordHash, fullName, phone, role, isActive, isEmailVerified | ✅ seed tạo; login không dùng |
| `Session` | token, userId, expiresAt | 🟡 dựng sẵn (NextAuth), chưa dùng |
| `Account`/`VerificationToken` | — | 🟡 chờ NextAuth |
| `Quote` | quoteId, serviceId, vehicleId, date, time, tripType, total, expiresAt, isUsed | ✅ createQuote persist DB |
| `Booking` | bookingCode, userId, status, subtotal, discount, serviceFee, total, customerName/Email/Phone/Hotel, specialRequest, notes, items[], payments[], statusHistory[], voucher? | ✅ WAITING_PAYMENT |
| `BookingItem` | serviceId, serviceName, quantity, unitPrice, total, serviceSnapshot(Json), metadata(Json) | ✅ |
| `BookingStatusHistory` | bookingId, status, note, createdAt | ✅ payment engine ghi; admin chưa dùng |
| `Payment` | bookingId, provider, providerTxnId, amount, currency, status, paidAt, metadata | ✅ engine ghi |
| `AuditLog` | actorId, action, entity, entityId, metadata | 🟡 **chưa có code ghi** |
| `Notification` | userId, type, isRead, data | ✅ lưu; email placeholder |
| `Voucher` | bookingId unique, code, qrCode, isRedeemed, redeemedAt | 🟡 engine tạo, chưa gắn flow |
| `Review` | bookingId unique, userId, rating, comment, isVisible | 🟡 API có; admin không có |
| `Service` | slug, name, price*, duration, images, categoryId | ✅ |
| `ServiceAvailability` | serviceId, date, totalSlots, bookedSlots | ✅ reserve/release |
| `Vehicle` | serviceId, vehicleTypeId, pricePerTrip, seats, luggage | 🟡 chỉ là giá, chưa "xe thật" |
| `ServicePrice` | serviceId, vehicleTypeId, dayType, price | ✅ price-engine |

> **Điểm mấu chốt:** không có `Booking.paidAt/confirmedAt/startedAt/completedAt`; không có `Booking.assignedVehicleId/Driver`; không có `Vehicle.status`.

---

## 3. SERVICE LAYER (src/lib/*.engine.ts) — "nơi đặt logic"

```
booking-engine.ts
   createBooking()      quote→WAITING_PAYMENT + items + reserveCapacity + markQuoteUsed   ✅ gọi từ /api/bookings
   markBookingPaid()    WAITING_PAYMENT|PENDING→PAID                                        ✅ gọi từ PATCH /api/bookings/[id]
   confirmBooking()     PAID→CONFIRMED                                                      🔴 KHÔNG AI GỌI (chỉ unit test)
   cancelBooking()      WAITING_PAYMENT|PENDING|CONFIRMED→CANCELLED (+releaseCapacity)      ✅ gọi từ PATCH
   getBookingByCode()   tra theo bookingCode                                                 ✅ GET /api/bookings/[MRV...]
   getUserBookings()    theo userId + status (pagination)                                   🟡 chưa dùng (my-bookings dùng email)

quote-engine.ts         createQuote / validateQuote / markQuoteUsed                         ✅
price-engine.ts         calculatePrice()  (server-side, không tin client)                   ✅
availability-engine.ts  checkAvailability / reserveCapacity / releaseCapacity               ✅
payment-engine.ts       MockPaymentProvider + initializePayment / processPaymentCallback    ✅ mock
voucher-engine.ts       generateVoucher / generateVoucherHtml (QR + email HTML)             🟡
notification-engine.ts  sendNotification / notifyBookingConfirmed / notifyPaymentReceived   🟡 email placeholder
```

---

## 4. API ROUTES (src/app/api/)

| Route | Method | Chức năng | Bảo mật |
|---|---|---|---|
| `/api/quotes` | POST | tạo quote | 🟡 rate limit thiếu |
| `/api/bookings` | POST | tạo booking (guest user theo email) | 🟡 |
| `/api/bookings/[id]` | GET | detail (theo bookingCode hoặc id) | 🔴 KHÔNG check ownership |
| `/api/bookings/[id]` | PATCH | `{status:"CANCELLED"\|"PAID"}` | 🔴 KHÔNG check role, switch thủ công |
| `/api/my-bookings` | GET | theo `customerEmail` + status filter | 🟡 |
| `/api/payments` | POST | initializePayment | 🟡 |
| `/api/payments/webhook` | POST | provider mock callback | 🔴 không verify thật |
| `/api/services` + `/api/services/[slug]` | GET | list/detail | 🟢 public |
| `/api/categories`,`/api/locations` | GET | options | 🟢 |
| `/api/vouchers/[id]` | GET | voucher detail | 🔴 không check ownership |
| `/api/reviews` | POST | tạo review | 🟡 |
| `/api/contact` | POST | gửi message | 🟡 |

**🔴 THIẾU:** toàn bộ `/api/auth/*`, `/api/admin/*`, chưa có middleware rate-limit, chưa có helper `requireAdmin()`.

---

## 5. Frontend TRANG ADMIN (hiện 100% demo)

| Route | File | Hiện trạng | Cần làm |
|---|---|---|---|
| `/admin` | `layout.tsx` | Sidebar + topbar đẹp, token đầy đủ | ✅ giữ nguyên |
| `/admin` | `dashboard/page.tsx` | KPI + recent + bar chart **tĩnh** | nối API thật |
| `/admin/bookings` | `bookings/page.tsx` | **8 booking giả** `BK-2024-001`, search local | nối `/api/admin/bookings` |
| `/admin/bookings/[id]` | 🔴 **không tồn tại** | — | **tạo mới** (detail + actions) |
| `/admin/customers` | `customers/page.tsx` | 8 khách giả | nối API |
| `/admin/payments` | `payments/page.tsx` | summary + payments giả | nối API |
| `/admin/reviews` | `reviews/page.tsx` | 4 review giả | nối API + moderation |
| `/admin/services` | `services/page.tsx` | 6 service giả (Unsplash) | nối API |
| `/admin/settings` | `settings/page.tsx` | form tĩnh | lưu DB (Settings model?) |

---

## 6. FLOW CUSTOMER (P0 — đang chạy đến PAID, thiếu CONFIRMED trở đi)

```
Trang chủ → dịch vụ → /booking/[id] wizard
  → POST /api/quotes        (recalc giá server, lưu Quote)
  → POST /api/bookings      (validate quote + availability, tính giá lại, tạo Booking WAITING_PAYMENT, guest user theo email)
  → My Bookings (email query) → /my-bookings/[id]
  → /my-bookings/[id]/payment  (bank transfer + QR)
  → PATCH /api/bookings/[id] {status:"PAID"}  → markBookingPaid → **PAID**  ✅ dừng tại đây
  → 🔴 KHÔNG có bước nào tới CONFIRMED / IN_PROGRESS / COMPLETED
```

---

## 7. KẾT NỐI "THIẾU" — Nơi các bước admin sẽ bám vào

Bảng dưới ánh xạ **mục tiêu spec** → **file hiện có** sẽ mở rộng (extend), để không viết lại:

| Cần làm (theo spec) | Extend vào đâu (đã có) | Tạo mới |
|---|---|---|
| `transitionBookingStatus` (kiểm soát CONFIRMED/IN_PROGRESS/COMPLETED/CANCELLED + history + audit) | `booking-engine.ts` (thêm hàm `transitionBookingStatus` dùng chung cho `confirmBooking`, thêm `startTrip`, `completeBooking`) | — |
| Admin API `/api/admin/bookings`, `/[id]`, PATCH status | pattern `api-utils.ts` + engines | `src/app/api/admin/**` |
| Admin detail UI + actions | `<Card/> <Button/> <Badge/> StatusBadge`, `admin/layout.tsx` | `admin/bookings/[id]/page.tsx` |
| Admin guard (role check) | `middleware.ts` + `prisma` + `Session` model (có sẵn) | helper `requireAdmin()` + `/api/auth/*` |
| Auth thật | `prisma User + Session + bcryptjs` (đã cài + seed hash) | `/api/auth/login|logout|me` |
| Audit mọi thay đổi trạng thái | `AuditLog` model + `notification-engine` pattern | helper `audit()` |
| Email khi CONFIRMED | `notification-engine.sendEmail` (cần bật Resend hoặc giữ placeholder + SENT/FAILED) | — |
| Timestamp mốc | `BookingStatusHistory` (đã có) — ghi khi transition | — |

> **Nguyên tắc:** mọi thay đổi logic đặt trong service layer (`*.engine.ts`) rồi expose qua route — đúng cấu trúc hiện tại. Frontend chỉ fetch + render thật, không tự bịa trạng thái (NO FAKE STATE, §137).
