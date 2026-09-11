import { Metadata } from "next"
import Link from "next/link"
import { FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Điều khoản dịch vụ | MARIVO.vn",
  description:
    "Điều khoản dịch vụ của MARIVO.vn — quy định về đặt chỗ, thanh toán, hủy chuyến và trách nhiệm của các bên.",
}

const LAST_UPDATED = "Ngày 11 tháng 9 năm 2026"

const SECTIONS = [
  {
    title: "1. Chấp nhận điều khoản",
    body: [
      "Khi truy cập và đặt dịch vụ trên MARIVO.vn, bạn đồng ý tuân thủ các điều khoản trong văn bản này.",
      "Nếu không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ của chúng tôi.",
    ],
  },
  {
    title: "2. Đặt chỗ và xác nhận",
    body: [
      "Đơn đặt chỗ được coi là hoàn tất khi bạn nhận được mã đặt chỗ (booking code) qua email.",
      "Thông tin chuyến đi do bạn cung cấp phải chính xác; MARIVO.vn không chịu trách nhiệm cho sai sót phát sinh từ thông tin sai.",
    ],
  },
  {
    title: "3. Giá cả và thanh toán",
    body: [
      "Mọi giá hiển thị trên MARIVO.vn là VND, đã bao gồm phí dịch vụ cơ bản và được cập nhật theo thời gian thực.",
      "Thanh toán được thực hiện qua các cổng thanh toán được hỗ trợ. Đơn đặt chỗ chỉ được xác nhận sau khi giao dịch thành công.",
    ],
  },
  {
    title: "4. Chính sách hủy và hoàn tiền",
    body: [
      "Hủy trước 24 giờ so với giờ khởi hành: hoàn 100% giá trị đơn.",
      "Hủy trong vòng 24 giờ hoặc không đến (no-show): không hoàn tiền, trừ trường hợp bất khả kháng có chứng minh.",
    ],
  },
  {
    title: "5. Trách nhiệm của khách hàng",
    body: [
      "Bạn có trách nhiệm có mặt đúng giờ, đúng điểm đón và tuân thủ hướng dẫn của nhân viên phục vụ.",
      "Hành khách chịu trách nhiệm với tài sản cá nhân của mình trong suốt chuyến đi.",
    ],
  },
  {
    title: "6. Giới hạn trách nhiệm",
    body: [
      "MARIVO.vn đóng vai trò nền tảng kết nối giữa khách hàng và nhà cung cấp dịch vụ địa phương.",
      "Với các sự kiện ngoài tầm kiểm soát (thời tiết, thiên tai, quyết định của cơ quan chức năng), chúng tôi sẽ hỗ trợ đổi lịch hoặc hoàn tiền theo khả năng nhưng không bồi thường thiệt hại gián tiếp.",
    ],
  },
  {
    title: "7. Điều khoản chung",
    body: [
      "MARIVO.vn có quyền cập nhật điều khoản dịch vụ; phiên bản mới có hiệu lực ngay khi được công bố trên trang này.",
      "Mọi tranh chấp sẽ được giải quyết trước hết qua thương lượng; nếu không đạt được thỏa thuận, việc giải quyết tuân theo pháp luật Việt Nam.",
    ],
  },
]

export default function TermsPage() {
  return (
    <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-8">
      <nav aria-label="Breadcrumb" className="flex text-xs text-on-surface-variant mb-4">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li><Link href="/" className="hover:text-travel-blue">Trang chủ</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li className="text-primary font-bold">Điều khoản dịch vụ</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-bold mb-3 flex items-center gap-3">
          <FileText className="h-8 w-8 text-travel-blue" />
          Điều khoản dịch vụ
        </h1>
        <p className="text-body-md font-body-md text-on-surface-variant">
          Các điều khoản dưới đây quy định mối quan hệ giữa bạn và MARIVO.vn khi sử dụng nền tảng
          đặt dịch vụ du lịch Phú Quốc.
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
        Thắc mắc về điều khoản? Liên hệ{" "}
        <a href="mailto:info@marivo.vn" className="text-travel-blue hover:underline">
          info@marivo.vn
        </a>
        .
      </p>
    </section>
  )
}
