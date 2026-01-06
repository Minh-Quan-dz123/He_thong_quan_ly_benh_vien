import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5080';
const DOCTOR_API_BASE_URL = import.meta.env.VITE_DOCTOR_API_BASE_URL || `${API_BASE_URL}/doctor`;

interface SignInProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: any, role: 'patient' | 'doctor') => void;
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
}

const SignIn = ({ isOpen, onClose, onLogin, onRegisterClick, onForgotPasswordClick }: SignInProps) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // For patient role we want to hit the gateway's /patient/login route.
      const targetUrl = role === 'doctor' ? DOCTOR_API_BASE_URL : `${API_BASE_URL}/patient`;
      const response = await fetch(`${targetUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: identifier,
          password: password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // backend returns `role` (patient or doctor)
        onLogin(data, data.role || 'patient');
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Đăng nhập thất bại');
      }
    
    } catch (err) {
      setError('Không thể kết nối đến server');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left Side - Info/Image */}
        <div className="w-full md:w-1/2 bg-blue-600 relative hidden md:block">
          <img 
            src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
            alt="Medical Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-multiply"
          />
          <div className="relative z-10 flex flex-col justify-center h-full p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">Chào mừng trở lại!</h2>
            <p className="text-lg text-blue-100 mb-8">
              Truy cập hồ sơ sức khỏe cá nhân, lịch hẹn và kết nối với các chuyên gia của chúng tôi.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500/50 p-2 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <span>Hồ sơ sức khỏe bảo mật</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500/50 p-2 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <span>Đặt lịch hẹn dễ dàng</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Đăng nhập</h2>
            <p className="text-gray-500 mt-2">Vui lòng nhập thông tin của bạn để tiếp tục</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div className="flex p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  role === 'patient' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Bệnh nhân
              </button>
              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  role === 'doctor' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Bác sĩ
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập hoặc Số điện thoại</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Nhập tên đăng nhập hoặc SĐT"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Nhập mật khẩu của bạn"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <span className="ml-2 text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
              <button 
                type="button"
                onClick={onForgotPasswordClick}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Quên mật khẩu?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02] disabled:opacity-50"
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>

            {role === 'patient' && (
              <div className="mt-6 text-center text-sm text-gray-500">
                Chưa có tài khoản?{' '}
                <button 
                  type="button"
                  onClick={onRegisterClick}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Đăng ký ngay
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
