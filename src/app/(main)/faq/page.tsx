import { Metadata } from "next"
import Link from "next/link"
import { HelpCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Câu hỏi thường gặp | MARIVO.vn",
  description:
    "Câu hỏi thường gặp về đặt dịch vụ trên MARIVO.vn — đặt chuyến, thanh toán, hủy/đổi lịch và hỗ trợ tại Phú Quốc.",
}

const FAQS = [
  {
    question: "Làm thế nào để đặt dịch vụ trên MARIVO.vn?",
    answer:
      "Chọn loại dịch vụ (transfer, tour, vé tham quan…), điền thông tin chuyến đi, sau đó hoàn tất thanh toán. Mã đặt chỗ sẽ được gửi tới email của bạn ngay sau khi giao dịch thành công.",
  },
  {
    question: "Tôi có cần tạo tài khoản để đặt dịch vụ không?",
    answer:
      "Không bắt buộc. Bạn có thể đặt dịch vụ với tư cách khách (guest checkout) — chỉ cần email để nhận xác nhận và tra cứu đơn sau này qua trang Tra cứu đặt chỗ.",
  },
  {
    question: "Các phương thức thanh toán nào được hỗ trợ?",
    answer:
      "Chúng tôi hỗ trợ thẻ VISA/Mastercard và ví điện tử nội địa qua VNPAY. Tất cả giao dịch được xử lý qua cổng thanh toán an toàn.",
  },
  {
    question: "Tôi có thể hủy hoặc đổi lịch chuyến đi không?",
    answer:
      "Có. Hủy trước 24 giờ so với giờ khởi hành được hoàn 100% giá trị đơn. Trong vòng 24 giờ, phí hủy có thể áp dụng — xem chi tiết trong Điều khoản dịch vụ.",
  },
  {
    question: "Sau khi hạ cánh, tôi gặp tài xế ở đâu?",
    answer:
      "Tài xế sẽ chờ bạn tại sảnh arrival với biển tên in mã đặt chỗ. Nếu không tìm thấy, hãy gọi hotline +84 297 399 9999 — đội hỗ trợ hoạt động 24/7.",
  },
  {
    question: "Giá hiển thị đã bao gồm mọi phí chưa?",
    answer:
      "Giá trên MARIVO.vn là giá VND cuối cùng cho dịch vụ được chọn, đã gồm phí phục vụ cơ bản. Phí phát sinh thêm (vé tham quan ngoài itinerary, phụ phí đêm khuya tại chỗ) sẽ được báo trước.",
  },
  {
    question: "Trẻ em đi kèm được tính thế nào?",
    answer:
      "Trẻ em dưới 5 tuổi được miễn phí khi đi cùng người lớn (không chiếm ghế riêng). Trẻ từ 5 tuổi trở lên tính như người lớn với một số tour có mức giá trẻ em riêng.",
  },
  {
    question: "Tôi cần hỗ trợ gấp trong chuyến đi, liên hệ ai?",
    answer:
      "Gọi hotline 24/7: +84 297 399 9999 hoặc email info@marivo.vn. Với sự cố an toàn, hãy liên hệ trước hết với nhà cung cấp dịch vụ tại chỗ theo số trong xác nhận đặt chỗ.",
  },
]

export default function FaqPage() {
  return (
    <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-8">
      <nav aria-label="Breadcrumb" className="flex text-xs text-on-surface-variant mb-4">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li><Link href="/" className="hover:text-travel-blue">Trang chủ</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li className="text-primary font-bold">Câu hỏi thường gặp</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-bold mb-3 flex items-center gap-3">
          <HelpCircle className="h-8 w-8 text-travel-blue" />
          Câu hỏi thường gặp
        </h1>
        <p className="text-body-md font-body-md text-on-surface-variant">
          Tổng hợp các câu hỏi khách hàng thường gặp khi đặt dịch vụ du lịch Phú Quốc trên
          MARIVO.vn.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq) => (
          <details
            key={faq.question}
            className="group bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 text-headline-sm font-headline-sm text-on-surface font-semibold list-none">
              {faq.question}
              <span className="text-travel-blue text-2xl font-bold group-open:rotate-45 transition-transform">
                +
              </span>
            </summary>
            <p className="px-6 pb-6 text-body-md font-body-md text-on-surface-variant leading-relaxed">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>

      <p className="text-body-md font-body-md text-on-surface-variant mt-8">
        Không tìm thấy câu trả lời? Liên hệ{" "}
        <a href="mailto:info@marivo.vn" className="text-travel-blue hover:underline">
          info@marivo.vn
        </a>{" "}
        hoặc ghé trang{" "}
        <Link href="/contact" className="text-travel-blue hover:underline">
          Liên hệ
        </Link>
        .
      </p>
    </section>
  )
}
