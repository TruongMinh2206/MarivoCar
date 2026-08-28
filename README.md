# 🚗 MARIVO.vn — Phu Quoc Travel & Transportation Platform

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.2-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-green?logo=vitest)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **MARIVO.vn** là nền tảng toàn diện dành cho du lịch và vận chuyển tại Phú Quốc, hỗ trợ đặt xe đưa đón sân bay, thuê xe tự lái/có tài xế, taxi, tour tham quan, vé vui chơi, khách sạn, nhà hàng, spa và cẩm nang du lịch.

---

## 🌟 Tính Năng Nổi Bật

### 1. Dành Cho Khách Hàng (Customer Portal)
- **Trang chủ trực quan**: Tìm kiếm nhanh dịch vụ, danh mục phân loại tiện lợi, dịch vụ nổi bật & đánh giá khách hàng.
- **Hệ thống đặt xe đa dạng**:
  - 🛫 **Đưa đón sân bay (`/airport-transfer`)**: Định tuyến thông minh giữa sân bay Phú Quốc và các khu vực khách sạn/resort.
  - 🚗 **Xe riêng & Thuê xe (`/private-car`, `/rent-a-car`)**: Xe 4-7-16 chỗ, xe máy với biểu phí minh bạch.
  - 🚕 **Taxi Phú Quốc (`/taxi`)**: Đặt chuyến tiện lợi, hỗ trợ lịch trình linh hoạt.
- **Dịch vụ du lịch & trải nghiệm**:
  - 🏝️ **Tour du lịch (`/tours`)**: Tour 4 đảo, cáp treo Hòn Thơm, lặn ngắm san hô.
  - 🎟️ **Vé tham quan (`/tickets`)**: VinWonders, Safari, Grand World, Cáp treo Hòn Thơm.
  - 🏨 **Khách sạn, Nhà hàng & Spa (`/hotels`, `/restaurants`, `/spa`)**.
  - 🛍️ **Đặc sản Phú Quốc (`/products`)**.
  - 📖 **Cẩm nang du lịch (`/guide`)**: Chia sẻ kinh nghiệm và địa điểm hấp dẫn.
- **Quy trình đặt dịch vụ 4 bước chuyên nghiệp (`/booking/[id]`)**:
  - Bước 1: Thông tin chuyến đi (Điểm đón, điểm đến, ngày giờ, số khách, hành lý, số hiệu chuyến bay).
  - Bước 2: Thông tin khách hàng & yêu cầu đặc biệt.
  - Bước 3: Xác nhận thông tin & tính toán chi tiết giá (báo giá tự động, áp mã voucher).
  - Bước 4: Lựa chọn cổng thanh toán & xuất mã đơn hàng `MRVYYMMDD-XXXX`.
- **Cổng thanh toán & E-Voucher**:
  - Trang xử lý kết quả thanh toán (`/payment/success`, `/payment/failed`).
  - Quản lý chuyến đi cá nhân (`/my-bookings`, `/my-bookings/[id]`).
  - Xuất **Voucher điện tử có mã QR** (`/voucher/[id]`) phục vụ check-in nhanh.

