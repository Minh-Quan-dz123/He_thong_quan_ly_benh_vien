import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, PhoneCall, Calendar, Search, Facebook, Youtube, ArrowRight } from 'lucide-react';

interface ContactProps {
  role?: 'patient' | 'doctor' | 'admin' | null;
}

const Contact = ({ role }: ContactProps) => {
  return (
    <footer id="contact" className="bg-blue-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Info */}
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-2 rounded-full">
                <svg className="w-12 h-12 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold leading-tight uppercase">Bệnh viện Đa khoa Quốc tế</h2>
                <p className="text-lg opacity-80 uppercase tracking-wider">International General Hospital</p>
              </div>
            </div>

            <div className="space-y-4 text-gray-100">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-1 text-blue-400" />
                <p><span className="font-bold">Địa chỉ:</span> 78 Đường Giải Phóng, Phường Phương Mai, Quận Đống Đa, Thành phố Hà Nội</p>
              </div>
              <div className="flex items-start space-x-3">
                <PhoneCall className="w-5 h-5 mt-1 text-blue-400" />
                <p><span className="font-bold">Tổng đài:</span> 1900.888.866</p>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 mt-1 text-blue-400" />
                <p><span className="font-bold">Hotline:</span> 096.985.1616</p>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 mt-1 text-blue-400" />
                <div>
                  <p className="font-bold">Lịch làm việc:</p>
                  <div className="mt-2 space-y-3 text-sm opacity-90">
                    <div>
                      <p className="font-semibold">Khoa Khám bệnh theo yêu cầu:</p>
                      <ul className="list-disc list-inside ml-2">
                        <li>Thứ 2 - Thứ 6: 06:00 - 20:00</li>
                        <li>Thứ 7 - Chủ nhật: 06:30 - 16:30</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold">Khoa Khám bệnh: Thứ 2 - Thứ 6</p>
                      <ul className="list-disc list-inside ml-2">
                        <li>Sáng: 07:00 - 12:00</li>
                        <li>Chiều: 13:30 - 16:30</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <p className="text-sm opacity-70 italic">
                Chịu trách nhiệm chính: Dr. Sarah Wilson - Giám đốc bệnh viện
              </p>
            </div>
          </div>

          {/* Right Column: Buttons & Social */}
          <div className="flex flex-col h-full justify-between space-y-12">
            <div className="space-y-4">
              <a href="tel:1900888866" className="flex items-center justify-between w-full px-8 py-4 border border-white/30 rounded-xl hover:bg-white/10 transition-all group">
                <div className="flex items-center space-x-4">
                  <PhoneCall className="w-6 h-6" />
                  <span className="text-xl font-bold">Gọi tổng đài</span>
                </div>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </a>

              {(role === 'patient' || !role) && (
                <>
                  <Link to="/appointment" className="flex items-center justify-between w-full px-8 py-4 border border-white/30 rounded-xl hover:bg-white/10 transition-all group">
                    <div className="flex items-center space-x-4">
                      <Calendar className="w-6 h-6" />
                      <span className="text-xl font-bold">Đặt lịch khám</span>
                    </div>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </Link>

                  <Link to="/records" className="flex items-center justify-between w-full px-8 py-4 border border-white/30 rounded-xl hover:bg-white/10 transition-all group">
                    <div className="flex items-center space-x-4">
                      <Search className="w-6 h-6" />
                      <span className="text-xl font-bold">Bệnh án</span>
                    </div>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Contact;
