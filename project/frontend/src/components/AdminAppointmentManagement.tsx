import { useState, useEffect } from 'react';
import { Search, Calendar, Clock, User, Phone, FileText, X, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5080';
const ADMIN_API_BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL || `${API_BASE_URL}/admin`;

interface Appointment {
  id: string;
  patient_name: string;
  phone: string;
  doctor_name: string;
  date: string;
  time: string;
  status: string;
  returning?: boolean;
  is_return?: boolean;
  type?: string;
  follow_up?: boolean;
  visitType?: string;
  reason?: string;
}

const AdminAppointmentManagement = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${ADMIN_API_BASE_URL}/appointments`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        setError('Không thể tải danh sách lịch hẹn');
        toast.error('Không thể tải danh sách lịch hẹn');
      }
    } catch (err) {
      setError('Lỗi kết nối đến server');
      toast.error('Lỗi kết nối đến server');
    } finally {
      setIsLoading(false);
    }
  };

  // Determine visit type (Khám mới / Tái khám)
  const getVisitType = (app: Appointment) => {
    // Prefer explicit appointmentType from backend
    const at = (app as any).appointmentType || (app as any).appointment_type || '';
    if (at) {
      const a = String(at).toLowerCase();
      if (a === 'new' || a === 'new_visit' || a === 'khám mới') return 'Khám mới';
      return 'Tái khám';
    }

    if (app.returning === true || app.is_return === true) return 'Tái khám';
    const t = (app.type || '').toLowerCase();
    if (t === 'followup' || app.follow_up === true || (app.visitType || '').toLowerCase() === 'tái khám') return 'Tái khám';
    return 'Khám mới';
  };

  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = app.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         app.phone.includes(searchTerm);
    
    // If searching, ignore date filter. If not searching, filter by selected date.
    const matchesDate = searchTerm ? true : app.date === selectedDate;
    
    return matchesSearch && matchesDate;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);

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
            <h2 className="text-xl font-bold text-gray-800">Quản lý Lịch khám</h2>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              {filteredAppointments.length} lịch hẹn
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
            {/* Date Picker */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc SĐT..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">STT</th>
                  <th className="px-6 py-4 font-semibold">Bệnh nhân</th>
                  <th className="px-6 py-4 font-semibold">SĐT</th>
                  <th className="px-6 py-4 font-semibold">Loại khám</th>
                  <th className="px-6 py-4 font-semibold">Giờ khám</th>
                  {/* Status column removed */}
                  <th className="px-6 py-4 font-semibold">Lý do</th>
                  <th className="px-6 py-4 font-semibold text-center">Chi tiết</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.length > 0 ? (
                currentItems.map((app, idx) => (
                  <tr 
                    key={app.id} 
                    className="hover:bg-purple-50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedAppointment(app)}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{indexOfFirstItem + idx + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{app.patient_name}</td>
                    <td className="px-6 py-4 text-gray-600">{app.phone}</td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{getVisitType(app)}</td>
                    <td className="px-6 py-4 text-gray-600">{app.time}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm italic max-w-xs truncate">
                      {app.reason || 'Không có'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-2 text-purple-600 hover:bg-purple-100 rounded-full transition-colors">
                        <Info className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    Không tìm thấy lịch hẹn nào phù hợp
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
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                      ? 'bg-purple-600 text-white' 
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

      {/* Detail Modal */}
      {selectedAppointment && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/30 backdrop-blur-md"
          onClick={() => setSelectedAppointment(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-100 bg-purple-600 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Chi tiết lịch khám</h3>
              <button 
                onClick={() => setSelectedAppointment(null)}
                className="text-white hover:bg-purple-700 p-1 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Bệnh nhân</p>
                    <p className="text-gray-900 font-semibold text-lg">{selectedAppointment.patient_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Số điện thoại</p>
                    <p className="text-gray-900 font-medium">{selectedAppointment.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Ngày khám</p>
                      <p className="text-gray-900 font-medium">{selectedAppointment.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Clock className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Giờ khám</p>
                      <p className="text-gray-900 font-medium">{selectedAppointment.time}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Bác sĩ phụ trách</p>
                    <p className="text-gray-900 font-medium">{selectedAppointment.doctor_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FileText className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Lý do khám</p>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-1 italic">
                      {selectedAppointment.reason || 'Không có thông tin lý do khám.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                {/* Status removed from detail modal */}
                <button 
                  onClick={() => setSelectedAppointment(null)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointmentManagement;
