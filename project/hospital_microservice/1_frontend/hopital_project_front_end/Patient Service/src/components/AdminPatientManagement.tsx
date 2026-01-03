import React, { useState, useEffect } from 'react';
import { Search, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5080';
const ADMIN_API_BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL || `${API_BASE_URL}/admin`;

interface Patient {
  id: string;
  username: string;
  name: string;
  phone: string;
  gender: string;
  dob: string;
  address: string;
}

const AdminPatientManagement = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${ADMIN_API_BASE_URL}/patients`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      } else {
        setError('Không thể tải danh sách bệnh nhân');
      }
    } catch (err) {
      setError('Lỗi kết nối đến server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium text-gray-800">Bạn có chắc chắn muốn xóa bệnh nhân này?</p>
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
                const response = await fetch(`${ADMIN_API_BASE_URL}/patients/${id}`, {
                  method: 'DELETE',
                  headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                if (response.ok) {
                  setPatients(patients.filter(p => p.id !== id));
                  toast.success('Xóa bệnh nhân thành công', { id: loadingToast });
                } else {
                  toast.error('Lỗi khi xóa bệnh nhân', { id: loadingToast });
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

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.phone.includes(searchTerm)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) return <div className="flex justify-center p-10">Đang tải...</div>;
  if (error) return <div className="text-red-500 text-center p-10">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800">Quản lý Bệnh nhân</h2>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {filteredPatients.length} bệnh nhân
            </span>
          </div>
          
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Tên bệnh nhân</th>
                <th className="px-6 py-4 font-semibold">Tên đăng nhập</th>
                <th className="px-6 py-4 font-semibold">Số điện thoại</th>
                <th className="px-6 py-4 font-semibold">Ngày sinh</th>
                <th className="px-6 py-4 font-semibold">Giới tính</th>
                <th className="px-6 py-4 font-semibold">Địa chỉ</th>
                <th className="px-6 py-4 font-semibold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.length > 0 ? (
                currentItems.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{patient.name}</td>
                    <td className="px-6 py-4 text-gray-600">{patient.username}</td>
                    <td className="px-6 py-4 text-gray-600">{patient.phone}</td>
                    <td className="px-6 py-4 text-gray-600">{patient.dob}</td>
                    <td className="px-6 py-4 text-gray-600">{patient.gender}</td>
                    <td className="px-6 py-4 text-gray-600 truncate max-w-xs">{patient.address}</td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleDelete(patient.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Xóa bệnh nhân"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    Không tìm thấy bệnh nhân nào phù hợp
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
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      ? 'bg-blue-600 text-white' 
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
    </div>
  );
};

export default AdminPatientManagement;
