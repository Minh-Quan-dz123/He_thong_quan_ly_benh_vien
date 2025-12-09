import { useState, useRef, useEffect } from 'react';
import { specialtiesData } from "../../components/patient/Specialties"; // Nhớ check đường dẫn import

interface NavbarProps {
  onSignInClick: () => void;
  isLoggedIn: boolean;
  username?: string;
  role?: 'patient' | 'doctor' | null;
  onLogout: () => void;
  onProfileClick: () => void;
  onMedicalRecordsClick: () => void;
  onHomeClick: () => void;
  onNewsClick: () => void;
  onAppointmentClick: () => void;
  onPatientsClick: () => void;
  onSpecialtyClick: (id: string) => void;
  onGuideClick: (section: 'process' | 'insurance' | 'payment') => void;
  
  // Hàm của bác sĩ
  onDoctorDashboardClick?: () => void;
  onDoctorAppointmentsClick?: () => void;
  onDoctorPrescriptionClick?: () => void;
}

const Navbar = ({ 
  onSignInClick, isLoggedIn, username, role, onLogout, 
  onProfileClick, onMedicalRecordsClick, onHomeClick, onNewsClick, 
  onAppointmentClick, onPatientsClick, onSpecialtyClick, onGuideClick,
  onDoctorDashboardClick, onDoctorAppointmentsClick, onDoctorPrescriptionClick
}: NavbarProps) => {
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSpecialtyDropdownOpen, setIsSpecialtyDropdownOpen] = useState(false);
  const [isGuideDropdownOpen, setIsGuideDropdownOpen] = useState(false);
  const [isDoctorDropdownOpen, setIsDoctorDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const specialtyDropdownRef = useRef<HTMLDivElement>(null);
  const guideDropdownRef = useRef<HTMLDivElement>(null);
  const doctorDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
      if (specialtyDropdownRef.current && !specialtyDropdownRef.current.contains(event.target as Node)) setIsSpecialtyDropdownOpen(false);
      if (guideDropdownRef.current && !guideDropdownRef.current.contains(event.target as Node)) setIsGuideDropdownOpen(false);
      if (doctorDropdownRef.current && !doctorDropdownRef.current.contains(event.target as Node)) setIsDoctorDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md fixed w-full z-40 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="#" onClick={(e) => { e.preventDefault(); onHomeClick(); }} className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">MediHealth</span>
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={onHomeClick} className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Trang chủ</button>
            
            {/* --- CÁC MENU CHUNG (HIỆN CHO CẢ 2) --- */}
            
            {/* Dropdown Chuyên khoa */}
            <div className="relative" ref={specialtyDropdownRef}>
              <button onClick={() => setIsSpecialtyDropdownOpen(!isSpecialtyDropdownOpen)} className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium flex items-center">
                Chuyên khoa <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {isSpecialtyDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                   <div className="grid grid-cols-1 gap-1 p-2">
                     {specialtiesData.map((s) => (
                       <button key={s.id} onClick={() => { setIsSpecialtyDropdownOpen(false); onSpecialtyClick(s.id); }} className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg">{s.name}</button>
                     ))}
                   </div>
                </div>
              )}
            </div>

            {/* Dropdown Hướng dẫn */}
            <div className="relative" ref={guideDropdownRef}>
              <button onClick={() => setIsGuideDropdownOpen(!isGuideDropdownOpen)} className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium flex items-center">
                Hướng dẫn <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {isGuideDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="grid grid-cols-1 gap-1 p-2">
                    <button onClick={() => { setIsGuideDropdownOpen(false); onGuideClick('process'); }} className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg">Quy trình khám</button>
                    <button onClick={() => { setIsGuideDropdownOpen(false); onGuideClick('insurance'); }} className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg">Bảo hiểm</button>
                  </div>
                </div>
              )}
            </div>

            <button onClick={onNewsClick} className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Tin tức</button>

            {/* --- PHÂN QUYỀN RIÊNG BIỆT --- */}
            
            {role === 'doctor' ? (
              // MENU CỦA BÁC SĨ (Màu xanh nổi bật)
              <div className="relative" ref={doctorDropdownRef}>
                <button onClick={() => setIsDoctorDropdownOpen(!isDoctorDropdownOpen)} className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-2 rounded-md text-sm font-bold flex items-center">
                  Quản lý Bệnh nhân <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {isDoctorDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="grid grid-cols-1 gap-1 p-2">
                      <button onClick={() => { setIsDoctorDropdownOpen(false); onDoctorDashboardClick?.(); }} className="text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 rounded-lg">📊 Tổng quan</button>
                      <button onClick={() => { setIsDoctorDropdownOpen(false); onPatientsClick(); }} className="text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 rounded-lg">👨‍⚕️ DS Bệnh nhân</button>
                      <button onClick={() => { setIsDoctorDropdownOpen(false); onDoctorAppointmentsClick?.(); }} className="text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 rounded-lg">📅 Duyệt lịch hẹn</button>
                      <button onClick={() => { setIsDoctorDropdownOpen(false); onDoctorPrescriptionClick?.(); }} className="text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 rounded-lg">💊 Kê đơn thuốc</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // NÚT CỦA BỆNH NHÂN
              <button onClick={onAppointmentClick} className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium shadow-sm">
                Đặt lịch khám
              </button>
            )}

            {/* User Profile (Giữ nguyên) */}
            {isLoggedIn ? (
              <button onClick={onLogout} className="text-red-500 text-sm font-medium">Thoát</button>
            ) : (
              <button onClick={onSignInClick} className="text-blue-600 font-medium">Đăng nhập</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;