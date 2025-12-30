import React, { useState, useEffect } from 'react';

const MedicalRecords = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.id) return;

        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const token = localStorage.getItem('token');
        const resp = await fetch(`${API_BASE_URL}/patients/${user.id}/medical_records`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (resp.ok) {
          const data = await resp.json();
          setRecords(data);
        }
      } catch (e) {
        console.error('Failed to fetch medical records', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Hồ sơ bệnh án</h2>
        <p className="mt-2 text-gray-600">Lịch sử khám bệnh, chẩn đoán và đơn thuốc của bạn.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center text-gray-500">
          Bạn chưa có hồ sơ bệnh án nào.
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="w-32 px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Ngày khám
                      </th>
                      <th scope="col" className="w-48 px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Bác sĩ
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Chẩn đoán
                      </th>
                      <th scope="col" className="w-48 px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Đơn thuốc
                      </th>
                      <th scope="col" className="w-48 px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Dặn dò
                      </th>
                      <th scope="col" className="w-40 px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Hẹn tái khám
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {records.map((record) => {
                      const truncate = (text: string, limit: number) => {
                        if (!text || text.length <= limit) return text;
                        return text.substring(0, limit) + '...';
                      };

                      return (
                        <tr 
                          key={record.id} 
                          className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                          onClick={() => setSelectedRecord(record)}
                        >
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                            {new Date(record.created_at).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-5">
                            <div className="text-base font-bold text-gray-900 truncate" title={record.doctor_name}>{record.doctor_name || 'Bác sĩ'}</div>
                            <div className="text-sm text-gray-400 truncate">{record.doctor_specialty || 'Đa khoa'}</div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="text-sm text-gray-900 font-medium truncate break-all" title={record.diagnosis}>{truncate(record.diagnosis, 25)}</div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="space-y-1">
                              {record.medications?.slice(0, 1).map((m: any, i: number) => (
                                <div key={i} className="text-xs text-gray-600 flex items-center">
                                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 flex-shrink-0"></span>
                                  <span className="font-semibold truncate break-all">{m.drug_name}</span>
                                </div>
                              ))}
                              {record.medications?.length > 1 && (
                                <div className="text-[10px] text-blue-500 font-medium">+{record.medications.length - 1} loại thuốc</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-sm text-gray-500">
                            <div className="truncate break-all" title={record.instructions}>{truncate(record.instructions || '—', 30)}</div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-orange-600 font-semibold">
                            {record.follow_up_date ? new Date(record.follow_up_date).toLocaleDateString('vi-VN') : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedRecord(null)} />
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full z-10 overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Chi tiết bệnh án</h3>
                <p className="text-sm text-gray-500">Ngày khám: {new Date(selectedRecord.created_at).toLocaleDateString('vi-VN')}</p>
              </div>
              <button 
                onClick={() => setSelectedRecord(null)} 
                className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Thông tin bác sĩ</h4>
                  <p className="text-lg font-bold text-gray-900">{selectedRecord.doctor_name}</p>
                  <p className="text-sm text-gray-600">{selectedRecord.doctor_specialty}</p>
                </div>
                <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                  <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">Hẹn tái khám</h4>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedRecord.follow_up_date ? new Date(selectedRecord.follow_up_date).toLocaleDateString('vi-VN') : 'Không có hẹn'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                  <span className="w-1 h-4 bg-blue-600 rounded-full mr-2"></span>
                  Chẩn đoán & Kết luận
                </h4>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedRecord.diagnosis}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                  <span className="w-1 h-4 bg-blue-600 rounded-full mr-2"></span>
                  Đơn thuốc chi tiết
                </h4>
                <div className="space-y-2">
                  {selectedRecord.medications?.map((m: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                      <div className="flex items-center">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">{i + 1}</span>
                        <div>
                          <p className="font-bold text-gray-900">{m.drug_name}</p>
                          <p className="text-xs text-gray-500">{m.timing}</p>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {m.dosage}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedRecord.instructions && (
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                    <span className="w-1 h-4 bg-blue-600 rounded-full mr-2"></span>
                    Dặn dò của bác sĩ
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-xl text-gray-700 whitespace-pre-wrap leading-relaxed italic">
                    "{selectedRecord.instructions}"
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setSelectedRecord(null)} 
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
