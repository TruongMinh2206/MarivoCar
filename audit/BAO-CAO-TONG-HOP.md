# BÁO CÁO TỔNG HỢP — AUDIT & KẾ HOẠCH CẢI THIỆN MARIVO.vn

> **Ngày:** 2026-09-11 · **Người thực hiện:** AI Assistant
> **Đây là bản tổng hợp duy nhất cần đọc — chi tiết đầy đủ ở 2 tài liệu:**
> - `audit/AUDIT-REPORT.md` — báo cáo audit UI & link (39 test, 23 screenshot)
> - `audit/IMPROVEMENT-PLAN.md` — kế hoạch 5 gói chi tiết (TDD, DoD từng gói)

---

## 1. TÓM TẮT ĐIỀU HÀNH

| Hạng mục | Kết luận |
|---|---|
| Trang public (23/23) | ✅ HTTP 200 toàn bộ, không lỗi runtime |
| Điều hướng nav/footer/tile/CTA | ✅ 38/39 kiểm tra PASS |
| Luồng booking chính | 🔴 **Vẻ ngoài hoạt động nhưng đang đặt nhầm dịch vụ** (C1) |
| Form auth | 🔴 3 form giả, không gọi API (H3) |
| Kiến trúc nền | ✅ Design token nhất quán, các trang data-driven chất lượng tốt |

**Đánh giá tổng thể:** Nền tảng render và điều hướng tốt, nhưng **luồng booking — tính năng cốt lõi bán tiền — đang âm thầm tạo booking sai dịch vụ ở mọi trường hợp trừ airport sedan**, và không có cảnh báo nào cho user. Đây là chặn đường duy nhất trước khi cho khách thật dùng.

---

## 2. PHƯƠNG PHÁP AUDIT

**Giai đoạn 1 — Audit tự động bằng Playwright** (`audit/ui-link-audit.spec.ts`):

- 39 test: 23 capture page (check HTTP status, chờ networkidle, chụp full-page 1280×800) + 16 click CTA thật (getByRole → click → `waitForURL` xác nhận đích)
- Kết quả ghi ra `audit/audit-results.json`: **38 PASS / 1 WARN / 0 FAIL**, runtime ~2.8 phút
- 23 screenshot full-page tại `audit/screenshots/00–22.png`

**Giai đoạn 2 — Soi sâu code (deep-dive trace):**

- Grep toàn bộ `href` chứa `/booking/` trong `src/` — phát hiện các link mà click-test không phủ được
- Đọc logic resolve service trong wizard → phát hiện 2 bug CRITICAL mà test tự động **không thể** phát hiện (URL vẫn 200, chỉ nội dung dịch vụ là sai)
- Đối chiếu `prisma/seed.ts` với schema → phát hiện category trống, FK violation, dead code

---

## 3. DANH SÁCH VẤN ĐỀ ĐẦY ĐỦ (tra cứu theo mã)

### 🔴 CRITICAL — chặn trước khi cho khách dùng thật

| Mã | Vấn đề | Bằng chứng (file:dòng) | Gói |
|---|---|---|---|
| **C1** | Wizard resolve service bằng regex `/^[a-z0-9]{20,}$/` **không chứa dấu `-`** → mọi slug (`/booking/four-islands-tour`) đều fail → **âm thầm fallback về sedan airport transfer**. Query param `?serviceId=` (trang detail dynamic gửi kèm) **không bao giờ được đọc** (không có `useSearchParams` trong file). Hệ quả: đặt tour 4 đảo, vé VinWonders, private SUV… đều thành Sedan | `src/app/(main)/booking/[id]/page.tsx:1131-1133` | 1 |
| **C2** | Giá hiển thị trong wizard **hardcode 350.000₫** bất kể service thật | `booking/[id]/page.tsx:1374` | 1 |

> ⚠️ **Vì sao E2E cũ vẫn pass:** test dùng `/booking/sedan` — trùng fallback một cách ngẫu nhiên. Không phải luồng đúng, là trùng key.

### 🔴 HIGH — lỗi chức năng nghiêm trọng

