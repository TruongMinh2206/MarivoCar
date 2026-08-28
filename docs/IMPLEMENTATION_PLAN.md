# MARIVO.vn — IMPLEMENTATION PLAN

Kế hoạch triển khai theo **Master Implementation Specification**, tuân thủ:

- **Extend, Don't Rewrite** (§4, §141) — mở rộng code hiện có, KHÔNG xóa/đổi tên 8 module admin.
- **P0 Flow bắt buộc** (§136, §152) — customer + admin: `CONFIRMED → IN_PROGRESS → COMPLETED`.
- **NO FAKE STATE** (§137-140) — UI phản ánh backend truth.
- **Authorization phải enforced server-side** (§145) — "Hiding a UI button is NOT authorization".
- Tài liệu này viết **trước khi code** (Discovery Phase 0). Không có code nào được viết trong giai đoạn viết docs; bắt đầu code **sau khi người dùng phê duyệt plan này**.

> **Trạng thái:** ⬜ chưa làm · 🔄 đang làm · ✅ hoàn thành · 🔴 chặn.

---

## A. NGUYÊN TẮC XUYÊN SUỐT

1. **Mọi chuyển trạng thái booking** đi qua một hàm duy nhất `transitionBookingStatus()` — validate ma trận chuyển trạng thái, ghi `BookingStatusHistory`, ghi `AuditLog` cho admin action.
2. **Authorization server-side:** mọi route `/api/admin/*`, `/api/bookings/[id]` PATCH... phải gọi `getSessionUser()` + kiểm tra role. Ẩn nút ≠ bảo mật.
3. **No hardcode giá:** UI luôn lấy total/subtotal/serviceFee từ server (Quote/Booking), không tính phía client.
4. **No fake state:** UI chỉ render status từ DB. Không tự gán `MRV...-0001`, không tự "CONFIRMED" khi chưa có backend.
5. **Không commit secret:** `.env` giữ trong git ignore; tạo `.env.example` với placeholder.
6. **Mỗi phase** kết thúc bằng test + typecheck + lint chạy xanh, là một commit riêng.

---

## B. MA TRẬN CHUYỂN TRẠNG THÁI (state machine — target)

Matrix dưới đây là **quy chuẩn** mà `transitionBookingStatus(from, to, actor)` sẽ enforce:

```
DRAFT            → PENDING | WAITING_PAYMENT | CANCELLED
PENDING          → WAITING_PAYMENT | PAID | PAYMENT_FAILED | CANCELLED
WAITING_PAYMENT  → PAID | PENDING | CANCELLED | PAYMENT_FAILED
PAID             → CONFIRMED | REFUND_REQUESTED | PAYMENT_FAILED
CONFIRMED        → IN_PROGRESS | CANCELLED
IN_PROGRESS      → COMPLETED
COMPLETED        → (terminal, chỉ REFUND_REQUESTED nếu sau hủy?)
CANCELLED        → (terminal)
PAYMENT_FAILED   → WAITING_PAYMENT (thử lại) | CANCELLED
REFUND_REQUESTED → REFUNDED | (reject)
REFUNDED         → (terminal)
```

