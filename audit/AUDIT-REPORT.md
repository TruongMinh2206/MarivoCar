# BÁO CÁO AUDIT UI & LINK — MARIVO.vn

> **Ngày audit:** 2026-09-10 · **Người thực hiện:** AI Assistant
> **Phạm vi:** 23 trang public + 16 luồng click CTA · **Thời gian chạy:** ~2.8 phút
> **Kết quả tự động:** 38 PASS / 1 WARN / 0 FAIL
> **Kết quả trace code:** +1 vấn đề HIGH mà test tự động không phát hiện được (xem §6.1)

---

## 1. Tóm tắt điều hành

| Hạng mục | Kết quả |
|---|---|
| Page load (23 trang) | ✅ 23/23 HTTP 200, không trang nào 500/404 |
| Điều hướng nav / footer / category tile | ✅ 100% đúng đích |
| Luồng booking chính (detail → Book Now → wizard) | ✅ Đúng service, đúng query param |
| Wizard step 1 → 2, guest lookup, login error | ✅ Hoạt động |
| Link "Popular Services" trên home | ⚠️ Cả 4 card đều trỏ `/airport-transfer` bất kể loại card |
| Link booking trên **trang detail legacy** (`hotels/[id]`, `tours/[id]`, `tickets/[id]`, `spa/[id]`, `rent-a-car/[id]`) | 🔴 **HIGH** — trỏ `/booking/20`, `/booking/40`… là ID không tồn tại, bị wizard **âm thầm chuyển về sedan airport transfer** → khách đặt nhầm dịch vụ |

**Kết luận:** Luồng P0 (list → detail → booking wizard → payment) hoạt động đúng và đầy đủ. Rủi ro lớn nhất nằm ở 5 trang detail legacy dùng dữ liệu cứng — nút "Book" của chúng dẫn khách đến **dịch vụ sai** mà không có cảnh báo nào.

---

## 2. Phương pháp

### 2.1. Bộ test Playwright riêng cho audit

| File | Vai trò |
|---|---|
| `audit/ui-link-audit.spec.ts` | 39 test: 23 capture page + 16 click CTA |
| `audit/playwright.audit.config.ts` | Config riêng — vì `playwright.config.ts` chính set `testDir: "./e2e"` nên audit phải có config độc lập (`testDir: "."` hiểu **theo thư mục của config**) |
| `audit/audit-results.json` | Output kết quả (sinh bởi `test.afterAll`) |
| `audit/screenshots/00-22.png` | 23 screenshot full-page, viewport 1280×800 |

Chạy: `npx playwright test --config=audit/playwright.audit.config.ts` (auto-start dev server nếu chưa chạy).

### 2.2. Kỹ thuật kiểm tra từng loại

- **Page load:** `goto` → đọc HTTP status; ≥400 = FAIL; chờ `networkidle` + 1s cho client fetch rồi chụp full-page.
- **Click CTA:** chọn bằng accessible role/name (getByRole) → click → `waitForURL(regex)` xác nhận đích — nếu sai đích, test fail ngay.
- **Trace code:** grep toàn bộ `href` chứa `/booking/` trong `src/` để đối chiếu những link mà click-test không phủ hết (5 trang legacy detail).

---

## 3. Kết quả page load — 23/23 PASS

| # | Trang | Path | HTTP |
|---|---|---|---|
| 00 | Home | `/` | 200 |
| 01 | Airport Transfer | `/airport-transfer` | 200 |
| 02 | Chi tiết sedan | `/airport-transfer/airport-transfer-sedan` | 200 |
| 03 | Private Car | `/private-car` | 200 |
| 04 | Rent a Car | `/rent-a-car` | 200 |
| 05 | Tours | `/tours` | 200 |
| 06 | Chi tiết tour | `/tours/four-islands-tour` | 200 |
| 07 | Tickets | `/tickets` | 200 |
| 08 | Hotels | `/hotels` | 200 |
| 09 | Chi tiết hotel (legacy) | `/hotels/1` | 200 |
| 10 | Restaurants | `/restaurants` | 200 |
| 11 | Spa | `/spa` | 200 |
| 12 | Products | `/products` | 200 |
| 13 | Taxi | `/taxi` | 200 |
| 14 | Guide | `/guide` | 200 |
| 15 | Bài guide | `/guide/top-10-things-to-do` | 200 |
| 16 | Contact | `/contact` | 200 |
| 17 | My Bookings | `/my-bookings` | 200 |
| 18 | Login | `/login` | 200 |
| 19 | Register | `/register` | 200 |
| 20 | Forgot Password | `/forgot-password` | 200 |
| 21 | Booking wizard | `/booking/cmtuhvfuu000tfyq8stoq3hb6` | 200 |
| 22 | Booking legacy ID | `/booking/20` | 200 ⚠️ (xem §6.1) |

Không có lỗi runtime, không trắng trang, không crash React ở bất kỳ trang nào.

---

