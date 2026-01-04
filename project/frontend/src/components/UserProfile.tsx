import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5080';

interface UserProfileProps {
  role?: 'patient' | 'doctor' | 'admin' | null;
  currentUser?: any;
  showSuccessToast: (title: string, message: string) => void;
}

const UserProfile = ({ role, currentUser, showSuccessToast }: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    id: '',
    name: '',
    dob: '',
    gender: '',
    phone: '',
    address: '',
    documentType: '',
    documentNumber: '',
    bloodType: '',
    height: '',
    weight: '',
    allergies: '',
    department: ''
  });

  useEffect(() => {
    if (currentUser && currentUser.id) {
      const fetchUserData = async () => {
        try {
          const base = API_BASE_URL;
          const prefix = role === 'doctor' ? 'doctor' : 'patient';
          const path = role === 'doctor' ? 'doctors' : 'patients';
          const token = localStorage.getItem('token');
          const response = await fetch(`${base}/${prefix}/${path}/${currentUser.id}`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
          });
          if (response.ok) {
            const data = await response.json();
            setUser({
              id: data.id,
              name: data.name,
              dob: data.dob,
              gender: data.gender,
              phone: data.phone,
              address: data.address,
              documentType: data.documentType || '',
              documentNumber: data.documentNumber || '',
              bloodType: data.bloodType || '',
              height: data.height || '',
              weight: data.weight || '',
              allergies: data.allergies || '',
              department: data.specialty || 'General'
            });
          }
        } catch (error) {
          console.error("Failed to fetch user data", error);
        }
      };
      fetchUserData();
    }
  }, [currentUser]);

  const [tempUser, setTempUser] = useState(user);

  // Update tempUser when user changes
  useEffect(() => {
    setTempUser(user);
  }, [user]);

  const handleEdit = () => {
    setTempUser(user);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      
      const base = API_BASE_URL;
      const prefix = role === 'doctor' ? 'doctor' : 'patient';
      const path = role === 'doctor' ? 'doctors' : 'patients';
      const token = localStorage.getItem('token');
      const response = await fetch(`${base}/${prefix}/${path}/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: tempUser.name,
          dob: tempUser.dob,
          gender: tempUser.gender,
          phone: tempUser.phone,
          address: tempUser.address,
          bloodType: tempUser.bloodType,
          height: tempUser.height,
          weight: tempUser.weight,
          allergies: tempUser.allergies,
          ...(role === 'doctor' ? { specialty: tempUser.department } : {})
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser({
          ...user,
          name: updatedUser.name,
          dob: updatedUser.dob,
          gender: updatedUser.gender,
          phone: updatedUser.phone,
          address: updatedUser.address,
          bloodType: updatedUser.bloodType || '',
          height: updatedUser.height || '',
          weight: updatedUser.weight || '',
          allergies: updatedUser.allergies || '',
          department: updatedUser.specialty || user.department
        });
        setIsEditing(false);
        showSuccessToast("Cập nhật thành công!", "Thông tin hồ sơ của bạn đã được lưu.");
      } else {
        const errorData = await response.json();
        alert(`Cập nhật thất bại: ${errorData.detail}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Đã xảy ra lỗi khi cập nhật hồ sơ.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTempUser(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Thông tin cá nhân</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {role === 'doctor' ? 'Hồ sơ bác sĩ' : 'Hồ sơ bệnh nhân'} - Chi tiết cá nhân và tổng quan sức khỏe.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Chỉnh sửa hồ sơ
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Lưu
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Hủy
                </button>
              </div>
            )}
            <div className="flex-shrink-0">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                {user.name ? user.name.charAt(0) : 'U'}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 self-center">Mã bệnh nhân</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  value={user.id}
                  disabled
                  className="w-full border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 sm:text-sm border p-2 cursor-not-allowed"
                />
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 self-center">Họ và tên</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={tempUser.name}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2"
                  />
                ) : user.name}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 self-center">Ngày sinh</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <input
                    type="date"
                    name="dob"
                    value={tempUser.dob}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2"
                  />
                ) : user.dob}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 self-center">Giới tính</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <select
                    name="gender"
                    value={tempUser.gender}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2"
                  >
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                  </select>
                ) : (user.gender === 'Male' ? 'Nam' : user.gender === 'Female' ? 'Nữ' : 'Khác')}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 self-center">Số điện thoại</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={tempUser.phone}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2"
                  />
                ) : user.phone}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 self-center">Địa chỉ</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={tempUser.address}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2"
                  />
                ) : user.address}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 self-center">Loại giấy tờ</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  value={user.documentType || '-'}
                  disabled
                  className="w-full border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 sm:text-sm border p-2 cursor-not-allowed"
                />
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 self-center">Số giấy tờ</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  value={user.documentNumber || '-'}
                  disabled
                  className="w-full border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 sm:text-sm border p-2 cursor-not-allowed"
                />
              </dd>
            </div>
            {role === 'doctor' && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 self-center">Khoa</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="text"
                      name="department"
                      value={tempUser.department}
                      onChange={handleChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2"
                    />
                  ) : user.department}
                </dd>
              </div>
            )}
             <div className={`${role === 'doctor' ? 'bg-white' : 'bg-gray-50'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
              <dt className="text-sm font-medium text-gray-500 self-center">Nhóm máu</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="bloodType"
                    value={tempUser.bloodType}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2"
                  />
                ) : user.bloodType}
              </dd>
            </div>
             <div className={`${role === 'doctor' ? 'bg-gray-50' : 'bg-white'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
              <dt className="text-sm font-medium text-gray-500 self-center">Chiều cao / Cân nặng</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      name="height"
                      value={tempUser.height}
                      onChange={handleChange}
                      placeholder="Chiều cao"
                      className="w-1/2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2"
                    />
                    <input
                      type="text"
                      name="weight"
                      value={tempUser.weight}
                      onChange={handleChange}
                      placeholder="Cân nặng"
                      className="w-1/2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2"
                    />
                  </div>
                ) : `${user.height} / ${user.weight}`}
              </dd>
            </div>
             <div className={`${role === 'doctor' ? 'bg-white' : 'bg-gray-50'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
              <dt className="text-sm font-medium text-gray-500 self-center">Dị ứng</dt>
              <dd className={`mt-1 text-sm sm:mt-0 sm:col-span-2 ${isEditing ? 'text-gray-900' : 'text-red-600'}`}>
                {isEditing ? (
                  <input
                    type="text"
                    name="allergies"
                    value={tempUser.allergies}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2"
                  />
                ) : user.allergies}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
