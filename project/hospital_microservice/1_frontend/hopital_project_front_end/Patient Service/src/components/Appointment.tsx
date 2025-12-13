import React, { useState } from 'react';

interface AppointmentProps {
  currentUser?: any;
}

const Appointment = ({ currentUser }: AppointmentProps) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const [formData, setFormData] = useState({
    appointmentType: 'new',
    doctor: '',
    date: '',
    reason: '',
    phone: currentUser?.phone || ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [sequenceNumber, setSequenceNumber] = useState<number | null>(null);

  const doctors = [
    'Dr. Sarah Wilson - Tim mạch',
    'Dr. James Chen - Thần kinh',
    'Dr. Emily Parker - Nhi khoa'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          patient_id: currentUser?.id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSequenceNumber(data.sequence_number);
        setSubmitted(true);
      } else {
        const errorData = await response.json();
        alert(`Đặt lịch thất bại: ${errorData.detail}`);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Đã xảy ra lỗi khi đặt lịch.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-green-50 rounded-lg p-8 shadow-sm">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đã đặt lịch hẹn!</h2>
          {sequenceNumber && (
            <p className="text-xl font-semibold text-blue-600 mb-4">
              Số thứ tự của bạn là: {sequenceNumber}
            </p>
          )}
          <p className="text-gray-600">
            Cảm ơn bạn đã đặt lịch hẹn. Chúng tôi đã gửi xác nhận đến email của bạn.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-6 text-blue-600 hover:text-blue-500 font-medium"
          >
            Đặt lịch hẹn khác
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-blue-600 px-6 py-8 text-center">
          <h2 className="text-3xl font-bold text-white">Đặt lịch hẹn</h2>
          <p className="mt-2 text-blue-100">Lên lịch khám với các chuyên gia của chúng tôi</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Loại khám</label>
              <div className="flex space-x-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="appointmentType"
                    value="new"
                    checked={formData.appointmentType === 'new'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Khám mới</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="appointmentType"
                    value="re_exam"
                    checked={formData.appointmentType === 're_exam'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Tái khám</span>
                </label>
              </div>
            </div>

            {formData.appointmentType === 're_exam' && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Chọn bác sĩ</label>
                <select
                  name="doctor"
                  required={formData.appointmentType === 're_exam'}
                  value={formData.doctor}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-3"
                >
                  <option value="">Chọn một bác sĩ...</option>
                  {doctors.map((doc, index) => (
                    <option key={index} value={doc}>{doc}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-3"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="+84 123 456 789"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-3"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Lý do khám</label>
              <textarea
                name="reason"
                rows={4}
                required
                placeholder="Vui lòng mô tả triệu chứng hoặc lý do khám..."
                value={formData.reason}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-3"
              ></textarea>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-lg"
            >
              Xác nhận đặt lịch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Appointment;
