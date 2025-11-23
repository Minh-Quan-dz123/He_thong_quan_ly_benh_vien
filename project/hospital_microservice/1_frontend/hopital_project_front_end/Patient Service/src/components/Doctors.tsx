const doctors = [
  {
    name: 'Dr. Sarah Wilson',
    specialty: 'Cardiologist',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Dr. James Chen',
    specialty: 'Neurologist',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Dr. Emily Parker',
    specialty: 'Pediatrician',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
];

const Doctors = () => {
  return (
    <div id="doctors" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Expert Doctors
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Meet our team of specialized physicians dedicated to your health and well-being.
          </p>
        </div>

        <div className="mt-10 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor, index) => (
            <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img className="w-full h-64 object-cover" src={doctor.image} alt={doctor.name} />
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                <p className="text-blue-600 font-medium mt-1">{doctor.specialty}</p>
                <button className="mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors text-sm font-medium">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
