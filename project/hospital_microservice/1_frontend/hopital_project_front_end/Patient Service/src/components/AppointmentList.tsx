import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface Appointment {
  id: string;
  appointmentType: string;
  doctor: string;
  date: string;
  reason: string;
  phone: string;
  sequence_number?: number;
  status?: string;
}

interface AppointmentListProps {
  currentUser?: any;
  showToastMsg?: (title: string, message: string, type: 'success' | 'error') => void;
}

const AppointmentList = ({ currentUser, showToastMsg }: AppointmentListProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAppointments = async () => {
      console.log("Current User:", currentUser);
      if (!currentUser?.id) {
        console.log("No user ID found");
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching appointments for patient ID: ${currentUser.id}`);
        const response = await fetch(`${API_BASE_URL}/appointments/patient/${currentUser.id}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched appointments:", data);
          // Sort by date descending (newest first)
          const sortedData = data.sort((a: Appointment, b: Appointment) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
          setAppointments(sortedData);
        } else {
            console.error("Response not OK:", response.status);
            setError("Không thể tải danh sách lịch khám.");
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Không thể tải danh sách lịch khám.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [currentUser]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = appointments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleCancel = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setDeleteConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedAppointmentId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${selectedAppointmentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAppointments(prev => prev.filter(appt => appt.id !== selectedAppointmentId));
        if (showToastMsg) {
          showToastMsg("Thành công", "Đã hủy lịch khám thành công.", 'success');
        } else {
          alert("Đã hủy lịch khám thành công.");
        }
      } else {
        if (showToastMsg) {
          showToastMsg("Lỗi", "Không thể hủy lịch khám. Vui lòng thử lại.", 'error');
        } else {
          alert("Không thể hủy lịch khám. Vui lòng thử lại.");
        }
      }
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      if (showToastMsg) {
        showToastMsg("Lỗi", "Đã xảy ra lỗi khi hủy lịch khám.", 'error');
      } else {
        alert("Đã xảy ra lỗi khi hủy lịch khám.");
      }
    } finally {
      setDeleteConfirmationOpen(false);
      setSelectedAppointmentId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Vui lòng đăng nhập</h2>
        <p className="text-gray-600 mb-8">Bạn cần đăng nhập để xem lịch sử khám bệnh.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lịch khám của tôi</h1>
          <p className="mt-2 text-gray-600">Danh sách các cuộc hẹn đã đặt</p>
        </div>
        <Link 
          to="/appointment" 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Đặt lịch mới
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Chưa có lịch khám nào</h3>
          <p className="mt-2 text-gray-500">Bạn chưa đặt lịch khám nào. Hãy đặt lịch ngay để được chăm sóc sức khỏe tốt nhất.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {currentItems.map((appointment) => (
              <li key={appointment.id} className="hover:bg-gray-50 transition-colors duration-200">
                <div className="px-6 py-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                          <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {appointment.date}
                        </h3>
                        <p className="text-sm font-medium text-gray-500 mt-1">
                          {appointment.appointmentType === 'new' ? 'Khám mới' : 'Tái khám'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        {appointment.sequence_number && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                                STT: {appointment.sequence_number}
                            </span>
                        )}
                        <button
                            onClick={() => handleCancel(appointment.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200 focus:outline-none"
                            title="Hủy lịch"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Bác sĩ phụ trách</dt>
                      <dd className="mt-1 text-sm font-medium text-gray-900">{appointment.doctor}</dd>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lý do khám</dt>
                      <dd className="mt-1 text-sm text-gray-900">{appointment.reason}</dd>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pagination */}
      {appointments.length > itemsPerPage && (
        <div className="flex justify-center mt-8">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  currentPage === number
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      )}

      <Dialog
        open={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Xác nhận hủy lịch khám"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn hủy lịch khám này không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmationOpen(false)} color="primary">
            Hủy bỏ
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Đồng ý hủy
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AppointmentList;
