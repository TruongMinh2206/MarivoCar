# KẾ HOẠCH CẢI THIỆN MARIVO.vn — 5 GÓI CHO 5 AGENT SONG SONG

> **Ngày:** 2026-09-11 · **Nguồn:** Audit UI (`audit/AUDIT-REPORT.md`) + soi sâu code bổ sung
> **Base branch:** `Kế-Thừa-Code` @ `c2de260` — mỗi agent tạo nhánh riêng từ đây
> **Nguyên tắc chung:** TDD (test trước), Conventional Commits, `npx tsc --noEmit` sạch, không `console.log` trong code mới, không sửa file ngoài phạm vi gói

---

## 1. TỔNG HỢP CÁC VẤN ĐỀ CẦN CẢI THIỆN

### 🔴 CRITICAL — phải sửa trước khi cho khách dùng thật

| # | Vấn đề | Bằng chứng | Gói |
|---|---|---|---|
| C1 | **Wizard booking bỏ qua `?serviceId=` và regex fallback không nhận dấu `-`** → slug nào cũng fail `/^[a-z0-9]{20,}$/` → **mọi booking đều rơi về sedan airport transfer**. Đặt SUV, tour 4 đảo, vé VinWonders… đều thành Sedan. E2E cũ pass chỉ vì `/booking/sedan` trùng fallback (may mắn) | `booking/[id]/page.tsx:1131-1133` (regex không chứa `-`); grep toàn file không thấy `useSearchParams` — query param `serviceId` bị ignore hoàn toàn, dù detail page dynamic gửi kèm (`[category]/[slug]/page.tsx:176`) | **Gói 1** |
| C2 | **Giá hiển thị trong wizard hardcode 350.000₫** bất kể service thật là gì | `booking/[id]/page.tsx:1374` | **Gói 1** |

### 🔴 HIGH — lỗi chức năng nghiêm trọng

| # | Vấn đề | Bằng chứng | Gói |
|---|---|---|---|
| H1 | **7 trang detail legacy dùng data cứng + link booking chết** (`/booking/20`, `/booking/40`, `/booking/${room.name}`…) | `hotels/[id]:123,144`, `tours/[id]:164`, `tickets/[id]:131`, `spa/[id]:103`, `rent-a-car/[id]:140` | **Gói 2** |
| H2 | **Route legacy `[id]` che (shadow) route dynamic `[category]/[slug]`** — Next.js ưu tiên segment tĩnh → ServiceCard link `/tours/four-islands-tour` đang rơi vào trang legacy data cứng, không phải trang dynamic API-backed (cần verify khi làm) | Cấu trúc route: `tours/[id]` tồn tại song song `[category]/[slug]` | **Gói 2** |
| H3 | **Register / Forgot-password / Reset-password là form giả** — chỉ `setTimeout` giả lập, không gọi API nào → user đăng ký xong không có tài khoản tồn tại | `register/page.tsx:85,120`, `forgot-password/page.tsx:19`, `reset-password/page.tsx:52` | **Gói 4** |
| H4 | **API reviews POST chắc chắn lỗi runtime**: ghi `userId: "anonymous"` nhưng `Review.userId` là FK bắt buộc tới `User` | `api/reviews/route.ts:25` vs `schema.prisma:437,447` | **Gói 5** |

### 🟡 MEDIUM

| # | Vấn đề | Bằng chứng | Gói |
|---|---|---|---|
| M1 | Home "Popular Services": 4 card cứng đều → `/airport-transfer` + giá **USD** ($25–40) trong khi site dùng VND (₫) | `page.tsx:52` `POPULAR_SERVICES` | **Gói 3** |
| M2 | "Explore Guides" 3 card đều → `/guide` (không tới bài viết nào) | `page.tsx:91` | **Gói 3** |
| M3 | Footer legal (Privacy/Terms/FAQ) là placeholder → `/guide` | `Footer.tsx:23-27` | **Gói 3** |
| M4 | **Categories `rent-a-car` + `products` không có service nào trong seed** → list page trống | `prisma/seed.ts` — 12 services chỉ thuộc 8 categories | **Gói 2** |
| M5 | `RATE_LIMIT` định nghĩa nhưng **không được dùng ở bất kỳ đâu** (dead code) | `constants.ts:26`, grep = 0 usage | **Gói 4** |
| M6 | Không có UI review trên trang detail (API GET có sẵn) | `api/reviews/route.ts:54-79` | **Gói 5** |

