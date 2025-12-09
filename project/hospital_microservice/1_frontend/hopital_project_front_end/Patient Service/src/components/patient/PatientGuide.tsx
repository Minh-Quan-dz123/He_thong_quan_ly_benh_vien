import React from 'react';

interface PatientGuideProps {
  section: 'process' | 'insurance' | 'payment';
}

const PatientGuide = ({ section }: PatientGuideProps) => {
  const getTitle = () => {
    switch (section) {
      case 'process': return 'Quy trình khám chữa bệnh';
      case 'insurance': return 'Dịch vụ bảo hiểm';
      case 'payment': return 'Thủ tục thanh toán';
      default: return '';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500 mb-8">
          <a href="#" className="hover:text-blue-600">Trang chủ</a>
          <span className="mx-2">›</span>
          <span className="text-gray-900">Hướng dẫn bệnh nhân</span>
          <span className="mx-2">›</span>
          <span className="text-blue-600 font-medium">
            {getTitle()}
          </span>
        </nav>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {section === 'process' && (
            <div className="animate-fadeIn">
              <h1 className="text-3xl font-extrabold text-blue-800 mb-8 border-b pb-4">
                Quy trình khám chữa bệnh
              </h1>
              
              <div className="space-y-8">
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">1</div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold text-gray-900">Đăng ký khám</h3>
                    <p className="mt-2 text-gray-600">
                      Bệnh nhân có thể đăng ký khám trực tiếp tại quầy tiếp đón hoặc đặt lịch hẹn trực tuyến qua website/hotline.
                      Vui lòng mang theo CMND/CCCD và thẻ BHYT (nếu có).
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">2</div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold text-gray-900">Khám bệnh</h3>
                    <p className="mt-2 text-gray-600">
                      Bệnh nhân đến phòng khám chuyên khoa theo hướng dẫn. Bác sĩ sẽ thăm khám lâm sàng và chỉ định các xét nghiệm cần thiết.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">3</div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold text-gray-900">Thực hiện cận lâm sàng</h3>
                    <p className="mt-2 text-gray-600">
                      Thực hiện các xét nghiệm, chụp X-quang, siêu âm... theo chỉ định. Nhận kết quả tại nơi thực hiện hoặc qua ứng dụng.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">4</div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold text-gray-900">Kết luận và tư vấn</h3>
                    <p className="mt-2 text-gray-600">
                      Quay lại phòng khám ban đầu. Bác sĩ đọc kết quả, chẩn đoán bệnh, kê đơn thuốc hoặc chỉ định nhập viện.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">5</div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold text-gray-900">Thanh toán và Lĩnh thuốc</h3>
                    <p className="mt-2 text-gray-600">
                      Thanh toán viện phí tại quầy thu ngân. Lĩnh thuốc tại nhà thuốc bệnh viện (nếu có BHYT) hoặc mua thuốc theo đơn.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {section === 'insurance' && (
            <div className="animate-fadeIn">
              <h1 className="text-3xl font-extrabold text-blue-800 mb-8 border-b pb-4">
                Dịch vụ bảo hiểm
              </h1>
              
              <div className="prose max-w-none text-gray-700">
                <h3 className="text-xl font-bold text-gray-900 mb-4">1. Bảo hiểm Y tế (BHYT) Nhà nước</h3>
                <p className="mb-6">
                  Bệnh viện tiếp nhận khám chữa bệnh BHYT cho tất cả các đối tượng có thẻ BHYT trên toàn quốc. 
                  Quyền lợi được hưởng theo quy định hiện hành của Luật BHYT.
                  <br/>
                  <strong>Lưu ý:</strong> Vui lòng xuất trình thẻ BHYT và giấy tờ tùy thân có ảnh ngay khi đăng ký khám.
                </p>

                <h3 className="text-xl font-bold text-gray-900 mb-4">2. Bảo hiểm bảo lãnh (Bảo hiểm tư nhân)</h3>
                <p className="mb-6">
                  Chúng tôi hợp tác với nhiều công ty bảo hiểm uy tín để cung cấp dịch vụ bảo lãnh viện phí trực tiếp, 
                  giúp khách hàng giảm bớt gánh nặng tài chính và thủ tục hành chính.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  <div className="border rounded-lg p-4 flex items-center justify-center font-semibold text-gray-600 bg-gray-50">Bảo Việt</div>
                  <div className="border rounded-lg p-4 flex items-center justify-center font-semibold text-gray-600 bg-gray-50">PVI</div>
                  <div className="border rounded-lg p-4 flex items-center justify-center font-semibold text-gray-600 bg-gray-50">Manulife</div>
                  <div className="border rounded-lg p-4 flex items-center justify-center font-semibold text-gray-600 bg-gray-50">Prudential</div>
                  <div className="border rounded-lg p-4 flex items-center justify-center font-semibold text-gray-600 bg-gray-50">Dai-ichi Life</div>
                  <div className="border rounded-lg p-4 flex items-center justify-center font-semibold text-gray-600 bg-gray-50">Insmart</div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">3. Quy trình bảo lãnh</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Xuất trình thẻ bảo hiểm và giấy tờ tùy thân tại quầy Bảo hiểm.</li>
                  <li>Bệnh viện kiểm tra thông tin và hạn mức bảo hiểm.</li>
                  <li>Bệnh viện gửi yêu cầu bảo lãnh sang công ty bảo hiểm.</li>
                  <li>Sau khi được xác nhận, khách hàng chỉ cần thanh toán phần chi phí không thuộc phạm vi bảo hiểm (nếu có).</li>
                </ul>
              </div>
            </div>
          )}

          {section === 'payment' && (
            <div className="animate-fadeIn">
              <h1 className="text-3xl font-extrabold text-blue-800 mb-8 border-b pb-4">
                Thủ tục thanh toán
              </h1>
              
              <div className="prose max-w-none text-gray-700">
                <h3 className="text-xl font-bold text-gray-900 mb-4">1. Các hình thức thanh toán</h3>
                <p className="mb-6">
                  Để thuận tiện cho khách hàng, bệnh viện chấp nhận đa dạng các hình thức thanh toán:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-8">
                  <li><strong>Tiền mặt:</strong> Thanh toán trực tiếp tại các quầy thu ngân.</li>
                  <li><strong>Thẻ ngân hàng:</strong> Chấp nhận tất cả các loại thẻ ATM nội địa, Visa, Mastercard, JCB...</li>
                  <li><strong>Chuyển khoản:</strong> Quét mã QR Code tại quầy hoặc chuyển khoản qua ngân hàng.</li>
                  <li><strong>Ví điện tử:</strong> Momo, ZaloPay, VNPay...</li>
                </ul>

                <h3 className="text-xl font-bold text-gray-900 mb-4">2. Quy trình thanh toán</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm mt-1">1</div>
                    <div className="ml-4">
                      <p className="font-semibold text-gray-900">Nhận phiếu chỉ định/đơn thuốc</p>
                      <p className="text-gray-600 text-sm">Sau khi khám, bác sĩ sẽ in phiếu chỉ định cận lâm sàng hoặc đơn thuốc.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm mt-1">2</div>
                    <div className="ml-4">
                      <p className="font-semibold text-gray-900">Đến quầy thu ngân</p>
                      <p className="text-gray-600 text-sm">Nộp phiếu tại quầy thu ngân. Nhân viên sẽ kiểm tra và thông báo số tiền cần thanh toán.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm mt-1">3</div>
                    <div className="ml-4">
                      <p className="font-semibold text-gray-900">Thực hiện thanh toán</p>
                      <p className="text-gray-600 text-sm">Lựa chọn hình thức thanh toán phù hợp và nhận hóa đơn đỏ (nếu cần).</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">3. Xuất hóa đơn GTGT</h3>
                <p className="mb-6">
                  Khách hàng có nhu cầu xuất hóa đơn GTGT vui lòng cung cấp thông tin xuất hóa đơn cho nhân viên thu ngân ngay khi thanh toán.
                  Hóa đơn điện tử sẽ được gửi qua email hoặc tra cứu trên website của bệnh viện.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientGuide;
