//import React from 'react';

const WhyChooseUs = () => {
  return (
    <div className="bg-white">
      {/* Section 1: Why Choose Us */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Tại sao nên chọn MediHealth?
          </h2>
          <div className="h-1 w-24 bg-blue-500 mt-4"></div>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-12">
          {/* Left Image */}
          <div className="lg:w-1/3 relative">
            <div className="aspect-w-3 aspect-h-4 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Professional Doctor" 
                className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-100 rounded-full -z-10"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-50 rounded-full -z-10"></div>
          </div>

          {/* Right Content - Grid */}
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            {/* Item 1 */}
            <div className="flex flex-col items-start">
              <div className="p-3 bg-blue-100 rounded-lg mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-3">Chuyên gia hàng đầu</h3>
              <p className="text-gray-600 leading-relaxed">
                MediHealth quy tụ đội ngũ chuyên gia, bác sĩ, dược sĩ và điều dưỡng có trình độ chuyên môn cao, tay nghề giỏi, tận tâm và chuyên nghiệp. Luôn đặt người bệnh làm trung tâm.
              </p>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col items-start">
              <div className="p-3 bg-blue-100 rounded-lg mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-3">Chất lượng quốc tế</h3>
              <p className="text-gray-600 leading-relaxed">
                Hệ thống Y tế MediHealth được quản lý và vận hành dưới sự giám sát của những nhà quản lý y tế giàu kinh nghiệm, đảm bảo cung cấp dịch vụ chăm sóc sức khỏe toàn diện.
              </p>
            </div>

            {/* Item 3 */}
            <div className="flex flex-col items-start">
              <div className="p-3 bg-blue-100 rounded-lg mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-3">Công nghệ tiên tiến</h3>
              <p className="text-gray-600 leading-relaxed">
                MediHealth cung cấp cơ sở vật chất hạng nhất và dịch vụ 5 sao bằng cách sử dụng các công nghệ tiên tiến được quản lý bởi các bác sĩ lâm sàng lành nghề.
              </p>
            </div>

            {/* Item 4 */}
            <div className="flex flex-col items-start">
              <div className="p-3 bg-blue-100 rounded-lg mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-3">Nghiên cứu & Đổi mới</h3>
              <p className="text-gray-600 leading-relaxed">
                MediHealth liên tục thúc đẩy y học hàn lâm dựa trên nghiên cứu có phương pháp và sự phát triển y tế được chia sẻ từ quan hệ đối tác toàn cầu.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Certificates */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-white md:w-1/3">
              <h2 className="text-3xl font-bold mb-6">Chứng nhận và giải thưởng</h2>
              <div className="h-1 w-24 bg-white mb-6"></div>
              <p className="mb-8 text-blue-100 text-lg">
                MediHealth tự hào được các tổ chức uy tín trên thế giới công nhận về chất lượng dịch vụ và chuyên môn.
              </p>
              <a href="#" className="inline-flex items-center font-semibold hover:text-blue-200 transition-colors group">
                Xem thêm 
                <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
            
            <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-6">
              {/* Certificate 1 */}
              <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center h-32 transform hover:-translate-y-1 transition-transform duration-300">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500 mb-1">JCI</div>
                  <div className="text-xs text-gray-500">Chứng nhận quốc tế</div>
                </div>
              </div>
              {/* Certificate 2 */}
              <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center h-32 transform hover:-translate-y-1 transition-transform duration-300">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">ISO</div>
                  <div className="text-xs text-gray-500">9001:2015</div>
                </div>
              </div>
              {/* Certificate 3 */}
              <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center h-32 transform hover:-translate-y-1 transition-transform duration-300">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">TOP 10</div>
                  <div className="text-xs text-gray-500">Bệnh viện tốt nhất</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