| Mã | Vấn đề | Bằng chứng | Gói |
|---|---|---|---|
| **H1** | 7 trang detail legacy dùng data cứng, nút Book trỏ link chết: `/booking/20`, `/booking/40`, `/booking/30`, `/booking/60`, `/booking/72`, `/booking/${room.name}` (URL chứa dấu cách — vô hiệu) | `hotels/[id]:123,144` · `tours/[id]:164` · `tickets/[id]:131` · `spa/[id]:103` · `rent-a-car/[id]:140` | 2 |
| **H2** | Route tĩnh `[id]` có thể **che (shadow)** route dynamic `[category]/[slug]` — link chuẩn từ ServiceCard có thể đang rơi vào trang legacy data cứng thay vì trang API-backed (agent verify khi làm) | Cấu trúc: `tours/[id]` song song `[category]/[slug]` | 2 |
| **H3** | **Register / Forgot-password / Reset-password là form giả** — handler chỉ `setTimeout` giả lập loading rồi báo thành công, không gọi API nào → user "đăng ký xong" không có tài khoản tồn tại | `register/page.tsx:85,120` · `forgot-password/page.tsx:19` · `reset-password/page.tsx:52` | 4 |
| **H4** | API `POST /api/reviews` ghi `userId: "anonymous"` nhưng `Review.userId` là **FK bắt buộc** tới `User` → chắc chắn lỗi runtime khi gọi | `api/reviews/route.ts:25` vs `schema.prisma:437,447` | 5 |

### 🟡 MEDIUM

| Mã | Vấn đề | Bằng chứng | Gói |
|---|---|---|---|
| **M1** | Home "Popular Services": 4 card cứng (transfer/tour/ticket/spa) đều → `/airport-transfer` + giá **USD** ($25–40) trong khi site dùng VND (₫) | `src/app/(main)/page.tsx:52` | 3 |
| **M2** | "Explore Guides" 3 card đều → `/guide`, không tới bài viết nào | `page.tsx:91` | 3 |
| **M3** | Footer legal (Privacy/Terms/FAQ) là placeholder → `/guide` | `Footer.tsx:23-27` | 3 |
| **M4** | Categories **rent-a-car + products không có service nào trong seed** → list page trống | `prisma/seed.ts` (12 services thuộc 8 categories) | 2 |
| **M5** | `RATE_LIMIT` định nghĩa nhưng **không endpoint nào dùng** (dead code) — login có thể spam vô hạn | `src/lib/constants.ts:26` | 4 |
| **M6** | Không có UI review trên trang detail (API GET đã có sẵn) | `api/reviews/route.ts:54-79` | 5 |

### ⚪ LOW / INFO

