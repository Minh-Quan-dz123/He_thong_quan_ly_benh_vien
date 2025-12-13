import React, { useState, useRef } from 'react';

interface RegisterProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (userData: any) => Promise<void>;
  onSignInClick: () => void;
}

const Register = ({ isOpen, onClose, onRegister, onSignInClick }: RegisterProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | HTMLSelectElement | null>>({});
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    dob: '',
    gender: 'Male',
    phone: '',
    documentType: 'CCCD',
    documentNumber: '',
    address: '',
    bloodType: '-',
    height: '',
    weight: '',
    allergies: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Client-side validation
    if (formData.password.length <= 6) {
      newErrors.password = "Mật khẩu phải dài hơn 6 ký tự";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp!";
    }
    if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại chỉ được chứa số";
    }
    if (!/^\d+$/.test(formData.documentNumber)) {
      newErrors.documentNumber = "Số giấy tờ chỉ được chứa số";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorField = Object.keys(newErrors)[0];
      if (inputRefs.current[firstErrorField]) {
        inputRefs.current[firstErrorField]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        inputRefs.current[firstErrorField]?.focus();
      }
      return;
    }

    try {
      await onRegister(formData);
    } catch (error: any) {
      const errorMsg = error.message || "Đã xảy ra lỗi";
      const serverErrors: Record<string, string> = {};
      
      if (errorMsg.includes("Username already exists")) {
        serverErrors.username = "Tên đăng nhập đã tồn tại";
      } else if (errorMsg.includes("Phone number already exists")) {
        serverErrors.phone = "Số điện thoại đã tồn tại";
      } else if (errorMsg.includes("Document number already registered")) {
        serverErrors.documentNumber = "Số giấy tờ đã được đăng ký";
      } else if (errorMsg.includes("Password must be longer than 6 characters")) {
        serverErrors.password = "Mật khẩu phải dài hơn 6 ký tự";
      } else if (errorMsg.includes("Phone number must contain only digits")) {
        serverErrors.phone = "Số điện thoại chỉ được chứa số";
      } else if (errorMsg.includes("Document number must contain only digits")) {
        serverErrors.documentNumber = "Số giấy tờ chỉ được chứa số";
      } else {
        alert(errorMsg); // Fallback for unknown errors
      }
      
      setErrors(serverErrors);
      
      if (Object.keys(serverErrors).length > 0) {
        const firstErrorField = Object.keys(serverErrors)[0];
        if (inputRefs.current[firstErrorField]) {
          inputRefs.current[firstErrorField]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          inputRefs.current[firstErrorField]?.focus();
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col relative animate-fade-in-up my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 md:p-12 bg-white overflow-y-auto max-h-[90vh]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Đăng ký tài khoản</h2>
            <p className="text-gray-500 mt-2">Nhập thông tin cá nhân để tạo hồ sơ bệnh nhân mới</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Info */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-2 border-b pb-2">Thông tin tài khoản</h3>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="username"
                  ref={(el) => { inputRefs.current['username'] = el; }}
                  required
                  className={`block w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  name="password"
                  ref={(el) => { inputRefs.current['password'] = el; }}
                  required
                  className={`block w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  name="confirmPassword"
                  ref={(el) => { inputRefs.current['confirmPassword'] = el; }}
                  required
                  className={`block w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>

              {/* Personal Info */}
              <div className="md:col-span-2 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2 border-b pb-2">Thông tin cá nhân</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="dob"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính <span className="text-red-500">*</span></label>
                <select
                  name="gender"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                  <option value="Other">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className={`block w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại giấy tờ <span className="text-red-500">*</span></label>
                <select
                  name="documentType"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={formData.documentType}
                  onChange={handleChange}
                >
                  <option value="CCCD">CCCD (VN)</option>
                  <option value="Passport">Passport</option>
                  <option value="National ID">National ID</option>
                  <option value="Driver License">Driver License</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số giấy tờ <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="documentNumber"
                  required
                  className={`block w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.documentNumber ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.documentNumber}
                  onChange={handleChange}
                />
                {errors.documentNumber && <p className="mt-1 text-sm text-red-600">{errors.documentNumber}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="address"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              {/* Health Info (Optional) */}
              <div className="md:col-span-2 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2 border-b pb-2">Thông tin sức khỏe (Tùy chọn)</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nhóm máu</label>
                <select
                  name="bloodType"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={formData.bloodType}
                  onChange={handleChange}
                >
                  <option value="-">-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chiều cao (cm)</label>
                <input
                  type="text"
                  name="height"
                  placeholder="-"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={formData.height}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cân nặng (kg)</label>
                <input
                  type="text"
                  name="weight"
                  placeholder="-"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dị ứng</label>
                <input
                  type="text"
                  name="allergies"
                  placeholder="-"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={formData.allergies}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02] mt-6"
            >
              Đăng ký
            </button>

            <div className="mt-6 text-center text-sm text-gray-500">
              Đã có tài khoản?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); onSignInClick(); }} className="text-blue-600 hover:text-blue-500 font-medium">Đăng nhập ngay</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;