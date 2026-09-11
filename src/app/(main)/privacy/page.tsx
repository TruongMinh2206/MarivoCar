import { Metadata } from "next"
import Link from "next/link"
import { ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Chính sách bảo mật | MARIVO.vn",
  description:
    "Chính sách bảo mật của MARIVO.vn — cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.",
}

const LAST_UPDATED = "Ngày 11 tháng 9 năm 2026"

const SECTIONS = [
  {
    title: "1. Thông tin chúng tôi thu thập",
    body: [
      "Khi bạn sử dụng MARIVO.vn, chúng tôi thu thập các thông tin cần thiết để xử lý đặt chỗ: họ tên, email, số điện thoại và thông tin chuyến đi (điểm đón, điểm đến, ngày giờ, số hành khách).",
      "Chúng tôi cũng ghi nhận nhật ký truy cập (địa chỉ IP, trình duyệt, trang đã xem) nhằm đảm bảo an toàn và cải thiện chất lượng dịch vụ.",
    ],
  },
  {
    title: "2. Mục đích sử dụng thông tin",
    body: [
      "Thông tin của bạn được dùng để: xác nhận và quản lý đặt chỗ, gửi thông báo về chuyến đi, hỗ trợ khách hàng và đề xuất dịch vụ phù hợp.",
      "Chúng tôi không bán thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào.",
    ],
  },
  {
    title: "3. Chia sẻ với bên thứ ba",
    body: [
      "Chỉ khi cần thiết để hoàn tất dịch vụ bạn đã đặt (ví dụ: đơn vị vận chuyển, hướng dẫn viên tour), chúng tôi mới chia sẻ thông tin tối thiểu theo phạm vi công việc.",
      "Các đối tác này được yêu cầu bảo mật thông tin và chỉ sử dụng cho đúng mục đích được giao.",
    ],
  },
  {
    title: "4. Bảo mật dữ liệu",
    body: [
      "Dữ liệu được lưu trữ trên hệ thống có kiểm soát truy cập theo quyền, mã hóa khi truyền tải và sao lưu định kỳ.",
      "Mọi giao dịch thanh toán được xử lý qua cổng thanh toán đạt chuẩn — MARIVO.vn không lưu trữ toàn bộ số thẻ của bạn.",
    ],
  },
  {
    title: "5. Quyền của bạn",
    body: [
      "Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân mà chúng tôi đang lưu trữ.",
      "Để thực hiện quyền của mình, gửi yêu cầu tới info@marivo.vn — chúng tôi phản hồi trong vòng 7 ngày làm việc.",
    ],
  },
  {
    title: "6. Cookie và công nghệ theo dõi",
    body: [
      "Chúng tôi sử dụng cookie để ghi nhớ phiên đăng nhập và phân tích hành vi sử dụng trang.",
      "Bạn có thể tắt cookie trong trình duyệt; một số tính năng có thể không hoạt động đầy đủ.",
    ],
  },
  {
    title: "7. Thay đổi chính sách",
    body: [
      "Khi cập nhật chính sách, chúng tôi công bố phiên bản mới trên trang này kèm ngày hiệu lực.",
      "Việc tiếp tục sử dụng MARIVO.vn sau khi chính sách thay đổi đồng nghĩa bạn chấp nhận phiên bản mới.",
    ],
  },
]

export default function PrivacyPage() {
  return (
    <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-8">
      <nav aria-label="Breadcrumb" className="flex text-xs text-on-surface-variant mb-4">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li><Link href="/" className="hover:text-travel-blue">Trang chủ</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li className="text-primary font-bold">Chính sách bảo mật</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-bold mb-3 flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-travel-blue" />
          Chính sách bảo mật
        </h1>
        <p className="text-body-md font-body-md text-on-surface-variant">
          MARIVO.vn cam kết bảo vệ quyền riêng tư của bạn. Chính sách này giải thích cách chúng tôi
          thu thập, sử dụng và bảo vệ thông tin cá nhân.
        </p>
        <p className="text-label-sm font-label-sm text-on-surface-variant mt-2">
          Cập nhật lần cuối: {LAST_UPDATED}
        </p>
      </div>

      <div className="space-y-6">
        {SECTIONS.map((section) => (
          <article
            key={section.title}
            className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient p-6"
          >
            <h2 className="text-headline-sm font-headline-sm text-primary font-semibold mb-3">
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-body-md font-body-md text-on-surface-variant leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>

      <p className="text-body-md font-body-md text-on-surface-variant mt-8">
        Câu hỏi về chính sách bảo mật? Liên hệ{" "}
        <a href="mailto:info@marivo.vn" className="text-travel-blue hover:underline">
          info@marivo.vn
        </a>
        .
      </p>
    </section>
  )
}
