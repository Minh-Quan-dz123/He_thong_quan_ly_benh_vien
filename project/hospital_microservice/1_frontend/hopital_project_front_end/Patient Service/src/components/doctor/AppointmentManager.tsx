import React, { useState } from 'react';

// Định nghĩa kiểu dữ liệu cho Lịch hẹn
interface Appointment {
  id: number;
  patientName: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const AppointmentManager = () => {
  // Dữ liệu giả (Mock Data)
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, patientName: 'Lê Thị Mận', date: '2025-12-10', time: '09:00', reason: 'Đau đầu kéo dài', status: 'pending' },
    { id: 2, patientName: 'Trần Văn Xoài', date: '2025-12-10', time: '10:30', reason: 'Tái khám tim mạch', status: 'pending' },
    { id: 3, patientName: 'Phạm Thị Chuối', date: '2025-12-11', time: '14:00', reason: 'Dị ứng phấn hoa', status: 'confirmed' },
  ]);

  // Hàm xử lý Duyệt (Sẽ gọi API Java ở đây)
  const handleApprove = (id: number) => {
    // TODO: Gọi API: axios.post(`/api/appointments/${id}/approve`)
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'confirmed' } : app
    ));
    alert(`Đã duyệt lịch hẹn số #${id}`);
  };

  // Hàm xử lý Hủy (Sẽ gọi API Java ở đây)
  const handleReject = (id: number) => {
    if(!window.confirm("Bạn có chắc chắn muốn hủy lịch này không?")) return;
    
    // TODO: Gọi API: axios.post(`/api/appointments/${id}/reject`)
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'cancelled' } : app
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Quản lý Lịch hẹn</h2>

      <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {appointments.map((app) => (
            <li key={app.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-blue-600">{app.patientName}</h3>
                  <div className="mt-1 text-sm text-gray-500">
                    <span className="mr-4">📅 {app.date}</span>
                    <span>⏰ {app.time}</span>
                  </div>
                  <p className="mt-2 text-gray-700 italic">"Lý do: {app.reason}"</p>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Logic hiển thị trạng thái */}
                  {app.status === 'pending' ? (
                    <>
                      <button 
                        onClick={() => handleApprove(app.id)}
                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Duyệt
                      </button>
                      <button 
                        onClick={() => handleReject(app.id)}
                        className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      app.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {app.status === 'confirmed' ? 'Đã duyệt' : 'Đã hủy'}
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        {appointments.length === 0 && (
          <div className="p-6 text-center text-gray-500">Không có lịch hẹn nào.</div>
        )}
      </div>
    </div>
  );
};

export default AppointmentManager;