import React, { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5080';
const DOCTOR_API_BASE_URL = import.meta.env.VITE_DOCTOR_API_BASE_URL || `${API_BASE_URL}/doctor`;

type PatientItem = {
  id: string;
  username?: string;
  name: string;
  phone?: string;
  dob?: string;
  address?: string;
};

const DoctorPatients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<PatientItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPatients, setTotalPatients] = useState(0);
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);
  const [modalPatientId, setModalPatientId] = useState<string | null>(null);
  const [viewingPatient, setViewingPatient] = useState<PatientItem | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [showHistoryFor, setShowHistoryFor] = useState<string | null>(null);
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({ 
    diagnosis: '', 
    medications: [{ drug_name: '', dosage: '', timing: 'Trước ăn' }], 
    instructions: '', 
    follow_up_date: '' 
  });

  const fetchPatients = useCallback(async (q: string, page: number, limit: number) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const resp = await fetch(`${DOCTOR_API_BASE_URL}/patients/search?query=${encodeURIComponent(q)}&page=${page}&limit=${limit}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (resp.ok) {
        const data = await resp.json();
        setPatients(data.patients.map((p: any) => ({ id: p.id, username: p.username, name: p.name, phone: p.phone, dob: p.dob, address: p.address })));
        setTotalPatients(data.total);
      } else {
        setPatients([]);
        setTotalPatients(0);
      }
    } catch (e) {
      console.error('Search patients failed', e);
      setPatients([]);
      setTotalPatients(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMedicalRecords = async (patient: PatientItem) => {
    setViewingPatient(patient);
    setIsLoadingRecords(true);
    try {
      const token = localStorage.getItem('token');
      const resp = await fetch(`${DOCTOR_API_BASE_URL}/patients/${patient.id}/medical_records`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (resp.ok) {
        const data = await resp.json();
        setMedicalRecords(data);
      } else {
        setMedicalRecords([]);
      }
    } catch (e) {
      console.error('Fetch records failed', e);
      setMedicalRecords([]);
    } finally {
      setIsLoadingRecords(false);
    }
  };

  const handleStartEdit = (record: any) => {
    setEditingRecordId(record.id);
    setCreateForm({
      diagnosis: record.diagnosis,
      medications: record.medications.map((m: any) => ({ ...m })),
      instructions: record.instructions || '',
      follow_up_date: record.follow_up_date || ''
    });
    setModalPatientId(viewingPatient?.id || null);
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!viewingPatient || !window.confirm('Bạn có chắc chắn muốn xóa bệnh án này?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const resp = await fetch(`${DOCTOR_API_BASE_URL}/patients/${viewingPatient.id}/medical_records/${recordId}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (resp.ok) {
        setMedicalRecords(prev => prev.filter(r => r.id !== recordId));
      } else {
        alert('Xóa thất bại');
      }
    } catch (e) {
      console.error(e);
      alert('Lỗi khi xóa bệnh án');
    }
  };

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setCurrentPage(1);
      fetchPatients(searchTerm.trim(), 1, itemsPerPage);
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm, fetchPatients, itemsPerPage]);

  // fetch on page change
  useEffect(() => {
    if (currentPage > 1) {
      fetchPatients(searchTerm.trim(), currentPage, itemsPerPage);
    }
  }, [currentPage, fetchPatients, itemsPerPage]);

  const totalPages = Math.ceil(totalPatients / itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Danh sách bệnh nhân</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder={`Tìm theo tên hoặc SĐT...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {isLoading && (
            <li>
              <div className="px-4 py-4 sm:px-6">Đang tìm kiếm...</div>
            </li>
          )}
          {!isLoading && patients.length === 0 && (
            <li>
              <div className="px-4 py-4 sm:px-6 text-gray-500">
                {searchTerm !== '' ? 'Không tìm thấy bệnh nhân phù hợp.' : 'Chưa có dữ liệu bệnh nhân.'}
              </div>
            </li>
          )}

          {patients.map((patient) => (
            <li key={patient.id} className="group">
                      <div className="px-6 py-5 hover:bg-blue-50/30 transition-all duration-200">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-4">
                            <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{patient.name}</p>
                              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-1 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                  {patient.phone ?? '—'}
                                </div>
                                <div className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {patient.dob ?? '—'}
                                </div>
                                <div className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {patient.address ?? '—'}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuFor(openMenuFor === patient.id ? null : patient.id);
                              }} 
                              className={`p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                openMenuFor === patient.id ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-500'
                              }`}
                              title="Thao tác"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>
                            
                            {openMenuFor === patient.id && (
                              <>
                                {/* Backdrop to close menu when clicking outside */}
                                <div 
                                  className="fixed inset-0 z-10" 
                                  onClick={() => setOpenMenuFor(null)}
                                ></div>
                                
                                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-2xl z-20 py-2 overflow-hidden ring-1 ring-black ring-opacity-5 animate-fade-in animate-zoom-in origin-top-right">
                                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Thao tác nhanh</p>
                                  </div>
                                  
                                  <button 
                                    onClick={() => { fetchMedicalRecords(patient); setOpenMenuFor(null); }} 
                                    className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                                  >
                                    <div className="bg-blue-100 p-2 rounded-lg mr-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                    </div>
                                    <span className="font-medium">Xem bệnh án</span>
                                  </button>
                                  
                                  <button 
                                    onClick={() => { setModalPatientId(patient.id); setOpenMenuFor(null); }} 
                                    className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 group"
                                  >
                                    <div className="bg-green-100 p-2 rounded-lg mr-3 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                      </svg>
                                    </div>
                                    <span className="font-medium">Tạo bệnh án mới</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* modal is rendered at root level */}
                      </div>
            </li>
          ))}
        </ul>

        {/* Pagination Controls */}
        {totalPatients > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Hiển thị</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span>kết quả mỗi trang</span>
              </div>
              <p className="hidden md:block text-sm text-gray-700">
                Hiển thị <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> đến <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalPatients)}</span> trong <span className="font-medium">{totalPatients}</span> bệnh nhân
              </p>
            </div>
            
            {totalPages > 1 && (
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Trước</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === i + 1
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Sau</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            )}
          </div>
        )}
      </div>
      {/* Modal for creating medical record */}
      {modalPatientId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => { setModalPatientId(null); setEditingRecordId(null); }} />
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full z-10 overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900">{editingRecordId ? 'Chỉnh sửa bệnh án' : 'Tạo bệnh án mới'}</h3>
              <button 
                onClick={() => { setModalPatientId(null); setEditingRecordId(null); }} 
                className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">Kết luận bệnh</label>
                <textarea 
                  placeholder="Nhập chẩn đoán và kết luận..." 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 h-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none" 
                  value={createForm.diagnosis} 
                  onChange={(e) => setCreateForm(s=>({...s, diagnosis: e.target.value}))} 
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-semibold text-gray-700">Đơn thuốc</label>
                  <button 
                    onClick={() => setCreateForm(s => ({
                      ...s, 
                      medications: [...s.medications, { drug_name: '', dosage: '', timing: 'Trước ăn' }]
                    }))}
                    className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    title="Thêm thuốc"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {createForm.medications.map((med, idx) => (
                    <div key={idx} className="p-3 border border-gray-100 rounded-xl bg-gray-50/50 space-y-2 relative group">
                      {createForm.medications.length > 1 && (
                        <button 
                          onClick={() => setCreateForm(s => ({
                            ...s, 
                            medications: s.medications.filter((_, i) => i !== idx)
                          }))}
                          className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          placeholder="Tên thuốc" 
                          className="text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:ring-1 focus:ring-blue-500 outline-none"
                          value={med.drug_name}
                          onChange={(e) => {
                            const newMeds = [...createForm.medications];
                            newMeds[idx].drug_name = e.target.value;
                            setCreateForm(s => ({...s, medications: newMeds}));
                          }}
                        />
                        <input 
                          placeholder="Liều lượng (vd: 2 viên/ngày)" 
                          className="text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:ring-1 focus:ring-blue-500 outline-none"
                          value={med.dosage}
                          onChange={(e) => {
                            const newMeds = [...createForm.medications];
                            newMeds[idx].dosage = e.target.value;
                            setCreateForm(s => ({...s, medications: newMeds}));
                          }}
                        />
                      </div>
                      <select 
                        className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                        value={med.timing}
                        onChange={(e) => {
                          const newMeds = [...createForm.medications];
                          newMeds[idx].timing = e.target.value;
                          setCreateForm(s => ({...s, medications: newMeds}));
                        }}
                      >
                        <option value="Trước ăn">Trước ăn</option>
                        <option value="Sau ăn">Sau ăn</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">Dặn dò bệnh nhân</label>
                <textarea 
                  placeholder="Lời khuyên, chế độ ăn uống, sinh hoạt..." 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none" 
                  value={createForm.instructions} 
                  onChange={(e) => setCreateForm(s=>({...s, instructions: e.target.value}))} 
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">Hẹn ngày tái khám</label>
                <div className="relative">
                  <input 
                    type="date" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                    value={createForm.follow_up_date} 
                    onChange={(e) => setCreateForm(s=>({...s, follow_up_date: e.target.value}))} 
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
              <button 
                onClick={() => { setModalPatientId(null); setEditingRecordId(null); }} 
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                Hủy bỏ
              </button>
              <button 
                disabled={creating} 
                onClick={async () => {
                  if (!modalPatientId) return;
                  if (!createForm.diagnosis) {
                    alert('Vui lòng nhập kết luận bệnh');
                    return;
                  }
                  // Check if at least one medication has a name
                  if (createForm.medications.some(m => !m.drug_name)) {
                    alert('Vui lòng nhập tên thuốc cho tất cả các hàng');
                    return;
                  }

                  setCreating(true);
                  try {
                    const doctorInfo = JSON.parse(localStorage.getItem('user') || '{}');
                    const payload = {
                      ...createForm,
                      doctor_name: doctorInfo.name || 'Bác sĩ',
                      doctor_specialty: doctorInfo.specialty || 'Đa khoa'
                    };

                    const url = editingRecordId 
                      ? `${DOCTOR_API_BASE_URL}/patients/${modalPatientId}/medical_records/${editingRecordId}`
                      : `${DOCTOR_API_BASE_URL}/patients/${modalPatientId}/medical_records`;
                    
                    const method = editingRecordId ? 'PUT' : 'POST';
                    const token = localStorage.getItem('token');

                    const resp = await fetch(url, {
                      method: method,
                      headers: { 
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                      },
                      body: JSON.stringify(payload)
                    });
                    if (resp.ok) {
                      setModalPatientId(null);
                      setEditingRecordId(null);
                      setCreateForm({ 
                        diagnosis: '', 
                        medications: [{ drug_name: '', dosage: '', timing: 'Trước ăn' }], 
                        instructions: '', 
                        follow_up_date: '' 
                      });
                      // If we were viewing records, refresh them
                      if (viewingPatient) {
                        fetchMedicalRecords(viewingPatient);
                      }
                    } else {
                      const err = await resp.json().catch(()=>({detail: resp.statusText}));
                      alert((editingRecordId ? 'Cập nhật' : 'Tạo') + ' bệnh án thất bại: ' + (err.detail || resp.statusText));
                    }
                  } catch (e) {
                    console.error(e);
                    alert('Lỗi khi xử lý bệnh án');
                  } finally { setCreating(false); }
                }}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-all shadow-md shadow-blue-200 flex items-center"
              >
                {creating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang lưu...
                  </>
                ) : (editingRecordId ? 'Cập nhật bệnh án' : 'Lưu bệnh án')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for viewing medical records */}
      {viewingPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setViewingPatient(null)} />
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full z-10 overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Lịch sử bệnh án</h3>
                <p className="text-sm text-gray-500">Bệnh nhân: {viewingPatient.name}</p>
              </div>
              <button 
                onClick={() => setViewingPatient(null)} 
                className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {isLoadingRecords ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : medicalRecords.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Chưa có lịch sử bệnh án cho bệnh nhân này.
                </div>
              ) : (
                <div className="space-y-6">
                  {medicalRecords.map((record, idx) => {
                    const isExpanded = expandedRecordId === record.id;
                    const truncate = (text: string, limit: number) => {
                      if (!text || text.length <= limit) return text;
                      return text.substring(0, limit) + '...';
                    };

                    return (
                      <div key={record.id || idx} className="border border-gray-100 rounded-xl p-5 bg-gray-50/30 hover:bg-white hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">Bệnh án ngày {new Date(record.created_at).toLocaleDateString('vi-VN')}</p>
                              <p className="text-xs text-gray-500">{new Date(record.created_at).toLocaleTimeString('vi-VN')}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {record.follow_up_date && (
                              <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                                Tái khám: {record.follow_up_date}
                              </span>
                            )}
                            <div className="flex space-x-1">
                              <button 
                                onClick={() => handleStartEdit(record)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Chỉnh sửa"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => handleDeleteRecord(record.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Xóa"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Chẩn đoán</h4>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                              {isExpanded ? record.diagnosis : truncate(record.diagnosis, 150)}
                            </p>
                          </div>
                          
                          {isExpanded && (
                            <>
                              <div>
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Đơn thuốc</h4>
                                <div className="space-y-2">
                                  {record.medications?.map((m: any, i: number) => (
                                    <div key={i} className="flex items-center text-sm text-gray-700 bg-white p-2 rounded border border-gray-100">
                                      <span className="font-medium text-blue-600 mr-2">{i + 1}.</span>
                                      <span className="flex-1 font-semibold">{m.drug_name}</span>
                                      <span className="mx-2 text-gray-400">|</span>
                                      <span className="text-gray-600">{m.dosage}</span>
                                      <span className="mx-2 text-gray-400">|</span>
                                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{m.timing}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              {record.instructions && (
                                <div>
                                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Dặn dò</h4>
                                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{record.instructions}</p>
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <button 
                            onClick={() => setExpandedRecordId(isExpanded ? null : record.id)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors"
                          >
                            {isExpanded ? 'Thu gọn' : 'Xem chi tiết'}
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {record.edit_history && record.edit_history.length > 0 && (
                            <button 
                              onClick={() => setShowHistoryFor(showHistoryFor === record.id ? null : record.id)}
                              className="text-xs text-gray-500 hover:text-gray-700 font-medium flex items-center transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Lịch sử sửa ({record.edit_history.length})
                            </button>
                          )}
                        </div>
                        
                        {showHistoryFor === record.id && (
                          <div className="mt-3 space-y-3 pl-4 border-l-2 border-blue-100">
                            {record.edit_history.map((hist: any, hIdx: number) => (
                              <div key={hIdx} className="text-xs bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                <p className="text-gray-400 mb-2 flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Đã chỉnh sửa lúc: {new Date(hist.edited_at).toLocaleString('vi-VN')}
                                </p>
                                <div className="space-y-1">
                                  <p><span className="font-semibold text-gray-600">Chẩn đoán cũ:</span> {hist.diagnosis}</p>
                                  <p><span className="font-semibold text-gray-600">Đơn thuốc cũ:</span> {hist.medications.map((m:any)=>m.drug_name).join(', ')}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setViewingPatient(null)} 
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

export default DoctorPatients;
