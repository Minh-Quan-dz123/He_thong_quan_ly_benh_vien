import React, { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5080';
const ADMIN_API_BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL || `${API_BASE_URL}/admin`;

interface AdminSignInProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: any, role: 'admin') => void;
  onForgotPasswordClick: () => void;
}

const AdminSignIn = ({ isOpen, onClose, onLogin, onForgotPasswordClick }: AdminSignInProps) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${ADMIN_API_BASE_URL}/login`, {
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
        onLogin(data, 'admin');
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Đăng nhập admin thất bại');
      }
    
    } catch (err) {
      setError('Không thể kết nối đến server admin');
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
        <div className="w-full md:w-1/2 bg-indigo-600 relative hidden md:block">
          <img 
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
            alt="Admin Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-multiply"
          />
          <div className="relative z-10 flex flex-col justify-center h-full p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">Quản trị hệ thống</h2>
            <p className="text-lg text-indigo-100 mb-8">
              Truy cập bảng điều khiển quản trị để quản lý bệnh viện, bác sĩ và bệnh nhân.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-500/50 p-2 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <span>Quản lý toàn diện</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-500/50 p-2 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <span>Bảo mật tối cao</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
            <p className="text-gray-500 mt-2">Vui lòng nhập thông tin quản trị</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập Admin</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Nhập tên đăng nhập admin"
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Nhập mật khẩu admin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <span className="ml-2 text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
              <button 
                type="button"
                onClick={onForgotPasswordClick}
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Quên mật khẩu?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02] disabled:opacity-50"
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập Admin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