| Mã | Vấn đề | Gói |
|---|---|---|
| **L1** | `formatPrice` trùng lặp 3+ nơi, mỗi nơi format khác nhau | 5 |
| **L2** | Không có custom 404 (`not-found.tsx`) | 5 |
| **L3** | Trang taxi là CTA landing — **chủ đích** (HANDOFF.md #6), không phải bug | — |

---

## 4. PHÂN CÔNG 5 AGENT — TÊN NHÁNH

Tất cả tạo nhánh từ `Kế-Thừa-Code` @ commit `4f23895`:

| Agent | Nhánh | Nhiệm vụ | Mức ưu tiên |
|---|---|---|---|
| 1 | `fix/booking-service-resolution` | Wizard đọc `?serviceId=` → slug → cuid; **xóa fallback âm thầm** (thay bằng state "Service not found"); giá thật thay 350k cứng | 🔴 CRITICAL — merge trước nhất |
| 2 | `fix/legacy-detail-pages` | Xóa/khử 7 route legacy `[id]` (redirect 301 sang `[category]/[slug]`); seed thêm services cho rent-a-car + products | 🔴 HIGH |
| 3 | `feat/home-page-content` | Popular Services trỏ đúng 4 category + VND; Explore Guides tới bài thật; tạo 3 trang legal (privacy/terms/faq) + cập nhật sitemap | 🟡 MEDIUM |
| 4 | `feat/auth-flows` | 3 API auth thật (register/forgot/reset — model `VerificationToken` + `hashPassword` có sẵn); rate limiting dùng `RATE_LIMIT` đã định nghĩa | 🔴 HIGH |
| 5 | `feat/reviews-and-polish` | Fix API reviews FK; UI ReviewForm/ReviewList trên detail page; `lib/format.ts` dùng chung; custom 404 | 🟡 MEDIUM |

**Hợp đồng URL giữa Gói 1 ↔ Gói 2** (hai gói code song song được):

```
/booking/${service.slug}?serviceId=${service.id}
```

Gói 2 (producer) emit đúng format — Gói 1 (consumer) resolve theo: `serviceId` param (ưu tiên 1) → slug (2) → cuid (3) → **không tìm thấy = hiện lỗi, không fallback**.

**Nguyên tắc phân tách:** 5 gói không giao nhau về file (whitelist trong IMPROVEMENT-PLAN.md §2); chỉ 2 điểm chạm nhỏ đã ghi chú cách xử lý: `prisma/seed.ts` và `e2e/booking-flow.spec.ts`.

---

## 5. THỨ TỰ MERGE + KIỂM THỬ SAU HỢP NHẤT

```
Gói 1 (fix/booking-service-resolution)   ← merge TRƯỚC
   ↓
Gói 2 (fix/legacy-detail-pages)           ← merge thứ 2 (rebase lên Gói 1)
   ↓
Gói 3, 4, 5                               ← độc lập, thứ tự tùy ý
```

Sau khi merge đủ 5 gói, chạy verify toàn cầu trên nhánh gốc:

```bash
npm run test:run                                    # Vitest toàn bộ (110+ tests)
npm run e2e                                          # Playwright E2E toàn bộ
npx tsc --noEmit                                    # Type check
npx playwright test --config=audit/playwright.audit.config.ts   # Chạy lại UI audit
```

**Kỳ vọng sau cải thiện:** UI audit 0 WARN 0 FAIL (WARN "Popular Services" biến mất); E2E booking tour trả về đúng serviceId tour trong DB.

---

## 6. ĐƯỜNG DẪN TẤT CẢ ARTIFACTS

| File | Nội dung |
|---|---|
| `audit/BAO-CAO-TONG-HOP.md` | **Bản tổng hợp này** — đọc một file duy nhất là nắm toàn bộ |
| `audit/AUDIT-REPORT.md` | Báo cáo audit UI & link đầy đủ (kết quả 39 test, nhận xét visual từ screenshot) |
| `audit/IMPROVEMENT-PLAN.md` | Kế hoạch 5 gói chi tiết — TDD từng bước, whitelist file, checklist DoD, prompt copy-paste cho từng agent (§6) |
| `audit/ui-link-audit.spec.ts` | Bộ test audit Playwright (39 test) |
| `audit/playwright.audit.config.ts` | Config riêng cho audit suite |
| `audit/audit-results.json` | Kết quả audit máy đọc được |
| `audit/screenshots/00–22.png` | 23 screenshot full-page (local, gitignored — ~7MB) |

**Chạy lại audit bất cứ lúc nào:**

```bash
npx playwright test --config=audit/playwright.audit.config.ts
```

---

## 7. KẾT LUẬN

Nền tảng MARIVO.vn có chất lượng render, design system và độ phủ test tốt — 23/23 trang load, 38/39 kiểm tra điều hướng PASS. Tuy nhiên, quá trình audit 2 lớp (tự động + soi code) phát hiện **luồng booking đang âm thầm tạo booking sai dịch vụ toàn diện** (C1 — regex thiếu dấu `-` + bỏ qua `serviceId` param), nghiêm trọng hơn mọi phát hiện bề mặt vì hoàn toàn vô hình với cả user lẫn test hiện có.

Kế hoạch 5 gói đã thiết kế để 5 agent chạy song song an toàn (không giao nhau file, có hợp đồng URL chung), với Gói 1 — sửa luồng booking — là chặn đường bắt buộc trước khi bất kỳ khách thật nào đặt dịch vụ.
