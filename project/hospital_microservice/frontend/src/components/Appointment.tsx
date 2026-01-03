import React, { useState } from 'react';

interface AppointmentProps {
  currentUser?: any;
}

const Appointment = ({ currentUser }: AppointmentProps) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5080';
  const [formData, setFormData] = useState({
    appointmentType: 'new',
    doctor: '',
    date: '',
    reason: '',
    phone: currentUser?.phone || ''
  });
  const [doctors, setDoctors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [sequenceNumber, setSequenceNumber] = useState<number | null>(null);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const DOCTOR_API_BASE_URL = import.meta.env.VITE_DOCTOR_API_BASE_URL || `${API_BASE_URL}/doctor`;

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.doctor-select-container')) {
        setShowDoctorDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    let mounted = true;
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${DOCTOR_API_BASE_URL}/doctors`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        // map to display string "Name - Specialty"
        const list = data.map((d: any) => `${d.name}${d.specialty ? ' - ' + d.specialty : ''}`);
        setDoctors(list);
      } catch (e) {
        // ignore silently
        console.error('Failed to fetch doctors list', e);
      }
    };
    fetchDoctors();
    return () => { mounted = false; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/patient/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
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
    if (name === 'doctor') {
      setSearchTerm(value);
      setShowDoctorDropdown(true);
    }
  };

  const filteredDoctors = doctors.filter(doc => 
    doc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectDoctor = (doc: string) => {
    setFormData(prev => ({ ...prev, doctor: doc }));
    setSearchTerm(doc);
    setShowDoctorDropdown(false);
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
              <div className="col-span-2 relative doctor-select-container">
                <label className="block text-sm font-medium text-gray-700 mb-1">Chọn bác sĩ</label>
                <div className="relative">
                  <input
                    type="text"
                    name="doctor"
                    required={formData.appointmentType === 're_exam'}
                    value={formData.doctor}
                    onChange={handleChange}
                    onFocus={() => setShowDoctorDropdown(true)}
                    placeholder="Gõ tên bác sĩ hoặc chọn..."
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-3 pr-10"
                    autoComplete="off"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {showDoctorDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-2xl max-h-60 rounded-xl py-2 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm border border-gray-100">
                    {filteredDoctors.length > 0 ? (
                      filteredDoctors.map((doc, index) => (
                        <div
                          key={index}
                          className="cursor-pointer select-none relative py-3 px-4 hover:bg-blue-50 hover:text-blue-700 text-gray-900 transition-colors duration-150"
                          onClick={() => handleSelectDoctor(doc)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="block truncate font-medium">{doc}</span>
                            {formData.doctor === doc && (
                              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-4 px-4 text-center text-gray-500 italic">
                        Không tìm thấy bác sĩ nào phù hợp
                      </div>
                    )}
                  </div>
                )}
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
