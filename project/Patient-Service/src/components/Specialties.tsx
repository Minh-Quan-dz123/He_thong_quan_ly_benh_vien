import{ useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Doctor {
  name: string;
  specialty: string;
  image: string;
  experience: string;
}

interface SpecialtyData {
  id: string;
  name: string;
  overview: string;
  technology: string;
  doctors: Doctor[];
}

const specialtiesData: SpecialtyData[] = [
  {
    id: 'noi-tim-mach',
    name: 'Nội Tim Mạch',
    overview: 'Khoa Nội Tim mạch là một trong những chuyên khoa mũi nhọn của bệnh viện, chuyên khám và điều trị các bệnh lý về tim mạch như: Tăng huyết áp, Bệnh mạch vành, Suy tim, Rối loạn nhịp tim, Bệnh van tim...',
    technology: 'Hệ thống chụp mạch máu số hóa xóa nền (DSA) hiện đại giúp chẩn đoán và can thiệp tim mạch chính xác. Máy siêu âm tim 4D, hệ thống Holter điện tâm đồ 24h.',
    doctors: [
      { name: 'GS.TS.BS Nguyễn Văn A', specialty: 'Tim mạch', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80', experience: '30 năm kinh nghiệm' },
      { name: 'ThS.BS Trần Thị B', specialty: 'Tim mạch', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=300&q=80', experience: '15 năm kinh nghiệm' },
    ]
  },
  {
    id: 'chan-thuong-chinh-hinh',
    name: 'Chấn thương chỉnh hình',
    overview: 'Khoa Chấn thương chỉnh hình chuyên điều trị các bệnh lý về cơ xương khớp, chấn thương do tai nạn, phẫu thuật thay khớp, nội soi khớp...',
    technology: 'Phòng mổ áp lực dương siêu sạch, bàn mổ chỉnh hình đa năng, máy C-arm, hệ thống nội soi khớp hiện đại.',
    doctors: [
      { name: 'BSCKII Lê Văn C', specialty: 'Chấn thương chỉnh hình', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80', experience: '20 năm kinh nghiệm' },
    ]
  },
  {
    id: 'nhi-khoa',
    name: 'Nhi khoa',
    overview: 'Khoa Nhi cung cấp dịch vụ khám, chẩn đoán và điều trị toàn diện cho trẻ em từ sơ sinh đến 16 tuổi. Đội ngũ bác sĩ tận tâm, yêu trẻ.',
    technology: 'Hệ thống lồng ấp sơ sinh, máy thở cho trẻ sơ sinh, máy chiếu đèn điều trị vàng da.',
    doctors: [
      { name: 'TS.BS Phạm Thị D', specialty: 'Nhi khoa', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80', experience: '25 năm kinh nghiệm' },
    ]
  },
  {
    id: 'san-phu-khoa',
    name: 'Sản phụ khoa',
    overview: 'Khoa Sản phụ khoa cung cấp dịch vụ chăm sóc sức khỏe toàn diện cho phụ nữ, thai sản trọn gói, điều trị vô sinh hiếm muộn...',
    technology: 'Máy siêu âm 5D, phòng sinh gia đình thân thiện, hệ thống theo dõi tim thai liên tục (Monitoring).',
    doctors: [
      { name: 'BSCKI Nguyễn Thị E', specialty: 'Sản phụ khoa', image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=300&q=80', experience: '18 năm kinh nghiệm' },
    ]
  },
  {
    id: 'ung-buou',
    name: 'Ung bướu',
    overview: 'Khoa Ung bướu chuyên tầm soát, chẩn đoán và điều trị các bệnh lý ung thư với phác đồ đa mô thức: Phẫu thuật, Hóa trị, Xạ trị, Chăm sóc giảm nhẹ.',
    technology: 'Hệ thống máy xạ trị gia tốc tuyến tính, máy PET/CT phát hiện ung thư sớm.',
    doctors: [
      { name: 'PGS.TS Trần Văn F', specialty: 'Ung bướu', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80', experience: '28 năm kinh nghiệm' },
    ]
  }
];

interface SpecialtiesProps {
  isLoggedIn: boolean;
  onSignInClick: () => void;
}

const Specialties = ({ isLoggedIn, onSignInClick }: SpecialtiesProps) => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'technology' | 'doctors'>('overview');

  const selectedSpecialty = specialtiesData.find(s => s.id === id) || specialtiesData[0];

  // Reset tab when specialty changes
  useEffect(() => {
    setActiveTab('overview');
  }, [id]);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">Chuyên khoa</span>
          <span className="mx-2">›</span>
          <span className="text-blue-600 font-medium">{selectedSpecialty.name}</span>
        </nav>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-blue-800 uppercase tracking-wide">
            {selectedSpecialty.name}
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-8 py-3 rounded-lg text-base font-bold transition-all duration-200 shadow-sm ${
              activeTab === 'overview'
                ? 'bg-blue-700 text-white shadow-md transform scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-blue-600 border border-gray-200'
            }`}
          >
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab('technology')}
            className={`px-8 py-3 rounded-lg text-base font-bold transition-all duration-200 shadow-sm ${
              activeTab === 'technology'
                ? 'bg-blue-700 text-white shadow-md transform scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-blue-600 border border-gray-200'
            }`}
          >
            Công nghệ
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-8 py-3 rounded-lg text-base font-bold transition-all duration-200 shadow-sm ${
              activeTab === 'doctors'
                ? 'bg-blue-700 text-white shadow-md transform scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-blue-600 border border-gray-200'
            }`}
          >
            Danh sách bác sĩ
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 min-h-[400px]">
          {activeTab === 'overview' && (
            <div className="animate-fadeIn">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Tổng quan khoa {selectedSpecialty.name}</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                {selectedSpecialty.overview}
              </p>
              <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-2">Cam kết chất lượng</h4>
                <p className="text-gray-600">
                  Chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe tốt nhất với đội ngũ y bác sĩ đầu ngành và trang thiết bị hiện đại.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'technology' && (
            <div className="animate-fadeIn">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Cơ sở vật chất & Công nghệ</h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {selectedSpecialty.technology}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center text-gray-400">
                  <span>Hình ảnh thiết bị 1</span>
                </div>
                <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center text-gray-400">
                  <span>Hình ảnh thiết bị 2</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'doctors' && (
            <div className="animate-fadeIn">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Đội ngũ bác sĩ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {selectedSpecialty.doctors.map((doctor, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="h-64 overflow-hidden">
                      <img 
                        src={doctor.image} 
                        alt={doctor.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h4>
                      <p className="text-blue-600 font-medium mb-2">{doctor.specialty}</p>
                      <p className="text-gray-500 text-sm">{doctor.experience}</p>
                      {isLoggedIn ? (
                        <Link to="/appointment" className="block text-center mt-4 w-full py-2 px-4 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors">
                          Đặt lịch khám
                        </Link>
                      ) : (
                        <button 
                          onClick={onSignInClick}
                          className="mt-4 w-full py-2 px-4 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors text-center block"
                        >
                          Đặt lịch khám
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Specialties;
export { specialtiesData };
