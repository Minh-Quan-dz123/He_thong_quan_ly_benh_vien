import React, { useState } from 'react';

const Prescription = () => {
  // State quản lý form
  const [formData, setFormData] = useState({
    patientId: '',
    diagnosis: '',
    medicines: '',
    note: ''
  });

  // Dữ liệu bệnh nhân giả (để chọn trong Dropdown)
  // Thực tế bạn sẽ lấy list này từ API getPatients
  const patients = [
    { id: 1, name: 'Nguyen Van A' },
    { id: 2, name: 'Tran Thi B' },
    { id: 3, name: 'Le Van C' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Gọi API lưu đơn thuốc
    // axios.post('/api/prescriptions', formData)
    console.log("Gửi đơn thuốc:", formData);
    alert("Đã lưu đơn thuốc thành công!");
    
    // Reset form
    setFormData({ patientId: '', diagnosis: '', medicines: '', note: '' });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Kê Đơn Thuốc</h2>
          <p className="text-blue-100 text-sm">Nhập thông tin chẩn đoán và thuốc cho bệnh nhân</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Chọn Bệnh nhân */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chọn Bệnh nhân</label>
            <select
              required
              value={formData.patientId}
              onChange={(e) => setFormData({...formData, patientId: e.target.value})}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">-- Chọn bệnh nhân --</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.id} - {p.name}</option>
              ))}
            </select>
          </div>

          {/* Chẩn đoán */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chẩn đoán bệnh</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Viêm họng cấp..."
              value={formData.diagnosis}
              onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Thuốc & Liều lượng */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đơn thuốc & Liều lượng</label>
            <textarea
              required
              rows={4}
              placeholder="- Panadol 500mg: Sáng 1, Tối 1&#10;- Vitamin C: Sáng 1 viên..."
              value={formData.medicines}
              onChange={(e) => setFormData({...formData, medicines: e.target.value})}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lời dặn của bác sĩ</label>
            <textarea
              rows={2}
              placeholder="Kiêng ăn đồ lạnh, tái khám sau 3 ngày..."
              value={formData.note}
              onChange={(e) => setFormData({...formData, note: e.target.value})}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Lưu Đơn Thuốc
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Prescription;