Quyền thực hiện:
- **CUSTOMER:** `CANCELLED` (từ WAITING_PAYMENT/PENDING/CONFIRMED), `PAID` (tự khai — bank transfer thủ công, log audit + ghi rõ "chờ xác minh"), không thể CONFIRMED/IN_PROGRESS/COMPLETED.
- **ADMIN/STAFF/MANAGER:** `CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `REFUND_*`.
- **Hệ thống (payment engine):** `PAID`, `PAYMENT_FAILED`.

> `confirmBooking` hiện có đúng nhánh `PAID→CONFIRMED` — sẽ **được điều hướng qua** `transitionBookingStatus` thay vì update trực tiếp.

---

## C. CÁC PHASE

### PHASE 1 — AUTH THẬT + PHÂN QUYỀN (nền tảng; phải xong trước khi admin có dữ liệu thật)

**Vì sao trước tiên:** admin dashboard vô nghĩa nếu ai cũng vào được. Đây là điều kiện chặn P0.

1. **Backend auth — `/api/auth` mới:**
   - `POST /api/auth/login` — nhận `{email, password}`; tìm `User` theo email, `bcrypt.compare` với `passwordHash`, check `isActive`; tạo **session DB-backed** (dùng model `Session` có sẵn: token ngẫu nhiên an toàn, `expiresAt`, `userId`); set cookie **HttpOnly + SameSite=Lax + Secure(prod)** lưu `sessionToken`.
   - `POST /api/auth/logout` — xóa session + clear cookie.
   - `GET /api/auth/me` — trả user hiện tại (cho UI biết đã login + role).
   - Không dùng `localStorage["marivo_users"]` nữa cho login. (Guest checkout email vẫn giữ để không phá flow đặt chỗ.)
2. **`src/lib/auth.ts` (server helpers):**
   - `getSessionUser()` — đọc cookie → tra `Session`(+User, +role) → trả user hoặc null.
   - `requireUser()`, `requireAdmin()` (role ∈ ADMIN/SUPER_ADMIN hoặc STAFF/MANAGER tùy config), `requireRole([...])` — throw `UnauthorizedError`/`ForbiddenError`.
3. **Cập nhật `middleware.ts`:** `/admin` kiểm tra session **và role**; cũng chặn `/booking`, `/my-bookings`? → **giữ guest-checkout** (không chặn), chỉ chặn admin. (Quyết định: giữ luồng guest như hiện tại, không phá booking wizard.)
4. **Cập nhật `AuthContext.tsx`:** gọi `/api/auth/me` khi mount; `login()` qua API (không tự set cookie từ client); lưu thông tin user + role trong context nhưng **role/authorization quyết định ở server**.
5. **Trang login/register UI:** bỏ so sánh localStorage; gọi API. (Register: tạo `User role=CUSTOMER`, hash bcrypt.)

**File tạo mới:** `src/lib/auth.ts`, `src/app/api/auth/login|logout|me/route.ts`.
**File sửa:** `src/middleware.ts`, `src/contexts/AuthContext.tsx`, `(main)/login/page.tsx`, `(main)/register/page.tsx`.
**Schema:** tận dụng `Session` có sẵn (không cần thêm model; thêm `expiresAt` polish nếu cần qua `db push`).
**HẾT PHASE:** `POST /api/auth/login` admin@marivo.vn / Admin@123456 → vào `/admin` OK; customer không vào được `/admin`.

---

### PHASE 2 — SERVICE LAYER: TRANSITION + TRIP LIFECYCLE

Thêm vào `booking-engine.ts` (extend, không đổi hàm cũ):

1. **`transitionBookingStatus(bookingId, to, {actorId, actorRole, note, reason})`** — một điểm duy nhất:
   - Đọc booking + trạng thái hiện tại.
   - Validate theo ma trận ở mục B + quyền actor.
   - `prisma.$transaction`: update `Booking.status` → tạo `BookingStatusHistory` (status, note) → gọi side-effects (releaseCapacity khi CANCELLED; set voucher/email khi CONFIRMED) → **ghi `AuditLog`** (action=`CHANGE_STATUS`, entity=Booking, entityId=bookingId, metadata={`from,to,actorRole,note`}).
2. **`confirmBooking`** → refactor gọi `transitionBookingStatus(id, CONFIRMED, actor)` (giữ chữ ký cũ nếu unit test phụ thuộc, hoặc cập nhật test).
3. **`startTrip(bookingId, actor)`** — `CONFIRMED→IN_PROGRESS`, tạo history.
4. **`completeBooking(bookingId, actor)`** — `IN_PROGRESS→COMPLETED`, tạo history, trigger email/voucher finalize.
5. **`adminCancelBooking`** — vẫn qua `cancelBooking` nhưng thêm actor + audit.
6. **`getAdminBookings({status, search, page, limit, dateFrom, dateTo})`** — list có filter/pagination cho admin.
7. **`getBookingDetailAdmin(bookingIdOrCode)`** — detail đầy đủ (items, payments, statusHistory, customer, voucher, review…).

**File sửa:** `src/lib/booking-engine.ts`, `src/lib/audit.ts` (mới), test `booking-engine.test.ts`.
**Không thay đổi schema** nếu dùng `BookingStatusHistory` cho mốc thời gian (khuyến nghị). (Nếu cần `Booking.paidAt` để hiển thị: thêm qua `db push` — tùy chọn.)

---

### PHASE 3 — ADMIN API (backend cho dashboard)

Tạo `src/app/api/admin/**` (tất cả qua `requireAdmin()`):

| Route | Method | Chức năng | Engine dùng |
|---|---|---|---|
| `/api/admin/bookings` | GET | list + filter + pagination + search | `getAdminBookings` |
| `/api/admin/bookings/[id]` | GET | detail (items, payments, statusHistory, customer) | `getBookingDetailAdmin` |
| `/api/admin/bookings/[id]/status` | PATCH | `{status, note}` → transition | `transitionBookingStatus` |
| `/api/admin/stats` | GET | KPI dashboard (total, revenue, bookings hôm nay, active) | Prisma aggregate |
| `/api/admin/stats/recent` | GET | recent bookings cho dashboard | Prisma |

Ngoài ra (nhẹ, reuse demo UI nhưng data thật):
- `/api/admin/customers` GET · `/api/admin/payments` GET · `/api/admin/reviews` GET (+PATCH isVisible) · `/api/admin/services` GET.

**Validation:** schema zod riêng `src/schemas/admin.ts` (`transitionSchema`, `listQuerySchema`…).
**Response:** `successResponse`/`errorResponse` (chuẩn có sẵn).

---

### PHASE 4 — ADMIN UI (thay demo data bằng dữ liệu thật)

**Giữ nguyên `admin/layout.tsx`** (shell). Sửa nội dung từng page + tạo mới:

1. **`/admin/dashboard`** — bỏ KPI cứng; fetch `/api/admin/stats` + `/api/admin/stats/recent`; render đúng số thật + bảng recent (Link tới `/admin/bookings/[id]`).
2. **`/admin/bookings`** — bỏ `mockBookings`; fetch `/api/admin/bookings?status=&search=&page=`; giữ search/filter/pagination nhưng **gọi server**, không filter local; mỗi dòng link tới detail.
3. **`/admin/bookings/[id]` (TẠO MỚI)** — trung tâm yêu cầu:
   - Overview: mã, customer, service, ngày giờ, tổng tiền (từ server), trạng thái (`StatusBadge`).
   - **Status Timeline:** render `BookingStatusHistory` (đã có) → thể hiện `CONFIRMED → IN_PROGRESS → COMPLETED` rõ ràng.
   - **Actions (nút hiện theo status server, disable khi không hợp lệ):**
     - `PAID →` **[Confirm Booking]** (CONFIRMED)
     - `CONFIRMED →` **[Start Trip]** (IN_PROGRESS)
     - `IN_PROGRESS →` **[Complete]** (COMPLETED)
     - `[Cancel]` khi cancellable
     - Mỗi action kèm **note optional** + **confirm dialog**; gọi `PATCH /api/admin/bookings/[id]/status`.
   - **Payments:** danh sách Payment (status, amount, paidAt, provider).
   - **Activity/Audit:** danh sách `AuditLog` (ai làm gì khi nào).
   - Sau mỗi action: re-fetch để UI **phản ánh backend truth** (NO FAKE STATE, §137).
4. **`/admin/customers`, `/admin/payments`, `/admin/reviews`, `/admin/services`, `/admin/settings`** — nối API thật; settings lưu DB (thêm model `Settings` nếu chưa có).

**No fake state:** không tự `setStatus` ở client; chỉ render từ response API.

---

### PHASE 5 — NOTIFICATION & EMAIL khi CONFIRMED (đóng vòng khách→admin→khách)

1. **Bật/giữ `sendEmail`:** hiện `console.log`; bật Resend qua env `RESEND_API_KEY` (không hardcode secret), hoặc **giữ placeholder** nhưng thêm trạng thái `SENT/FAILED/RETRY` vào email sending.
2. **Trigger khi CONFIRMED:** trong `transitionBookingStatus` khi đến CONFIRMED → gọi `notifyBookingConfirmed` (email + DB Notification) và tạo `Voucher` (nếu spec yêu cầu, engine đã có).
3. **Trên booking detail customer:** booking PAID hiển thị "Đang chờ xác nhận", CONFIRMED hiển thị "Đã xác nhận" — khách thấy được sự thay đổi từ admin.
4. **Model `Notification`:** cân nhắc thêm field `status` (SENT/FAILED) + `sentAt` qua `db push` (§46).

---

### PHASE 6 — DỌN FAKE STATE + GIÁ HARDCODE (bắt buộc spec §137, §145)

1. **`(transactional)/payment/success` & `/failed`** — bỏ `const bookingCode = "MRV250620-0001"`; đọc từ **query param an toàn** (`/payment/success?booking=M RV...`) rồi fetch `/api/bookings/[bookingCode]` để lấy dữ liệu thật (validate server, không trust chỉ query).
2. **Wizard `booking/[id]` StepConfirmation/StepBankTransfer** — bỏ `basePrice = 350000`, `serviceFee = 25000`, "Standard Sedan"/"Airport Transfer" cố định; **lấy giá từ quote/booking thật** (dùng `PriceBreakdown` với data từ server). Không tính giá client-side.
3. Các page `/(main)` còn fake state — rà soát.

---

### PHASE 7 — TESTING (bổ sung cho phần mới)

1. **Unit (Vitest):**
   - `transitionBookingStatus` — ma trận hợp lệ/không hợp lệ, permission từng role, audit được ghi, capacity release khi cancel.
   - `auth` — login thành công/sai pass/sai role/inactive; `requireAdmin` đúng.
   - Admin API handlers — call đúng engine, trả đúng status.
   - `price`/`payment` giữ nguyên.
2. **E2E (Playwright — tạo `playwright.config.ts` + spec):** test P0 admin:
   - login admin → /admin/bookings → open booking → confirm → start → complete → trạng thái update + audit xuất hiện.
   - Customer: đặt booking → thanh toán → thấy CONFIRMED sau khi admin confirm.
   - Security: customer không truy cập được `/api/admin/*` (expect 403).

---

### PHASE 8 — BẢO MẬT & CỦNG CỐ (theo yêu cầu người dùng + spec)

1. **Ownership/IDOR:** `GET/PATCH /api/bookings/[id]`, `/api/vouchers/[id]`, `/api/my-bookings` kiểm tra chủ sở hữu (session user == booking.userId) hoặc guest email khớp. Admin đi qua `/api/admin/*` riêng (đã có role).
2. **Rate limiting** (§72): middleware/helper cho `/api/auth/login`, `/api/quotes`, `/api/bookings` — dùng DB/IP-based (đã có constant `RATE_LIMIT`).
3. **Payment webhook:** khi nối provider thật, verify signature + amount + idempotency (engine đã viết sẵn khung).
4. **CSRF:** SameSite=Lax + (nếu cần) token cho mutating API.
5. **Secret hygiene:** `.env.example`, check `.gitignore` chứa `.env`. (Không commit `password` này.)

---

### PHASE 9 — PHÂN QUYỀN CHI TIẾT (Staff/Manager nâng cao) [P1]

Phân quyền mịn hơn qua `requireRole([...])`: STAFF được confirm/start/complete; chỉ MANAGER/ADMIN được refund/refund approve + settings; SUPER_ADMIN quản user/roles. (Kế hoạch; triển khai sau P0 chạy ổn.)

---

### PHASE 10 — VOUCHER, PAYMENTS/REFUND, REVIEWS MODERATION, VEHICLES [P2]

- Voucher UI `/voucher/[id]` nối backend; tạo voucher khi CONFIRMED.
- Admin payments: review + refund (qua refund engine).
- Reviews moderation: `isVisible` toggle.
- Vehicles/availability CRUD (spec §40-42) khi cần vận hành "gán xe thật".

---

## D. THỨ TỰ ƯU TIÊN TÓM TẮT

| Ưu tiên | Phase | Mục tiêu |
|---|---|---|
| 🔥 P0 | 1–5 | **Admin booking management thật (CONFIRMED→IN_PROGRESS→COMPLETED) + auth/role + audit + email** |
| 🔥 P0 | 6 | Dọn fake state + giá hardcode |
| 📌 P1 | 7–8 | Test + bảo mật cơ bản (ownership, rate limit) |
| 🧩 P2 | 9–10 | Phân quyền nâng cao + module mở rộng |

---

## E. QUY TRÌNH BẮT ĐẦU (SAU KHI ĐƯỢC PHÊ DUYỆT)

1. Chạy `npm run test:run` để đóng baseline (các test hiện tại xanh).
2. Chạy lần lượt Phase 1 → 5, mỗi phase chạy `typecheck` + `lint` + `test:run`.
3. Chạy admin + customer trên `npm run dev` (MySQL tự chạy qua Startup vbs), demo end-to-end.
4. Mỗi phase là một commit riêng.

> **Lưu ý Prisma:** khi đổi schema phải tắt dev server trước khi `prisma generate`/`db push` (tránh EPERM trên Windows).

---

## F. PHẠM VI KHÔNG LÀM NGAY

- Không tích hợp nhà cung cấp thanh toán thật (giữ mock + bank transfer), trừ khi người dùng yêu cầu.
- Không viết lại booking wizard / admin layout (extend).
- Không thêm Docker/CI cho tới Phase 8+ (đã nêu là P2, khi cần deploy).
