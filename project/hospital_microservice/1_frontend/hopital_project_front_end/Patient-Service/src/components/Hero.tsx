import { useState, useEffect } from 'react';

interface Article {
  title: string;
  link: string;
  description?: string | null;
  image?: string;
}

const Hero = () => {
  // Static data for reliable slider
  const articles: Article[] = [
    {
      title: 'Bệnh viện tổ chức khám bệnh miễn phí cho người cao tuổi',
      link: '#',
      description: 'Chương trình khám bệnh, tư vấn sức khỏe và cấp thuốc miễn phí cho hơn 500 người cao tuổi trên địa bàn...',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      title: 'Hội thảo khoa học: Ứng dụng AI trong chẩn đoán hình ảnh',
      link: '#',
      description: 'Bệnh viện vừa tổ chức thành công hội thảo khoa học với sự tham gia của các chuyên gia đầu ngành...',
      image: 'https://images.unsplash.com/photo-1576091160550-2187d80a5873?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      title: 'Lễ kỷ niệm 20 năm thành lập bệnh viện',
      link: '#',
      description: 'Chuỗi hoạt động chào mừng kỷ niệm 20 năm thành lập bệnh viện diễn ra sôi nổi với nhiều hoạt động ý nghĩa...',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      title: 'Triển khai kỹ thuật mổ nội soi mới',
      link: '#',
      description: 'Khoa Ngoại tổng hợp vừa triển khai thành công kỹ thuật mổ nội soi mới, giúp bệnh nhân phục hồi nhanh chóng...',
      image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      title: 'Triển khai hệ thống đặt lịch khám trực tuyến',
      link: '#',
      description: 'Giúp bệnh nhân chủ động thời gian, giảm thiểu thời gian chờ đợi tại bệnh viện.',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const currentArticle = articles[currentIndex];

  return (
    <div className="relative bg-white overflow-hidden h-[600px]">
      <div className="absolute inset-0">
        {articles.map((article, index) => (
          <img
            key={index}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            src={article.image}
            alt={article.title}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/40 mix-blend-multiply" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl mb-6 transition-all duration-500 transform translate-y-0 opacity-100">
            <span className="block text-blue-400 text-lg font-semibold uppercase tracking-wider mb-2">Tin tức nổi bật</span>
            {currentArticle.title}
          </h1>
          <p className="mt-4 text-xl text-gray-200 max-w-3xl transition-all duration-500 delay-100">
            {currentArticle.description}
          </p>
          <div className="mt-8 flex gap-4">
            <a
              href={currentArticle.link}
              target={currentArticle.link === '#' ? '_self' : '_blank'}
              rel="noreferrer"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors"
            >
              Đọc chi tiết
            </a>
            <div className="flex items-center gap-2 ml-4">
                {articles.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${
                            idx === currentIndex ? 'bg-blue-500 w-8' : 'bg-gray-400 hover:bg-gray-300'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
