import React from 'react';

const DoctorDashboard = () => {
  // Dữ liệu giả (Sau này thay bằng API lấy thống kê từ Java)
  const stats = [
    { title: 'Lịch hẹn hôm nay', value: '8', color: 'bg-blue-100 text-blue-800' },
    { title: 'Bệnh nhân chờ duyệt', value: '3', color: 'bg-yellow-100 text-yellow-800' },
    { title: 'Tổng bệnh nhân', value: '1,240', color: 'bg-green-100 text-green-800' },
    { title: 'Ca phẫu thuật tuần này', value: '2', color: 'bg-purple-100 text-purple-800' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Tổng quan công việc</h2>
        <p className="mt-2 text-gray-600">Xin chào Bác sĩ, đây là tóm tắt hoạt động trong ngày của bạn.</p>
      </div>

      {/* Thống kê Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{item.title}</h3>
            <div className={`mt-4 inline-flex items-baseline px-3 py-1 rounded-full text-2xl font-semibold ${item.color}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Phần thông báo nhanh (Ví dụ) */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Thông báo mới</h3>
        <ul className="space-y-4">
          <li className="flex items-start">
            <span className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-blue-500"></span>
            <p className="ml-3 text-gray-600">Hệ thống sẽ bảo trì vào lúc 22:00 tối nay.</p>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-green-500"></span>
            <p className="ml-3 text-gray-600">Bệnh nhân <b>Nguyễn Văn A</b> đã có kết quả xét nghiệm máu.</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DoctorDashboard;