## 4. Kết quả click CTA — 16 test

| Nguồn | Hành động | Đích thực tế | Kết quả |
|---|---|---|---|
| Home hero | Search | `/airport-transfer` | ✅ PASS |
| Home category grid | Tile Taxi | `/taxi` | ✅ PASS |
| Home category grid | Tile Spa | `/spa` | ✅ PASS |
| Home Popular Services | Card bất kỳ | `/airport-transfer` | ⚠️ WARN |
| Home CTA | Book Airport Transfer | `/airport-transfer` | ✅ PASS |
| Home CTA | Explore Tours | `/tours` | ✅ PASS |
| Nav | Airport Transfer | `/airport-transfer` | ✅ PASS |
| Nav | Guide | `/guide` | ✅ PASS |
| Nav | Sign In | `/login` | ✅ PASS |
| Footer | Rent a Car | `/rent-a-car` | ✅ PASS |
| Footer | Contact Us | `/contact` | ✅ PASS |
| Category list | Service card | `/airport-transfer/airport-transfer-sedan` | ✅ PASS |
| Service detail | Book Now | `/booking/airport-transfer-sedan?serviceId=cmtuhvfuu000tfyq8stoq3hb6` | ✅ PASS |
| Booking wizard | Continue (step 1→2) | Step 2 "Customer Information" render | ✅ PASS |
| My Bookings | Form lookup email | Input hiển thị | ✅ PASS |
| Login | Sai mật khẩu | Error hiển thị, không crash | ✅ PASS |

Điểm đáng chú ý nhất ở cột PASS: **service detail "Book Now" mang đúng `serviceId` query param** (`cmtuhvfuu000tfyq8stoq3hb6` — đúng service sedan trong DB), tức luồng chính data-driven hoạt động chuẩn end-to-end.

---

## 5. Nhận xét visual (từ screenshot đã review)

Đã xem kỹ 4 screenshot đại diện cho 4 nhóm trang chính:

### `00-home.png` — Home
- Hero biển + search card chồng lấn tạo depth tốt; 9 tile tròn danh mục (có taxi) đều hoạt động.
- **Điểm trừ:** khối "Popular Services" là **4 card cứng với giá USD ($25–$40)** trong khi toàn bộ site còn lại hiển thị VND (₫) — vừa lệch tiền tệ vừa lệch đích link (tất cả → `/airport-transfer`). Ngay dưới đó, khối "Recommended" lại là data thật từ API với link đúng — hai khối cạnh nhau lộ rõ sự chênh lệch chất lượng.

### `01-airport-transfer.png` — Category list
- Render chuẩn: gradient hero, 6 card dịch vụ có giá VND (₫), rating sao, nút "Book Now", sidebar filter. Đây là template dùng chung cho 10 trang category — đánh giá một là đánh giá cả loạt.

### `21-booking-wizard.png` — Booking wizard
- Functional đầy đủ: 4-step indicator, form Trip Information với điểm đón (Phu Quoc International Airport), điểm đến, date/time, stepper hành khách/hành lý. Step 1→2 chuyển mượt (đã verify bằng click).

### `09-hotels-detail-legacy.png` — Legacy detail
- Trang load đẹp (nền tảng Unsplash hotlink nên có ảnh thật) nhưng **chính là nơi chứa các nút booking chết** — bề ngoài không cho thấy dấu hiệu gì, vì fallback che giấu lỗi (§6.1).

**Nhận xét chung:** hệ design token (palette marivo/ocean/sunset) nhất quán, không thấy layout vỡ, không ảnh vỡ hiển thị. Chất lượng visual của các trang data-driven tốt hơn hẳn các trang cứng legacy.

---

## 6. Vấn đề phát hiện

### 6.1. 🔴 HIGH — Link booking trên trang detail legacy dẫn đến **dịch vụ sai** (silent misbooking)

**Cơ chế lỗi (2 lớp chồng nhau):**

Lớp 1 — các nút booking trên trang legacy dùng ID cứng không tồn tại:

| File | Dòng | Link | Ý định |
|---|---|---|---|
| `hotels/[id]/page.tsx` | 123 | `/booking/${room.name}` → `/booking/Deluxe Ocean View` | Chọn phòng |
| `hotels/[id]/page.tsx` | 144 | `/booking/40` | Book hotel |
| `tours/[id]/page.tsx` | 164 | `/booking/20` | Book tour |
| `tickets/[id]/page.tsx` | 131 | `/booking/30` | Book vé |
| `spa/[id]/page.tsx` | 103 | `/booking/60` | Book spa |
| `rent-a-car/[id]/page.tsx` | 140 | `/booking/72` | Thuê xe |

Lớp 2 — wizard che lỗi bằng fallback âm thầm (`booking/[id]/page.tsx:1131-1133`):

```ts
const SERVICE_ID = /^[a-z0-9]{20,}$/.test(rawId)
  ? rawId
  : "cmtuhvfuu000tfyq8stoq3hb6"   // ← sedan airport transfer
```

