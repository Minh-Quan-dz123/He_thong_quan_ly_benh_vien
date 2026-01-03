import React, { useState, useEffect } from 'react';
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
  techImages: string[];
  doctors: Doctor[];
}

const specialtiesData: SpecialtyData[] = [
  {
    id: 'noi-tim-mach',
    name: 'Nội Tim Mạch',
    overview: 'Khoa Nội Tim mạch là một trong những chuyên khoa mũi nhọn của bệnh viện, chuyên khám và điều trị các bệnh lý về tim mạch như: Tăng huyết áp, Bệnh mạch vành, Suy tim, Rối loạn nhịp tim, Bệnh van tim...',
    technology: 'Hệ thống chụp mạch máu số hóa xóa nền (DSA) hiện đại giúp chẩn đoán và can thiệp tim mạch chính xác. Máy siêu âm tim 4D, hệ thống Holter điện tâm đồ 24h.',
    techImages: [
      'https://images.unsplash.com/photo-1579154235602-3c20f995a46b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80'
    ],
    doctors: []
  },
  {
    id: 'ngoai-than-kinh',
    name: 'Ngoại thần kinh',
    overview: 'Khoa Ngoại thần kinh chuyên thực hiện các phẫu thuật phức tạp về não bộ, cột sống và hệ thần kinh ngoại biên bằng các kỹ thuật tiên tiến nhất.',
    technology: 'Hệ thống định vị thần kinh (Navigation), kính hiển vi phẫu thuật hiện đại, máy theo dõi điện sinh lý thần kinh trong mổ.',
    techImages: [
      'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80'
    ],
    doctors: []
  },
  {
    id: 'chan-thuong-chinh-hinh',
    name: 'Chấn thương chỉnh hình',
    overview: 'Khoa Chấn thương chỉnh hình chuyên điều trị các bệnh lý về cơ xương khớp, chấn thương do tai nạn, phẫu thuật thay khớp, nội soi khớp...',
    technology: 'Phòng mổ áp lực dương siêu sạch, bàn mổ chỉnh hình đa năng, máy C-arm, hệ thống nội soi khớp hiện đại.',
    techImages: [
      'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80'
    ],
    doctors: []
  },
  {
    id: 'nhi-khoa',
    name: 'Nhi khoa',
    overview: 'Khoa Nhi cung cấp dịch vụ khám, chẩn đoán và điều trị toàn diện cho trẻ em từ sơ sinh đến 16 tuổi. Đội ngũ bác sĩ tận tâm, yêu trẻ.',
    technology: 'Hệ thống lồng ấp sơ sinh, máy thở cho trẻ sơ sinh, máy chiếu đèn điều trị vàng da.',
    techImages: [
      'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502740479091-635887520276?auto=format&fit=crop&w=800&q=80'
    ],
    doctors: []
  },
  {
    id: 'san-phu-khoa',
    name: 'Sản phụ khoa',
    overview: 'Khoa Sản phụ khoa cung cấp dịch vụ chăm sóc sức khỏe toàn diện cho phụ nữ, thai sản trọn gói, điều trị vô sinh hiếm muộn...',
    technology: 'Máy siêu âm 5D, phòng sinh gia đình thân thiện, hệ thống theo dõi tim thai liên tục (Monitoring).',
    techImages: [
      'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    ],
    doctors: []
  },
  {
    id: 'mat',
    name: 'Mắt',
    overview: 'Khoa Mắt chuyên khám và điều trị các bệnh lý về mắt, phẫu thuật đục thủy tinh thể bằng phương pháp Phaco, điều trị tật khúc xạ...',
    technology: 'Máy phẫu thuật Phaco hiện đại, hệ thống đo khúc xạ tự động, máy chụp cắt lớp võng mạc OCT.',
    techImages: [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=800&q=80'
    ],
    doctors: []
  },
  {
    id: 'rang-ham-mat',
    name: 'Răng Hàm Mặt',
    overview: 'Khoa Răng Hàm Mặt cung cấp các dịch vụ nha khoa tổng quát, nha khoa thẩm mỹ, phẫu thuật hàm mặt và cấy ghép Implant.',
    technology: 'Hệ thống ghế nha khoa hiện đại, máy chụp X-quang kỹ thuật số, công nghệ thiết kế nụ cười 3D.',
    techImages: [
      'https://images.unsplash.com/photo-1588776814546-1ffce47267a5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80'
    ],
    doctors: []
  },
  {
    id: 'da-lieu',
    name: 'Da liễu',
    overview: 'Khoa Da liễu chuyên khám và điều trị các bệnh lý về da, lông, tóc, móng và các dịch vụ thẩm mỹ da liễu công nghệ cao.',
    technology: 'Hệ thống Laser CO2 Fractional, máy soi da kỹ thuật số, công nghệ ánh sáng trị liệu hiện đại.',
    techImages: [
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=800&q=80'
    ],
    doctors: []
  },
  {
    id: 'ung-buou',
    name: 'Ung bướu',
    overview: 'Khoa Ung bướu chuyên tầm soát, chẩn đoán và điều trị các bệnh lý ung thư với phác đồ đa mô thức: Phẫu thuật, Hóa trị, Xạ trị, Chăm sóc giảm nhẹ.',
    technology: 'Hệ thống máy xạ trị gia tốc tuyến tính, máy PET/CT phát hiện ung thư sớm.',
    techImages: [
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    ],
    doctors: []
  }
];

const specialtyNameMap: { [key: string]: string } = {
  'noi-tim-mach': 'Nội Tim Mạch',
  'chan-thuong-chinh-hinh': 'Chấn thương chỉnh hình',
  'nhi-khoa': 'Nhi khoa',
  'san-phu-khoa': 'Sản phụ khoa',
  'ung-buou': 'Ung bướu',
  'ngoai-than-kinh': 'Ngoại thần kinh',
  'mat': 'Mắt',
  'rang-ham-mat': 'Răng Hàm Mặt',
  'da-lieu': 'Da liễu'
};

const MALE_DOCTOR_IMAGES = [
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80',
];

const FEMALE_DOCTOR_IMAGES = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=800&q=80',
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5080';
const DOCTOR_API_BASE_URL = import.meta.env.VITE_DOCTOR_API_BASE_URL || `${API_BASE_URL}/doctor`;

interface SpecialtiesProps {
  isLoggedIn: boolean;
  onSignInClick: () => void;
}

const Specialties = ({ isLoggedIn, onSignInClick }: SpecialtiesProps) => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'technology' | 'doctors'>('overview');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);

  const selectedSpecialty = specialtiesData.find(s => s.id === id) || specialtiesData[0];

  // Reset tab and fetch doctors when specialty changes
  useEffect(() => {
    setActiveTab('overview');
    if (id) {
      fetchDoctors(id);
    }
  }, [id]);

  const fetchDoctors = async (specialtyId: string) => {
    setIsLoadingDoctors(true);
    try {
      // Fetch all doctors from gateway and filter client-side.
      // Server-side specialty values may differ in casing/diacritics, so client-side filtering is more robust.
      const response = await fetch(`${DOCTOR_API_BASE_URL}/doctors`);
      if (response.ok) {
        const data = await response.json();
        // Ensure we only show doctors that actually belong to this specialty.
        // Resolve the database specialty name from our id map (fallback to selectedSpecialty.name).
        const dbSpecialtyName = (typeof specialtyNameMap !== 'undefined' && specialtyNameMap[specialtyId])
          ? specialtyNameMap[specialtyId]
          : (selectedSpecialty && selectedSpecialty.name) || '';

        const normalizedTarget = dbSpecialtyName.toString().trim().toLowerCase();
        const filtered = data.filter((d: any) => {
          const spec = (d.specialty || '').toString().trim().toLowerCase();
          return spec === normalizedTarget;
        });

        if (filtered.length === 0 && data.length > 0) {
          // If backend returned results but none match exactly, log for debugging and try a looser contains match.
          console.warn('[Specialties] API returned doctors but none matched exact specialty:', dbSpecialtyName, data);
          // fallback: include doctors where specialty contains the target words (looser match)
          const loose = data.filter((d: any) => (d.specialty || '').toString().toLowerCase().includes(normalizedTarget));
          filtered.push(...loose);
        }

        const mappedDoctors = filtered.map((d: any) => {
          const isFemale = d.gender === 'Nữ';
          const images = isFemale ? FEMALE_DOCTOR_IMAGES : MALE_DOCTOR_IMAGES;
          const randomImage = images[Math.floor(Math.random() * images.length)];
          return {
            name: d.name,
            specialty: d.specialty,
            image: randomImage,
            experience: 'Bác sĩ chuyên khoa'
          };
        });
        setDoctors(mappedDoctors);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setIsLoadingDoctors(false);
    }
  };

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
                {selectedSpecialty.techImages.map((img, idx) => (
                  <div key={idx} className="relative h-64 rounded-xl overflow-hidden shadow-md group">
                    <img 
                      src={img} 
                      alt={`Thiết bị ${idx + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-white font-medium">Trang thiết bị hiện đại</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'doctors' && (
            <div className="animate-fadeIn">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Đội ngũ bác sĩ</h3>
              {isLoadingDoctors ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : doctors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {doctors.map((doctor, index) => (
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
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-500">Hiện chưa có bác sĩ nào thuộc chuyên khoa này.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Specialties;
export { specialtiesData };
