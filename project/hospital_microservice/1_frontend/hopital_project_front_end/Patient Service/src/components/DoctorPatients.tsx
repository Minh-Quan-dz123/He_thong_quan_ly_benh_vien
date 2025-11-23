import React, { useState } from 'react';

const DoctorPatients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'id' | 'name'>('id');

  const patients = [
    { id: 1, name: 'Nguyen Van A', age: 30, lastVisit: '2023-10-01', condition: 'Flu' },
    { id: 2, name: 'Tran Thi B', age: 25, lastVisit: '2023-10-05', condition: 'Headache' },
    { id: 3, name: 'Le Van C', age: 45, lastVisit: '2023-09-20', condition: 'Hypertension' },
    { id: 4, name: 'Pham Thi D', age: 28, lastVisit: '2023-10-10', condition: 'Allergy' },
    { id: 5, name: 'Hoang Van E', age: 50, lastVisit: '2023-09-15', condition: 'Diabetes' },
  ];

  const filteredPatients = patients.filter(patient => {
    if (filterType === 'id') {
      return patient.id.toString().includes(searchTerm);
    } else {
      return patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Patient List</h2>
        <div className="flex space-x-4">
            <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'id' | 'name')}
                className="border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
                <option value="id">Filter by ID</option>
                <option value="name">Filter by Name</option>
            </select>
            <div className="relative">
                <input 
                    type="text" 
                    placeholder={`Search by ${filterType}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
        </div>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredPatients.map((patient) => (
            <li key={patient.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium text-blue-600 truncate">{patient.name}</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {patient.condition}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Age: {patient.age}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>
                      Last visit: {patient.lastVisit}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DoctorPatients;