Mọi ID không phải cuid hợp lệ (số `20`, `40`…, tên phòng có dấu cách) đều **rơi vào sedan transfer**. Khách ở trang hotel bấm "Select" phòng Deluxe → wizard hiện form đặt **airport transfer sedan**. Trang vẫn HTTP 200, không lỗi, không cảnh báo — khách vội có thể thanh toán nhầm dịch vụ hoàn toàn khác. Đây là lý do test tự động vẫn PASS: URL load thành công, chỉ có **nội dung dịch vụ là sai**.

**Đánh giá:** nghiêm trọng hơn 404, vì 404 khách biết ngay còn lỗi này che giấu hoàn toàn. Ảnh hưởng tiền bạc trực tiếp (đặt + thanh toán nhầm dịch vụ).

### 6.2. ⚠️ MEDIUM — "Popular Services" trên home: card nào cũng về `/airport-transfer`

`POPULAR_SERVICES` trong `src/app/(main)/page.tsx` là 4 card cứng (transfer / tour / ticket / spa) nhưng **tất cả** đều `href="/airport-transfer"`. Click card "Island Hopping Tour" lại về danh sách airport transfer — vi phạm kỳ vọng người dùng (theo audit: WARN).

### 6.3. ⚠️ MEDIUM — Lệch tiền tệ: home USD, còn lại VND

Cùng khối Popular Services hiển thị `$25–$40` trong khi mọi trang khác (list, detail, wizard, payment) đều format VND (₫). Với sản phẩm định vị thị trường Việt Nam, nên thống nhất VND.

### 6.4. LOW — Footer legal links là placeholder

Privacy Policy / Terms of Service / FAQ đều trỏ `/guide` — không có trang legal thật. Chấp nhận được cho MVP, cần làm trước khi production.

### 6.5. INFO — Các điểm đã biết / chủ đích (không phải bug)

- **Trang taxi** là CTA landing "Call Taxi Now" chứ không phải list dịch vụ — chủ đích (taxi không phải category trong DB), đã ghi nhận trong HANDOFF.md.
- **Ảnh seed** reference `/images/` chưa tồn tại (HANDOFF known issue); các trang legacy thì hotlink Unsplash. Screenshot cho thấy các trang vẫn render ổn, nhưng production cần ảnh thật self-host.
- **Guest checkout** trên `/booking` và `/my-bookings` là chủ đích (middleware chỉ bảo vệ `/admin`).

---

## 7. Khuyến nghị (theo thứ tự ưu tiên)

1. **[P0] Sửa link booking legacy** — 2 phương án:
   - **A (đúng đích, ít công):** thay các `/booking/NN` cứng bằng query-param pattern đã hoạt động: `/booking/${service.slug}?serviceId=${service.id}` sau khi tra service thật từ DB (hoặc seed dữ liệu tương ứng cho hotel/tour/ticket/spa/rental).
   - **B (triệt để):** bỏ hẳn các trang legacy `[id]` — redirect 301 sang route động `[category]/[slug]` đang data-driven.
   Đồng thời **bỏ fallback âm thầm** trong wizard: ID không hợp lệ nên hiện "Service not found" + nút về danh mục, thay vì tự thay sedan.
2. **[P1] Sửa 4 card Popular Services** — mỗi card trỏ đúng category tương ứng (`/tours`, `/tickets`, `/spa`, `/airport-transfer`) hoặc thay cả khối bằng dữ liệu thật từ API như khối Recommended bên dưới.
3. **[P1] Thống nhất VND** trên home, bỏ giá USD cứng.
4. **[P2] Trang legal thật** cho footer (Privacy/Terms/FAQ) — hoặc tạm ẩn nếu chưa có nội dung.
5. **[P2] Thêm regression test:** click "Select"/"Book" trên 5 trang legacy detail, assert URL booking chứa `serviceId` hợp lệ — chống tái diễn 6.1.

---

## 8. Kết luận

Nền tảng P0 vận hành tốt: 23/23 trang load, toàn bộ điều hướng chính xác, wizard booking hoạt động end-to-end với đúng dữ liệu dịch vụ. Chất lượng visual của các trang data-driven đạt trình độ production-ready cho MVP.

Rủi ro duy nhất nghiêm trọng là **bộ trang detail legacy với dữ liệu cứng** — vừa sai link vừa bị fallback che giấu, dẫn đến khả năng đặt nhầm dịch vụ. Đây là mục duy nhất nên chặn trước khi cho khách thật sử dụng. Các vấn đề còn lại (Popular Services, tiền tệ, legal links) là chỉnh sửa cosmetic, gói trong một PR nhỏ.

**Artifacts:**
- Kết quả máy đọc được: `audit/audit-results.json`
- Screenshot (không commit, xem local): `audit/screenshots/00-22.png`
- Chạy lại audit bất cứ lúc nào: `npx playwright test --config=audit/playwright.audit.config.ts`
