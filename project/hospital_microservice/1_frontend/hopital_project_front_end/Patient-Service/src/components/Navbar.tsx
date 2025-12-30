import { useState, useRef, useEffect } from 'react';
import { Link} from 'react-router-dom';
import { specialtiesData } from './Specialties';

interface NavbarProps {
  onSignInClick: () => void;
  isLoggedIn: boolean;
  username?: string;
  role?: 'patient' | 'doctor' | null;
  onLogout: () => void;
}

const Navbar = ({ onSignInClick, isLoggedIn, username, role, onLogout }: NavbarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSpecialtyDropdownOpen, setIsSpecialtyDropdownOpen] = useState(false);
  const [isGuideDropdownOpen, setIsGuideDropdownOpen] = useState(false);
  const [isAppointmentDropdownOpen, setIsAppointmentDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const specialtyDropdownRef = useRef<HTMLDivElement>(null);
  const guideDropdownRef = useRef<HTMLDivElement>(null);
  const appointmentDropdownRef = useRef<HTMLDivElement>(null);
  //const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (specialtyDropdownRef.current && !specialtyDropdownRef.current.contains(event.target as Node)) {
        setIsSpecialtyDropdownOpen(false);
      }
      if (guideDropdownRef.current && !guideDropdownRef.current.contains(event.target as Node)) {
        setIsGuideDropdownOpen(false);
      }
      if (appointmentDropdownRef.current && !appointmentDropdownRef.current.contains(event.target as Node)) {
        setIsAppointmentDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md fixed w-full z-40 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">MediHealth</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Trang chủ</Link>
            
            {/* Chuyên khoa Dropdown */}
            <div className="relative" ref={specialtyDropdownRef}>
              <button
                onClick={() => setIsSpecialtyDropdownOpen(!isSpecialtyDropdownOpen)}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center focus:outline-none"
              >
                Chuyên khoa
                <svg className={`ml-1 w-4 h-4 transition-transform duration-200 ${isSpecialtyDropdownOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isSpecialtyDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 transform origin-top-left transition-all duration-200 ease-out z-50">
                  <div className="grid grid-cols-1 gap-1 p-2">
                    {specialtiesData.map((specialty) => (
                      <Link
                        key={specialty.id}
                        to={`/specialties/${specialty.id}`}
                        onClick={() => setIsSpecialtyDropdownOpen(false)}
                        className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors block"
                      >
                        {specialty.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Hướng dẫn bệnh nhân Dropdown */}
            <div className="relative" ref={guideDropdownRef}>
              <button
                onClick={() => setIsGuideDropdownOpen(!isGuideDropdownOpen)}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center focus:outline-none"
              >
                Hướng dẫn bệnh nhân
                <svg className={`ml-1 w-4 h-4 transition-transform duration-200 ${isGuideDropdownOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isGuideDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 transform origin-top-left transition-all duration-200 ease-out z-50">
                  <div className="grid grid-cols-1 gap-1 p-2">
                    <Link
                      to="/guide/process"
                      onClick={() => setIsGuideDropdownOpen(false)}
                      className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors block"
                    >
                      Quy trình khám chữa bệnh
                    </Link>
                    <Link
                      to="/guide/insurance"
                      onClick={() => setIsGuideDropdownOpen(false)}
                      className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors block"
                    >
                      Dịch vụ bảo hiểm
                    </Link>
                    <Link
                      to="/guide/payment"
                      onClick={() => setIsGuideDropdownOpen(false)}
                      className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors block"
                    >
                      Thủ tục thanh toán
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/news" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Tin tức</Link>
            {role === 'doctor' ? (
              <Link 
                to="/patients"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Bệnh nhân
              </Link>
            ) : (
              <div className="relative" ref={appointmentDropdownRef}>
                <button
                  onClick={() => setIsAppointmentDropdownOpen(!isAppointmentDropdownOpen)}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center focus:outline-none"
                >
                  Lịch khám
                  <svg className={`ml-1 w-4 h-4 transition-transform duration-200 ${isAppointmentDropdownOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isAppointmentDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 transform origin-top-left transition-all duration-200 ease-out z-50">
                    <div className="grid grid-cols-1 gap-1 p-2">
                      {isLoggedIn ? (
                        <Link
                          to="/appointment"
                          onClick={() => setIsAppointmentDropdownOpen(false)}
                          className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors block"
                        >
                          Đặt lịch khám
                        </Link>
                      ) : (
                        <button
                          onClick={() => {
                            setIsAppointmentDropdownOpen(false);
                            onSignInClick();
                          }}
                          className="text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors block"
                        >
                          Đặt lịch khám
                        </button>
                      )}
                      {isLoggedIn ? (
                        <Link
                          to="/appointments-list"
                          onClick={() => setIsAppointmentDropdownOpen(false)}
                          className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors block"
                        >
                          Xem lịch khám
                        </Link>
                      ) : (
                        <button
                          onClick={() => {
                            setIsAppointmentDropdownOpen(false);
                            onSignInClick();
                          }}
                          className="text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors block"
                        >
                          Xem lịch khám
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none transition-colors duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ring-2 ring-transparent hover:ring-blue-200 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="font-medium">{username}</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-lg border border-gray-100 py-2 transform origin-top-right transition-all duration-200 ease-out">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Đăng nhập với</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{username}</p>
                    </div>

                    <div className="py-1">
                      <Link 
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Thông tin cá nhân
                      </Link>
                      {role !== 'doctor' && (
                        <Link 
                          to="/records"
                          onClick={() => setIsDropdownOpen(false)}
                          className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        >
                          <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                          Hồ sơ bệnh án
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onLogout();
                      }}
                      className="group flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={onSignInClick}
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Đăng nhập
              </button>
            )}
          </div>
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isDropdownOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Trang chủ</Link>
            {isLoggedIn ? (
              <>
                <Link to="/appointment" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Đặt lịch khám</Link>
                <Link to="/appointments-list" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Xem lịch khám</Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onSignInClick();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Đặt lịch khám
                </button>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onSignInClick();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Xem lịch khám
                </button>
              </>
            )}
            <Link to="/news" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Tin tức</Link>
            {!isLoggedIn ? (
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  onSignInClick();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                Đăng nhập
              </button>
            ) : (
              <>
                <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Thông tin cá nhân</Link>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onLogout();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Đăng xuất
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
