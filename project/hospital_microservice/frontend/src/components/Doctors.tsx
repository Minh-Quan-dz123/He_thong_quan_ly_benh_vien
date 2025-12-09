import { useState, useEffect } from 'react';

const DOCTOR_API_BASE_URL = import.meta.env.VITE_DOCTOR_API_BASE_URL || 'http://localhost:5080/doctor';

const MALE_DOCTOR_IMAGES = [
  'https://apicms.bachmai.gov.vn/api/media/download/f70bbc4c-a10c-449e-9d2a-189bcb8612e3',
  'https://apicms.bachmai.gov.vn/api/media/download/abc2ed1f-07f9-4591-a120-80f77431c934',
  'https://apicms.bachmai.gov.vn/api/media/download/f036a73f-2a6b-40b8-af6d-f93e9c4d5b9e',
  'https://apicms.bachmai.gov.vn/api/media/download/2e3ce2f1-47c4-4f3d-a642-f70af963cd4b',
];

const FEMALE_DOCTOR_IMAGES = [
  'https://apicms.bachmai.gov.vn/api/media/download/59cb50b1-e49e-56eb-9334-186e6066155f',
  'https://apicms.bachmai.gov.vn/api/media/download/2f9f1a8b-5fa2-7e04-8606-f6feb13decda',
  'https://apicms.bachmai.gov.vn/api/media/download/0598e1ec-c908-407f-add0-7b084e2cebda',
  'https://apicms.bachmai.gov.vn/api/media/download/20b53e30-9160-4aa4-83a3-6020d5ece349',
];

interface Doctor {
  name: string;
  specialty: string;
  image: string;
  gender?: string;
}

const Doctors = () => {
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${DOCTOR_API_BASE_URL}/doctors`);
        if (response.ok) {
          const data = await response.json();
          
          if (data && data.length > 0) {
            // Lấy chính xác 8 bác sĩ (hoặc ít hơn nếu database không đủ)
            const limited = data.slice(0, 8);
            
            // Assign images deterministically by index to avoid showing the same
            // image for multiple cards due to random collisions.
            const mapped = limited.map((d: any, idx: number) => {
              const isFemale = d.gender === 'Nữ';
              const images = isFemale ? FEMALE_DOCTOR_IMAGES : MALE_DOCTOR_IMAGES;
              // Cycle through the available images based on index
              const chosenImage = images[idx % images.length];
              return {
                name: d.name,
                specialty: d.specialty || 'Bác sĩ chuyên khoa',
                image: chosenImage,
                gender: d.gender
              };
            });
            setDoctorsList(mapped);
          }
        }
      } catch (error) {
        console.error("Error fetching doctors for home page:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    if (doctorsList.length <= itemsPerPage) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Trượt mỗi 3 giây

    return () => clearInterval(interval);
  }, [doctorsList.length, currentIndex]);

  const nextSlide = () => {
    if (doctorsList.length <= itemsPerPage) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % doctorsList.length);
  };

  const prevSlide = () => {
    if (doctorsList.length <= itemsPerPage) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + doctorsList.length) % doctorsList.length);
  };

  if (isLoading) {
    return (
      <div className="py-12 bg-white flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (doctorsList.length === 0) return null;

  // Tạo danh sách hiển thị vòng lặp để trượt mượt mà
  const getDisplayDoctors = () => {
    if (doctorsList.length <= itemsPerPage) return doctorsList;
    // Thêm vài item từ đầu vào cuối để tạo hiệu ứng vòng lặp
    return [...doctorsList, ...doctorsList.slice(0, itemsPerPage)];
  };

  const displayList = getDisplayDoctors();

  return (
    <div id="doctors" className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-blue-900 sm:text-4xl uppercase tracking-tight">
            Đội ngũ bác sĩ
          </h2>
          <div className="mt-2 h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-4 max-w-2xl text-lg text-gray-600 mx-auto">
            Hội tụ đội ngũ chuyên gia, bác sĩ đầu ngành với nhiều năm kinh nghiệm
          </p>
        </div>

        <div className="relative px-4 sm:px-12">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
            >
              {displayList.map((doctor, index) => (
                <div key={index} className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-3">
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group h-full">
                    <div className="relative h-72 overflow-hidden">
                      <img 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        src={doctor.image} 
                        alt={doctor.name} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{doctor.name}</h3>
                      <p className="text-blue-600 font-medium mt-1 uppercase text-sm tracking-wider">{doctor.specialty}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {doctorsList.length > itemsPerPage && (
            <>
              <button 
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all focus:outline-none z-10 border border-gray-100 -ml-2 sm:ml-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all focus:outline-none z-10 border border-gray-100 -mr-2 sm:mr-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="flex justify-center mt-10 space-x-2">
                {doctorsList.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentIndex % doctorsList.length === idx ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
