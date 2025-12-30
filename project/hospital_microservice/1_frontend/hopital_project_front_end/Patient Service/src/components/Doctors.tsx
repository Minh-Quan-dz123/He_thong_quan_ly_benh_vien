import { useState, useEffect } from 'react';

const doctors = [
  {
    name: 'Dr. Sarah Wilson',
    specialty: 'Bác sĩ Tim mạch',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Dr. James Chen',
    specialty: 'Bác sĩ Thần kinh',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Dr. Emily Parker',
    specialty: 'Bác sĩ Nhi khoa',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Dr. Michael Brown',
    specialty: 'Bác sĩ Chỉnh hình',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Dr. Lisa Davis',
    specialty: 'Bác sĩ Da liễu',
    image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Dr. Robert Wilson',
    specialty: 'Bác sĩ Nhãn khoa',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Dr. Jennifer Taylor',
    specialty: 'Bác sĩ Tâm thần',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Dr. David Anderson',
    specialty: 'Bác sĩ Ung bướu',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Dr. Jessica Martinez',
    specialty: 'Bác sĩ Nội tiết',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Dr. Thomas White',
    specialty: 'Bác sĩ Tiêu hóa',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
];

const Doctors = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + itemsPerPage) % doctors.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + itemsPerPage) % doctors.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - itemsPerPage + doctors.length) % doctors.length);
  };

  const visibleDoctors = [];
  for (let i = 0; i < itemsPerPage; i++) {
    const index = (currentIndex + i) % doctors.length;
    visibleDoctors.push(doctors[index]);
  }

  return (
    <div id="doctors" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Đội ngũ bác sĩ chuyên gia
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Gặp gỡ đội ngũ bác sĩ chuyên khoa tận tâm vì sức khỏe và hạnh phúc của bạn.
          </p>
        </div>

        <div className="mt-10 relative">
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {visibleDoctors.map((doctor, index) => (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img className="w-full h-64 object-cover" src={doctor.image} alt={doctor.name} />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                  <p className="text-blue-600 font-medium mt-1">{doctor.specialty}</p>
                  <button className="mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors text-sm font-medium">
                    Xem hồ sơ
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none hidden lg:block"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none hidden lg:block"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: Math.ceil(doctors.length / itemsPerPage) }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx * itemsPerPage)}
              className={`w-3 h-3 rounded-full ${
                Math.floor(currentIndex / itemsPerPage) === idx ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
