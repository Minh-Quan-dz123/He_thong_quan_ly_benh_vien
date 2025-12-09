import React, { useState, useEffect, useRef } from 'react';
import { Search, Trash2, Filter, ChevronLeft, ChevronRight, UserPlus, Upload, FileSpreadsheet, X, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5080';
const ADMIN_API_BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL || `${API_BASE_URL}/admin`;

interface Doctor {
  id: string;
  username: string;
  name: string;
  phone: string;
  specialty: string;
  gender: string;
}

const AdminDoctorManagement = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Nội Tim Mạch');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Registration Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState<'single' | 'bulk'>('single');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    dob: '',
    gender: 'Nam',
    phone: '',
    documentType: 'CCCD (VN)',
    documentNumber: '',
    address: '',
    specialty: 'Nội Tim Mạch'
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${ADMIN_API_BASE_URL}/doctors`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      } else {
        setError('Không thể tải danh sách bác sĩ');
      }
    } catch (err) {
      setError('Lỗi kết nối đến server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSingleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setIsSubmitting(true);
      const { confirmPassword, ...submitData } = formData;
      const token = localStorage.getItem('token');
      const response = await fetch(`${ADMIN_API_BASE_URL}/doctors/register`, {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: `Bearer ${token}` } : {}),
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        toast.success('Đăng ký bác sĩ thành công');
        setShowAddModal(false);
        fetchDoctors();
        setFormData({
          username: '', password: '', confirmPassword: '', name: '',
          dob: '', gender: 'Nam', phone: '', documentType: 'CCCD (VN)',
          documentNumber: '', address: '', specialty: 'Nội Tim Mạch'
        });
      } else {
        const data = await response.json();
        toast.error(data.detail || 'Lỗi khi đăng ký');
      }
    } catch (err) {
      toast.error('Lỗi kết nối đến server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkRegister = async () => {
    if (!uploadFile) {
      toast.error('Vui lòng chọn file Excel');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${ADMIN_API_BASE_URL}/doctors/bulk-register`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        if (data.errors && data.errors.length > 0) {
          console.error('Bulk register errors:', data.errors);
          toast.error(`Có ${data.errors.length} lỗi xảy ra. Kiểm tra console để biết chi tiết.`);
        }
        setShowAddModal(false);
        setUploadFile(null);
        fetchDoctors();
      } else {
        toast.error(data.detail || 'Lỗi khi tải file');
      }
    } catch (err) {
      toast.error('Lỗi kết nối đến server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium text-gray-800">Bạn có chắc chắn muốn xóa bác sĩ này?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading('Đang xóa...');
              try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${ADMIN_API_BASE_URL}/doctors/${id}`, {
                  method: 'DELETE',
                  headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                if (response.ok) {
                  setDoctors(doctors.filter(d => d.id !== id));
                  toast.success('Xóa bác sĩ thành công', { id: loadingToast });
                } else {
                  toast.error('Lỗi khi xóa bác sĩ', { id: loadingToast });
                }
              } catch (err) {
                toast.error('Lỗi kết nối đến server', { id: loadingToast });
              }
            }}
            className="px-3 py-1 text-sm bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors"
          >
            Xác nhận xóa
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
      style: {
        minWidth: '350px',
        padding: '16px',
      }
    });
  };

  // Get unique specialties for the dropdown
  const specialties = Array.from(new Set(doctors.map(d => d.specialty).filter(Boolean)));
  if (!specialties.includes('Nội Tim Mạch')) specialties.unshift('Nội Tim Mạch');
  if (!specialties.includes('Tất cả')) specialties.push('Tất cả');

  const filteredDoctors = doctors.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         d.phone.includes(searchTerm);
    const matchesSpecialty = selectedSpecialty === 'Tất cả' || d.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDoctors.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) return <div className="flex justify-center p-10">Đang tải...</div>;
  if (error) return <div className="text-red-500 text-center p-10">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800">Quản lý Bác sĩ</h2>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
              {filteredDoctors.length} bác sĩ
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
            {/* Specialty Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none transition-all"
                value={selectedSpecialty}
                onChange={(e) => {
                  setSelectedSpecialty(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {specialties.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc SĐT..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <UserPlus className="w-5 h-5" />
              <span className="font-medium">Thêm bác sĩ</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="bg-indigo-50 px-6 py-3 border-y border-indigo-100">
            <h3 className="text-indigo-800 font-bold flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
              Khoa: {selectedSpecialty}
            </h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-[11px] uppercase tracking-widest">
                <th className="px-6 py-3 font-bold">Tên bác sĩ</th>
                <th className="px-6 py-3 font-bold">Tên đăng nhập</th>
                {selectedSpecialty === 'Tất cả' && <th className="px-6 py-3 font-bold">Chuyên khoa</th>}
                <th className="px-6 py-3 font-bold">Số điện thoại</th>
                <th className="px-6 py-3 font-bold">Giới tính</th>
                <th className="px-6 py-3 font-bold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.length > 0 ? (
                currentItems.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{doctor.name}</td>
                    <td className="px-6 py-4 text-gray-600">{doctor.username}</td>
                    {selectedSpecialty === 'Tất cả' && (
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md text-xs font-semibold border border-indigo-100">
                          {doctor.specialty}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 text-gray-600">{doctor.phone}</td>
                    <td className="px-6 py-4 text-gray-600">{doctor.gender}</td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleDelete(doctor.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Xóa bác sĩ"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={selectedSpecialty === 'Tất cả' ? 6 : 5} className="px-6 py-10 text-center text-gray-500">
                    Không tìm thấy bác sĩ nào phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination UI */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Hiển thị</span>
            <select 
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>mỗi trang</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-indigo-600" />
                Đăng ký Bác sĩ mới
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setAddMode('single')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  addMode === 'single' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Đăng ký đơn
              </button>
              <button
                onClick={() => setAddMode('bulk')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  addMode === 'bulk' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Đăng ký hàng loạt (Excel)
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {addMode === 'single' ? (
                <form onSubmit={handleSingleRegister} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Tên đăng nhập</label>
                      <input
                        required
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Họ và tên</label>
                      <input
                        required
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
                      <input
                        required
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                      <input
                        required
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Ngày sinh</label>
                      <input
                        required
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.dob}
                        onChange={(e) => setFormData({...formData, dob: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Giới tính</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                      <input
                        required
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Chuyên khoa</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.specialty}
                        onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                      >
                        <option value="Nội Tim Mạch">Nội Tim Mạch</option>
                        <option value="Ngoại thần kinh">Ngoại thần kinh</option>
                        <option value="Sản phụ khoa">Sản phụ khoa</option>
                        <option value="Nhi khoa">Nhi khoa</option>
                        <option value="Mắt">Mắt</option>
                        <option value="Răng Hàm Mặt">Răng Hàm Mặt</option>
                        <option value="Da liễu">Da liễu</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Loại định danh</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.documentType}
                        onChange={(e) => setFormData({...formData, documentType: e.target.value})}
                      >
                        <option value="CCCD (VN)">CCCD (VN)</option>
                        <option value="Hộ chiếu">Hộ chiếu</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Số định danh</label>
                      <input
                        required
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.documentNumber}
                        onChange={(e) => setFormData({...formData, documentNumber: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Địa chỉ</label>
                    <textarea
                      required
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? 'Đang xử lý...' : 'Đăng ký ngay'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                    <AlertCircle className="w-6 h-6 text-blue-600 shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-bold mb-1">Hướng dẫn:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>File Excel phải có các cột: <code className="bg-blue-100 px-1 rounded">username</code>, <code className="bg-blue-100 px-1 rounded">password</code>, <code className="bg-blue-100 px-1 rounded">name</code>, <code className="bg-blue-100 px-1 rounded">dob</code>, <code className="bg-blue-100 px-1 rounded">gender</code>, <code className="bg-blue-100 px-1 rounded">phone</code>, <code className="bg-blue-100 px-1 rounded">id_type</code>, <code className="bg-blue-100 px-1 rounded">id_number</code>, <code className="bg-blue-100 px-1 rounded">address</code>, <code className="bg-blue-100 px-1 rounded">specialty</code>.</li>
                        <li>Định dạng ngày sinh: <code className="bg-blue-100 px-1 rounded">YYYY-MM-DD</code>.</li>
                      </ul>
                    </div>
                  </div>

                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
                      uploadFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                    }`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept=".xlsx, .xls"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    />
                    {uploadFile ? (
                      <>
                        <FileSpreadsheet className="w-16 h-16 text-green-600" />
                        <div className="text-center">
                          <p className="font-medium text-green-800">{uploadFile.name}</p>
                          <p className="text-sm text-green-600">{(uploadFile.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadFile(null);
                          }}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Chọn file khác
                        </button>
                      </>
                    ) : (
                      <>
                        <Upload className="w-16 h-16 text-gray-400" />
                        <div className="text-center">
                          <p className="font-medium text-gray-700">Kéo thả hoặc click để chọn file Excel</p>
                          <p className="text-sm text-gray-500">Hỗ trợ .xlsx, .xls</p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleBulkRegister}
                      disabled={!uploadFile || isSubmitting}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? 'Đang xử lý...' : 'Tải lên và Đăng ký'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctorManagement;
