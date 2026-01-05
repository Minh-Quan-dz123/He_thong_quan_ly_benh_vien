import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5080';
const ADMIN_API_BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL || `${API_BASE_URL}/admin`;

const PatientGuide = () => {
  const { section } = useParams<{ section: string }>();
  const [guide, setGuide] = useState<{ title: string, content: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${ADMIN_API_BASE_URL}/guides/${section}`);
        if (response.ok) {
          const data = await response.json();
          setGuide(data);
        }
      } catch (error) {
        console.error("Error fetching guide:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuide();
  }, [section]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy nội dung</h2>
        <Link to="/" className="text-blue-600 hover:underline">Quay lại trang chủ</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">Hướng dẫn bệnh nhân</span>
          <span className="mx-2">›</span>
          <span className="text-blue-600 font-medium">
            {guide.title}
          </span>
        </nav>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="animate-fadeIn">
            <h1 className="text-3xl font-extrabold text-blue-800 mb-8 border-b pb-4">
              {guide.title}
            </h1>
            
            <div 
              className="guide-content"
              dangerouslySetInnerHTML={{ __html: guide.content }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientGuide;