### ⚪ LOW / polish

| # | Vấn đề | Gói |
|---|---|---|
| L1 | `formatPrice` trùng lặp 3+ nơi, mỗi nơi format khác nhau | **Gói 5** |
| L2 | Không có custom 404 (`not-found.tsx`) | **Gói 5** |
| L3 | Trang taxi là CTA landing — **chủ đích, không sửa** (HANDOFF.md #6) | — |

---

## 2. MA TRẬN PHÂN CÔNG + TÊN NHÁNH

| Gói | Nhánh đề xuất | Mục tiêu | Độ phức tạp | File được phép đụng |
|---|---|---|---|---|
| 1 | `fix/booking-service-resolution` | Wizard nhận đúng service theo URL/param | M | `booking/[id]/page.tsx`, mới: `src/lib/service-resolver.ts` + test |
| 2 | `fix/legacy-detail-pages` | Bỏ/khử 7 trang legacy data cứng | L | 7 file `[id]/page.tsx` (xóa hoặc sửa), `prisma/seed.ts`, `e2e/*` |
| 3 | `feat/home-page-content` | Home + footer dùng nội dung thật, VND | S | `page.tsx` (home), `Footer.tsx`, mới: `privacy/terms/faq` pages, `sitemap.ts` |
| 4 | `feat/auth-flows` | 3 form auth thật + rate limiting | M | `api/auth/**`, 3 trang auth, mới: `schemas/auth.ts`, `lib/rate-limit.ts` |
| 5 | `feat/reviews-and-polish` | Review UI + fix API + formatPrice + 404 | M | `api/reviews/route.ts`, `[category]/[slug]/page.tsx`, `schema.prisma`, mới: `components/reviews/*`, `lib/format.ts`, `not-found.tsx` |

**Không giao nhau về file** (trừ 2 lưu ý merge ở §5). Mỗi agent nhận MỘT gói, tự TDD, tự commit.

### Hợp đồng giao tiếp quan trọng nhất (giữa Gói 1 ↔ Gói 2)

URL booking canonical (định dạng **đã tồn tại**, bên hai gói cùng tuân theo):

```
/booking/${service.slug}?serviceId=${service.id}
```

- **Gói 2 là producer**: mọi nút Book/Select trên trang detail phải emit đúng format này
- **Gói 1 là consumer**: wizard đọc `serviceId` param (ưu tiên 1) → resolve slug segment (ưu tiên 2) → cuid trực tiếp (ưu tiên 3, link cũ) → không tìm thấy thì hiện **"Service not found"** + link về category list, **TUYỆT ĐỐI KHÔNG fallback âm thầm**

Hai gói chạy song song được vì cùng code theo contract đã định sẵn.

---

## 3. CHI TIẾT TỪNG GÓI

### Gói 1 — `fix/booking-service-resolution` (CRITICAL — làm/merge trước nhất)

**Vấn đề (C1, C2):** Wizard hiện resolve service bằng regex `/^[a-z0-9]{20,}$/` trên URL segment — không chứa `-` nên **mọi slug đều fail** → fallback cứng về `cmtuhvfuu000tfyq8stoq3hb6` (sedan). Query param `?serviceId=` bị bỏ qua hoàn toàn. Giá ước tính hiển thị hardcode 350.000₫.

**Việc cần làm (TDD):**

1. **Viết test FAIL trước** — E2E mới trong `e2e/booking-flow.spec.ts` (hoặc file mới `e2e/service-resolution.spec.ts`): goto `/booking/four-islands-tour?serviceId=<tour-id-từ-DB>` → wizard phải hiển thị **tên/giá của tour**, tạo booking xong `GET /api/bookings/:id` trả về serviceId đúng tour (không phải sedan). Chạy → FAIL (chứng minh bug thật).
2. Tạo `src/lib/service-resolver.ts`: hàm thuần `resolveService({ segmentId, serviceIdParam })` trả về `{ kind: "id" | "slug" | "invalid" , ... }` — dễ unit test. Vitest riêng cho các case: cuid, slug có/không dấu `-`, số cũ (`20`), rác.
3. Sửa `booking/[id]/page.tsx`:
   - Đọc `useSearchParams()` lấy `serviceId` (⚠️ Next.js App Router: `useSearchParams` trong client component phải bọc `<Suspense>` ở page cha — nếu không build sẽ lỗi CSR bailout)
   - Fetch service thật: ưu tiên theo id (mở rộng `GET /api/services/[slug]` nhận cả id — file này thuộc phạm vi gói), rồi theo slug
   - **Xóa fallback sedan + regex cũ**; service không tồn tại → render state "Service not found" với link về `/[category]` + không cho tiếp tục wizard
   - Thay 350.000₫ (dòng ~1374) bằng `service.basePrice` / giá từ quote thật
4. Unit test resolver + chạy lại E2E ở bước 1 → PASS. Chạy `npm run e2e` toàn bộ (6 test cũ vẫn phải green — đặc biệt test `/booking/sedan` giờ phải resolve bằng slug thật chứ không phải nhờ fallback).

**Definition of Done:**
- [ ] Booking tour 4 đảo → booking trong DB có serviceId của tour
- [ ] `/booking/khong-ton-tai` → hiện not-found state, không tạo quote
- [ ] Giá hiển thị = giá service thật (theo DB, không hardcode)
- [ ] `tsc --noEmit` sạch, tất cả test cũ + mới green

---

### Gói 2 — `fix/legacy-detail-pages` (HIGH)

**Vấn đề (H1, H2, M4):** 7 trang `[id]` (hotels, restaurants, spa, products, rent-a-car, tickets, tours) render data cứng, nút Book trỏ `/booking/NN` chết. Route tĩnh che route dynamic. Categories rent-a-car + products không có service seed → list trống.

**Việc cần làm (TDD):**

1. **Verify H2 trước khi code:** truy cập `/tours/four-islands-tour` — xem trang nào render (legacy hay dynamic). Ghi nhận vào commit message/PR.
2. **Chọn phương án A (khuyến nghị): XÓA 7 route legacy `[id]`** → dynamic `[category]/[slug]` tự tiếp quản:
   - Viết E2E FAIL trước: `/tours/four-islands-tour` phải hiển thị tên/giá từ DB (seed có sẵn tour) — hiện fail vì trang legacy data cứng trả về
   - Xóa 7 thư mục `[id]`, grep toàn repo chắc chắn không còn link numeric (`/hotels/1`, `/booking/20`…) ở đâu nữa (đặc biệt `sitemap.ts`, components)
   - Chạy E2E → PASS
   - Phương án B (nếu A vướng): giữ route nhưng page thành redirect 301 sang `/[category]/[slug]` tương ứng
3. **Seed thiếu (M4):** thêm 2–3 services cho `rent-a-car` (xe tự lái sedan/suv/motorbike — model `VehicleType` đã có) và `products` (nước mắm, hạt điều…) vào `prisma/seed.ts` theo upsert pattern sẵn có. Chạy lại seed, verify list page có card.
4. Nút "Select room" (hotel): room-level booking chưa được wizard mô hình hóa → link tới booking service hotel kèm `?serviceId=` theo contract; ghi chú product decision trong PR.

**Definition of Done:**
- [ ] 7 URL detail category đều render data từ DB (verify qua E2E với ít nhất tours + hotels + spa)
- [ ] Không còn `/booking/[số]` hay `/booking/${room.name}` trong codebase (grep sạch)
- [ ] `/rent-a-car` + `/products` có ≥ 2 services hiển thị
- [ ] Toàn bộ e2e + vitest + tsc green

---

### Gói 3 — `feat/home-page-content` (MEDIUM)

**Vấn đề (M1, M2, M3):** Popular Services + Explore Guides + footer legal đều là placeholder cứng, sai đích, lệch tiền tệ.

**Việc cần làm:**

1. **Popular Services (M1):** mỗi card trỏ đúng category của chính nó — transfer → `/airport-transfer`, tour → `/tours`, ticket → `/tickets`, spa → `/spa`; giá đổi sang VND dùng format chuẩn (₫, `toLocaleString("vi-VN")`). *Nâng cao (tùy chọn nếu kịp):* thay cả khối bằng fetch API services thật như khối Recommended bên dưới — khi đó xóa USD luôn.
2. **Explore Guides (M2):** dùng slug guide thật từ seed (xem `prisma/seed.ts` phần Guide: `top-10-things-to-do`, …) → `/guide/${slug}`.
3. **Footer legal (M3):** tạo 3 trang tĩnh `src/app/(main)/privacy/page.tsx`, `terms/page.tsx`, `faq/page.tsx` — nội dung tiếng Việt cơ bản (5–8 mục mỗi trang, layout theo design token marivo); cập nhật `FOOTER_LINKS.legal` trỏ đúng; thêm 3 trang vào `src/app/sitemap.ts`.
4. **E2E:** test mới `e2e/home-content.spec.ts`: click từng popular card assert URL đúng category; click card guide assert tới `/guide/<slug>`; footer legal link tồn tại + HTTP 200.

**Definition of Done:**
- [ ] 4 popular card → 4 category khác nhau (không còn tất cả về airport-transfer)
- [ ] Không còn ký tự `$` trên home
- [ ] `/privacy`, `/terms`, `/faq` HTTP 200 + có trong sitemap
- [ ] Test + tsc green

---

### Gói 4 — `feat/auth-flows` (HIGH)

**Vấn đề (H3, M5):** 3 form auth giả (chỉ `setTimeout`); API chỉ có login/logout/me; `RATE_LIMIT` dead code; model `VerificationToken` có sẵn nhưng chưa dùng.

**Việc cần làm (TDD — viết test route FAIL trước):**

1. **`src/schemas/auth.ts`** (mới): Zod schemas `registerSchema`, `forgotPasswordSchema`, `resetPasswordSchema` (email, password ≥ 8 ký tự + tối thiểu 1 số/chữ hoa theo hướng dẫn sẵn có trong seed).
2. **`POST /api/auth/register`**: validate → check email trùng (409) → `hashPassword()` (có sẵn `lib/auth.ts`) → tạo User `CUSTOMER` → trả về thành công. Test Vitest mock prisma theo pattern `src/lib/__tests__/auth-engine.test.ts`.
3. **`POST /api/auth/forgot-password`**: tạo `VerificationToken` (model có sẵn — dùng `randomBytes` như pattern trong `lib/auth.ts`), gửi email qua `lib/email.ts` (console fallback đã sẵn). **Không tiết lộ email tồn tại hay không** trong response (chống enumeration) — luôn trả 200 generic.
4. **`POST /api/auth/reset-password`**: consume token (check expiresAt + đánh dấu dùng rồi) → update `passwordHash`.
5. **Wire 3 trang form** (`register`, `forgot-password`, `reset-password`): gọi API thật, giữ nguyên UI/UX hiện tại, xử lý loading/error state, xóa `setTimeout` mock. Reset-password đọc token từ query param `?token=`.
6. **Rate limiting (M5):** `src/lib/rate-limit.ts` (mới) — in-memory sliding window (cùng philosophy với quote store in-memory hiện tại, ghi rõ hạn chế multi-instance trong comment); áp vào login (5/15p), register (3/1h), forgot-password (3/1h) theo `RATE_LIMIT` constants. Return 429 + message. Unit test đầy đủ (trong window, hết window, reset).
7. **E2E:** register tài khoản mới → login ngay bằng tài khoản đó → thấy logged-in UI; login sai 6 lần → nhận 429.

**Definition of Done:**
- [ ] Register xong có User thật trong DB, login được ngay
- [ ] Forgot-password tạo được token + log email (console fallback); reset đổi được mật khẩu
- [ ] Login bị spam → 429
- [ ] Response forgot-password không lộ email tồn tại
- [ ] Test + tsc green

---

### Gói 5 — `feat/reviews-and-polish` (MEDIUM + LOW)

**Vấn đề (H4, M6, L1, L2):** API reviews POST vi FK (runtime error), không có UI review, formatPrice trùng lặp, không có 404.

**Việc cần làm (TDD):**

1. **Fix API reviews (H4):** chọn 1 trong 2:
   - **Phương án A (khuyến nghị — guest-friendly, đúng product):** guest review gắn với booking — form yêu cầu `bookingCode` + email khách; API verify booking tồn tại + email khớp trước khi tạo review; `userId` vẫn bắt buộc FK → **thêm 1 User guest-system hoặc làm `userId` nullable trong schema** (`prisma db push` + cập nhật relation). Quyết định trong PR, nêu rõ lý do.
   - **Phương án B (đơn giản):** chỉ user đã login được review (`getSessionUser` có sẵn).
   - Viết test route FAIL trước (hiện tại POST chắc chắn throw FK), fix xong PASS.
2. **Review UI (M6):** `src/components/reviews/ReviewForm.tsx` + `ReviewList.tsx` (client components, theo design token marivo, form có rating 1–5 + comment, list hiển thị tên + rating + ngày). Chèn section reviews vào `src/app/(main)/[category]/[slug]/page.tsx` **chỉ thêm section mới, không đụng khu vực booking CTA** (dòng 176). Gọi `GET /api/reviews?serviceId=` (đã có sẵn) + POST sau khi form submit.
3. **`src/lib/format.ts` (L1, mới):** `formatPrice(amount, currency?)` chuẩn — `toLocaleString("vi-VN")` + ₫; refactor `PriceBreakdown.tsx`, `MockPaymentForm.tsx`, `PaymentResultCard.tsx` dùng chung. **KHÔNG đụng `booking/[id]/page.tsx`** (lãnh thổ Gói 1). Vitest cho format (kể cả ICU-quirk `.`/`,` separator như HANDOFF.md #7 — dùng regex assert).
4. **`src/app/not-found.tsx` (L2, mới):** 404 thân thiện — brand marivo, thông báo, nút về Home + links category chính.
5. **E2E:** tạo booking qua API (pattern `booking-flow.spec.ts:114-150`) → POST review hợp lệ → mở trang detail service → thấy review trong list.

**Definition of Done:**
- [ ] POST review hợp lệ qua API → 201, review hiện ở trang detail
- [ ] 3 component dùng chung 1 `formatPrice`
- [ ] URL không tồn tại → trang 404 marivo (không phải default Next)
- [ ] Test + tsc green

---

## 4. THỨ TỰ TÍCH HỢP (MERGE ORDER)

```
Gói 1 (fix/booking-service-resolution)   ← merge TRƯỚC (consumer của contract)
   ↓
Gói 2 (fix/legacy-detail-pages)           ← merge thứ 2, rebase lên Gói 1 để test shadow-route với wizard mới
   ↓
Gói 3, 4, 5                               ← độc lập, merge theo bất kỳ thứ tự nào
```

Sau khi merge hết 5 gói, chạy "verify toàn cầu" trên nhánh gốc:

```bash
npm run test:run                                    # Vitest toàn bộ
npm run e2e                                          # Playwright E2E toàn bộ
npx tsc --noEmit                                    # Type check
npx playwright test --config=audit/playwright.audit.config.ts   # Chạy lại UI audit — kỳ vọng WARN "Popular Services" biến mất, 0 FAIL
```

---

## 5. LƯU Ý MERGE (2 điểm duy nhất có thể chạm nhau)

1. **`prisma/seed.ts`** — Gói 2 thêm services cho rent-a-car/products; Gói 5 nếu chọn user-guest có thể thêm user hệ thống. Xung đột nhỏ, dễ giải tay (cùng file, khác section).
2. **`e2e/booking-flow.spec.ts`** — Gói 1 có thể thêm test vào file này; nếu 2 gói cùng thêm test thì merge theo từng test block, không đụng test cũ.

Ngoài 2 điểm trên, **5 gói không chia sẻ file nào** — an toàn chạy 5 agent song song.

---

## 6. PROMPT GỢI Ý CHO TỪNG AGENT (copy-paste)

Mỗi agent nhận 1 prompt dạng sau (thay `{GÓI}` và `{NHÁNH}`):

```
Bạn là agent thực thi gói {GÓI} trong kế hoạch audit/IMPROVEMENT-PLAN.md.
1. Đọc audit/IMPROVEMENT-PLAN.md — phần gói của bạn + section 2 (hợp đồng URL).
2. Tạo nhánh {NHÁNH} từ nhánh hiện tại.
3. Làm theo TDD: viết test FAIL trước → implement → PASS. Tuân thủ phạm vi file
   của gói (§2), không sửa file của gói khác.
4. Sau mỗi bước: npm run test:run && npx tsc --noEmit phải green.
5. Commit theo Conventional Commits, mỗi commit mô tả rõ test nào được thêm/sửa.
6. Cuối cùng chạy toàn bộ npm run e2e, viết PR summary theo checklist
   "Definition of Done" của gói.
```

| Agent | Gói | Nhánh |
|---|---|---|
| 1 | Wizard service resolution | `fix/booking-service-resolution` |
| 2 | Legacy detail pages | `fix/legacy-detail-pages` |
| 3 | Home + footer content | `feat/home-page-content` |
| 4 | Auth flows + rate limit | `feat/auth-flows` |
| 5 | Reviews + polish | `feat/reviews-and-polish` |
