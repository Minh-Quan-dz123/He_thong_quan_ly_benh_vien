import React from 'react';

const MedicalRecords = () => {
  // Mock medical records data
  const records = [
    {
      id: 1,
      date: '2023-10-15',
      doctor: 'Dr. Sarah Wilson',
      specialty: 'Tim mạch',
      diagnosis: 'Tăng huyết áp nhẹ',
      prescription: 'Lisinopril 10mg',
      notes: 'Bệnh nhân được khuyên giảm lượng muối và tập thể dục thường xuyên.'
    },
    {
      id: 2,
      date: '2023-08-20',
      doctor: 'Dr. Emily Parker',
      specialty: 'Đa khoa',
      diagnosis: 'Cúm mùa',
      prescription: 'Ibuprofen, Nghỉ ngơi, Uống nhiều nước',
      notes: 'Tái khám sau 3 ngày nếu triệu chứng kéo dài.'
    },
    {
      id: 3,
      date: '2023-05-10',
      doctor: 'Dr. James Chen',
      specialty: 'Thần kinh',
      diagnosis: 'Đau nửa đầu',
      prescription: 'Sumatriptan 50mg',
      notes: 'Khuyên dùng nhật ký xác định nguyên nhân.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Hồ sơ bệnh án</h2>
        <p className="mt-2 text-gray-600">Lịch sử khám bệnh, chẩn đoán và đơn thuốc của bạn.</p>
      </div>

      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày khám
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bác sĩ
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chẩn đoán
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đơn thuốc
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ghi chú
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{record.doctor}</div>
                        <div className="text-sm text-gray-500">{record.specialty}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {record.diagnosis}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.prescription}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {record.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
