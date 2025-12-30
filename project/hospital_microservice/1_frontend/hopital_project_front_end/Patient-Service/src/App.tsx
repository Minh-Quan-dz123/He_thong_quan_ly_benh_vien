import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Doctors from './components/Doctors';
import Contact from './components/Contact';
import SignIn from './components/SignIn';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import UserProfile from './components/UserProfile';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
import MedicalRecords from './components/MedicalRecords';
import Appointment from './components/Appointment';
import AppointmentList from './components/AppointmentList';
import DoctorPatients from './components/DoctorPatients';
import News from './components/News';
import QuickAccess from './components/QuickAccess';
import Specialties from './components/Specialties';
import PatientGuide from './components/PatientGuide';
import WhyChooseUs from './components/WhyChooseUs';

function App() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'patient' | 'doctor' | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', message: '', type: 'success' as 'success' | 'error' });

  const location = useLocation();
  const navigate = useNavigate();

  // Restore session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setIsLoggedIn(true);
        setCurrentUser(user);
        setUserRole(user.role || 'patient');
      } catch (e) {
        console.error("Failed to parse saved user", e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Sync URL with Modal state
  useEffect(() => {
    const path = location.pathname;
    setIsSignInOpen(path === '/login');
    setIsRegisterOpen(path === '/register');
    setIsForgotPasswordOpen(path === '/forgot-password');
  }, [location.pathname]);

  const handleCloseModals = () => {
    // If we are on a modal route, go back to home or previous page
    if (['/login', '/register', '/forgot-password'].includes(location.pathname)) {
      navigate('/');
    }
  };

  const showToastMsg = (title: string, message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ title, message, type });
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  const showSuccessToast = (title: string, message: string) => showToastMsg(title, message, 'success');

  const handleLogin = (user: any, role: 'patient' | 'doctor') => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    setUserRole(role);
    localStorage.setItem('user', JSON.stringify(user));
    if (user.access_token) {
      localStorage.setItem('token', user.access_token);
    }
  };

  const handleRegister = async (userData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        showSuccessToast('Đăng ký thành công!', 'Vui lòng đăng nhập để tiếp tục.');
        
        // Smooth transition: Wait a bit before switching modals
        setTimeout(() => {
          navigate('/login');
        }, 500);
        
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail);
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUserRole(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .toast-enter { animation: slideInRight 0.5s ease-out forwards; }
        .toast-exit { animation: slideOutRight 0.5s ease-in forwards; }
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
        .animate-zoom-in { animation: zoomIn 0.2s ease-out forwards; }
      `}</style>
      
      {showToast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center bg-white px-6 py-5 rounded-xl shadow-2xl border-l-4 ${toastMessage.type === 'success' ? 'border-green-500' : 'border-red-500'} min-w-[320px] transform transition-all duration-500 ${showToast ? 'toast-enter' : 'toast-exit'}`}>
          <div className={`flex-shrink-0 rounded-full p-2 ${toastMessage.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
            {toastMessage.type === 'success' ? (
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <div className="ml-4 flex-1">
            <p className="text-lg font-bold text-gray-900">{toastMessage.title}</p>
            <p className="text-sm text-gray-600 mt-1">{toastMessage.message}</p>
          </div>
        </div>
      )}

      <Navbar 
        onSignInClick={() => navigate('/login')}
        isLoggedIn={isLoggedIn}
        username={currentUser?.name || ''}
        role={userRole}
        onLogout={handleLogout}
      />
      
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <QuickAccess isLoggedIn={isLoggedIn} onSignInClick={() => navigate('/login')} />
            <WhyChooseUs />
            <Doctors />
            <Contact />
          </>
        } />
        <Route path="/login" element={
          <>
            <Hero />
            <QuickAccess isLoggedIn={isLoggedIn} onSignInClick={() => navigate('/login')} />
            <WhyChooseUs />
            <Doctors />
            <Contact />
          </>
        } />
        <Route path="/register" element={
          <>
            <Hero />
            <QuickAccess isLoggedIn={isLoggedIn} onSignInClick={() => navigate('/login')} />
            <WhyChooseUs />
            <Doctors />
            <Contact />
          </>
        } />
        <Route path="/forgot-password" element={
          <>
            <Hero />
            <QuickAccess isLoggedIn={isLoggedIn} onSignInClick={() => navigate('/login')} />
            <WhyChooseUs />
            <Doctors />
            <Contact />
          </>
        } />
        <Route path="/profile" element={
          isLoggedIn ? (
            <UserProfile role={userRole} currentUser={currentUser} showSuccessToast={showSuccessToast} />
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/records" element={
          isLoggedIn && userRole !== 'doctor' ? (
            <MedicalRecords />
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/appointment" element={
          isLoggedIn ? (
            <Appointment currentUser={currentUser} />
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/appointments-list" element={
          isLoggedIn ? (
            <AppointmentList currentUser={currentUser} showToastMsg={showToastMsg} />
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/patients" element={
          isLoggedIn && userRole === 'doctor' ? (
            <DoctorPatients />
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/news" element={<News />} />
        <Route path="/specialties/:id" element={<Specialties isLoggedIn={isLoggedIn} onSignInClick={() => navigate('/login')} />} />
        <Route path="/guide/:section" element={<PatientGuide />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <SignIn 
        isOpen={isSignInOpen} 
        onClose={handleCloseModals}
        onLogin={handleLogin}
        onRegisterClick={() => navigate('/register')}
        onForgotPasswordClick={() => navigate('/forgot-password')}
      />
      <Register
        isOpen={isRegisterOpen}
        onClose={handleCloseModals}
        onRegister={handleRegister}
        onSignInClick={() => navigate('/login')}
      />
      <ForgotPassword
        isOpen={isForgotPasswordOpen}
        onClose={handleCloseModals}
        onBackToLogin={() => navigate('/login')}
      />
    </div>
  );
}

export default App;