### 2. Trang Quản Trị Hệ Thống (Admin Portal - `/admin`)
- 📊 **Dashboard Tổng Quan**: Theo dõi doanh thu, số lượng đơn đặt, tỷ lệ chuyển đổi và biểu đồ trực quan.
- 📋 **Quản Lý Đơn Đặt (Bookings)**: Lọc theo trạng thái, phê duyệt đơn, phân bổ tài xế, quản lý hủy/hoàn tiền.
- 🛠️ **Quản Lý Dịch Vụ (Services & Pricing)**: Quản lý danh mục, cấu hình bảng giá giờ cao điểm/ngày lễ/cuối tuần.
- 👥 **Quản Lý Khách Hàng (Customers)**: Quản lý thông tin và lịch sử sử dụng dịch vụ của người dùng.
- 💳 **Quản Lý Giao Dịch (Payments)**: Đối soát thanh toán, hoàn tiền và lịch sử giao dịch.
- ⭐ **Quản Lý Đánh Giá (Reviews)**: Kiểm duyệt và phản hồi đánh giá của khách hàng.
- ⚙️ **Cài Đặt Hệ Thống (Settings)**: Cấu hình thông tin thương hiệu, thông báo email, API key.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Lớp | Công nghệ | Mô tả |
|---|---|---|
| **Frontend** | [Next.js 15](https://nextjs.org/) (App Router) + [React 19](https://react.dev/) | SSR/SSG tối ưu SEO và hiệu năng cao |
| **Ngôn ngữ** | [TypeScript 5.7](https://www.typescriptlang.org/) | Type-safe toàn diện từ client đến server |
| **Giao diện** | [Tailwind CSS 3.4](https://tailwindcss.com/) + Lucide Icons | Design token tùy biến tông màu Ocean/Sunset |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/) + [Prisma 6.2](https://www.prisma.io/) | Schema chặt chẽ với hơn 25 Models quan hệ |
| **Core Engines** | Custom TypeScript Engines | Price Engine, Availability Engine, Quote Engine, Booking Engine, Payment Engine, Voucher Engine |
| **Xác thực & Bảo mật** | JWT & Cookie-based Session + RBAC | Phân quyền SUPER_ADMIN, ADMIN, STAFF, CUSTOMER |
| **Form & Validation**| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Validate dữ liệu đầu vào chặt chẽ |
| **Testing** | [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) | 91 Unit Tests kiểm thử logic tính giá, booking & API |

---

## 📂 Cấu Trúc Thư Mục (Project Structure)

```text
Mario.vn/
├── prisma/
│   ├── schema.prisma          # Định nghĩa 25+ Database Models & quan hệ
│   └── seed.ts                # Dữ liệu khởi tạo mẫu (Users, Services, Locations, Prices)
├── docs/                      # Tài liệu phân tích kiến trúc & kế hoạch phát triển
├── src/
│   ├── app/
│   │   ├── (main)/            # Các trang giao diện khách hàng (Home, Services, Booking...)
│   │   ├── (transactional)/   # Giao diện giao dịch (Payment Success / Failed)
│   │   ├── admin/             # Giao diện quản trị hệ thống
│   │   ├── api/               # Next.js API Route Handlers (REST endpoints)
│   │   ├── globals.css        # Tailwind Design Tokens & biến CSS
│   │   └── layout.tsx         # Root Layout
│   ├── components/
│   │   ├── ui/                # UI Components tái sử dụng (Button, Input, Card, Badge...)
│   │   ├── layout/            # Header, Footer, Navbar
│   │   ├── service/           # ServiceCard, ServiceFilters, ServiceGallery, ServiceInfo
│   │   ├── booking/           # Stepper, Form đặt xe, Bảng tính giá, Thanh toán
│   │   └── home/              # Hero, Service shortcuts, Danh sách dịch vụ
│   ├── contexts/              # React Context (AuthContext...)
│   ├── hooks/                 # Custom React Hooks (useBooking, useQuote, useServices...)
│   ├── lib/                   # Các Core Engine xử lý logic nghiệp vụ
│   │   ├── __tests__/         # Bộ Unit Test (91 tests)
│   │   ├── price-engine.ts    # Tính giá, phụ phí, giảm giá khứ hồi
│   │   ├── availability-engine.ts # Quản lý sức chứa & khung giờ
│   │   ├── quote-engine.ts    # Khởi tạo và xác thực báo giá tạm
│   │   ├── booking-engine.ts  # Khởi tạo, cập nhật & quản lý đơn đặt
│   │   ├── payment-engine.ts  # Tích hợp cổng thanh toán & Webhook
│   │   ├── voucher-engine.ts  # Quản lý mã giảm giá & QR Code
│   │   ├── notification-engine.ts # Gửi thông báo Email / SMS
│   │   ├── auth.ts            # Xử lý mật khẩu, token và phiên đăng nhập
│   │   └── prisma.ts          # Prisma Client Singleton
│   ├── schemas/               # Zod validation schemas
│   └── types/                 # TypeScript interfaces & types
├── vitest.config.ts           # Cấu hình test runner Vitest
├── tailwind.config.ts         # Cấu hình màu sắc, typography Tailwind
├── tsconfig.json              # Cấu hình TypeScript
└── package.json               # Dependencies & NPM scripts
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án (Getting Started)

### 1. Yêu cầu môi trường
- **Node.js**: Phiên bản `>= 18.18.0` hoặc `20.x`
- **PostgreSQL**: Phiên bản `>= 14`

### 2. Cài đặt các gói phụ thuộc
```bash
git clone https://github.com/TruongMinh2206/MarivoCar.git
cd MarivoCar
npm install
```

### 3. Cấu hình biến môi trường
Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```
Cập nhật thông tin kết nối cơ sở dữ liệu và các cấu hình cần thiết:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/marivo_db?schema=public"
NEXTAUTH_SECRET="your-super-secret-jwt-key"
NEXTAUTH_URL="http://localhost:3000"
APP_URL="http://localhost:3000"
```

### 4. Khởi tạo Cơ sở dữ liệu & Nạp dữ liệu mẫu (Seed Data)
```bash
# Tạo Prisma Client
npx prisma generate

# Đồng bộ schema lên database
npx prisma db push

# Nạp dữ liệu khởi tạo (Users, Danh mục, Địa điểm, Bảng giá, Dịch vụ)
npm run db:seed
```

### 5. Chạy ứng dụng ở môi trường phát triển (Development)
```bash
npm run dev
```
Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

---

## 🔐 Tài Khoản Khởi Tạo Mẫu (Seed Accounts)

| Vai trò | Email | Mật khẩu mặc định | Quyền hạn |
|---|---|---|---|
| **Admin** | `admin@marivo.vn` | `Admin@123456` | Toàn quyền quản trị hệ thống (`SUPER_ADMIN`) |
| **Nhân viên** | `staff@marivo.vn` | `Customer@123456` | Quản lý đơn hàng & hỗ trợ (`STAFF`) |
| **Khách hàng** | `customer@example.com` | `Customer@123456` | Đặt dịch vụ & quản lý chuyến đi (`CUSTOMER`) |

---

## 📡 Danh Sách API Endpoints Chính

| Phương thức | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/services` | Danh sách dịch vụ (có lọc theo danh mục, địa điểm, giá, rating) |
| `GET` | `/api/services/[slug]` | Chi tiết dịch vụ theo đường dẫn slug |
| `GET` | `/api/categories` | Danh sách danh mục dịch vụ |
| `GET` | `/api/locations` | Danh sách địa điểm đón/trả tại Phú Quốc |
| `POST` | `/api/quotes` | Tạo báo giá tạm tính (hạn sử dụng 15-30 phút) |
| `POST` | `/api/bookings` | Tạo đơn đặt dịch vụ từ mã báo giá |
| `GET` | `/api/bookings/[id]` | Tra cứu thông tin đơn đặt (theo ID hoặc mã `MRV...`) |
| `GET` | `/api/my-bookings` | Lấy danh sách chuyến đi của người dùng hiện tại |
| `POST` | `/api/payments` | Khởi tạo giao dịch thanh toán |
| `POST` | `/api/payments/webhook`| Xử lý Webhook xác nhận thanh toán |
| `POST` | `/api/auth/login` | Đăng nhập hệ thống |
| `POST` | `/api/auth/logout` | Đăng xuất |
| `GET` | `/api/auth/me` | Lấy thông tin tài khoản đang đăng nhập |
| `POST` | `/api/contact` | Gửi biểu mẫu liên hệ hỗ trợ |
| `POST` | `/api/reviews` | Gửi đánh giá dịch vụ |

---

## 🧪 Chạy Kiểm Thử (Testing)

```bash
# Kiểm tra lỗi TypeScript
npm run typecheck

# Chạy toàn bộ 91 Unit Tests với Vitest
npm run test:run

# Chạy test và xem báo cáo độ phủ (Coverage)
npm run test:coverage

# Chạy E2E test với Playwright
npm run e2e
```

---

## 📜 Giấy Phép (License)

Dự án được phân phối dưới giấy phép **MIT License**.

---

<div align="center">
  <sub>Phát triển bởi <a href="https://github.com/TruongMinh2206">TruongMinh2206</a> — Nền tảng dịch vụ du lịch hàng đầu Phú Quốc 🌴</sub>
</div>
