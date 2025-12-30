import React, { useEffect, useState } from 'react';

interface Article {
  title: string;
  link: string;
  pubDate?: string | null;
  description?: string | null;
  image?: string | null;
}

const News = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'hospital'>('general');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for Hospital Activities
  const hospitalNews: Article[] = [
    {
      title: 'Bệnh viện tổ chức khám bệnh miễn phí cho người cao tuổi',
      link: '#',
      pubDate: 'Mon, 01 Dec 2025 08:00:00 GMT',
      description: 'Chương trình khám bệnh, tư vấn sức khỏe và cấp thuốc miễn phí cho hơn 500 người cao tuổi trên địa bàn...',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=500&q=60'
    },
    {
      title: 'Hội thảo khoa học: Ứng dụng AI trong chẩn đoán hình ảnh',
      link: '#',
      pubDate: 'Fri, 28 Nov 2025 14:30:00 GMT',
      description: 'Bệnh viện vừa tổ chức thành công hội thảo khoa học với sự tham gia của các chuyên gia đầu ngành...',
      image: 'https://images.unsplash.com/photo-1576091160550-2187d80a5873?auto=format&fit=crop&w=500&q=60'
    },
    {
      title: 'Lễ kỷ niệm 20 năm thành lập bệnh viện',
      link: '#',
      pubDate: 'Wed, 20 Nov 2025 09:00:00 GMT',
      description: 'Chuỗi hoạt động chào mừng kỷ niệm 20 năm thành lập bệnh viện diễn ra sôi nổi với nhiều hoạt động ý nghĩa...',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=500&q=60'
    },
    {
      title: 'Triển khai kỹ thuật mổ nội soi mới',
      link: '#',
      pubDate: 'Mon, 15 Nov 2025 10:00:00 GMT',
      description: 'Khoa Ngoại tổng hợp vừa triển khai thành công kỹ thuật mổ nội soi mới, giúp bệnh nhân phục hồi nhanh chóng...',
      image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=500&q=60'
    }
  ];

  useEffect(() => {
    if (activeTab === 'hospital') {
      setArticles(hospitalNews);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchRss = async () => {
      try {
        setLoading(true);
        setError(null);
        // VNExpress Health RSS
        const rssUrl = 'https://vnexpress.net/rss/suc-khoe.rss';
        const proxy = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(rssUrl);
        const res = await fetch(proxy);
        if (!res.ok) throw new Error('Network response was not ok');
        const text = await res.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'application/xml');
        const items = Array.from(xml.querySelectorAll('item')).slice(0, 12);

        const parsed: Article[] = items.map((item) => {
            const descriptionRaw = item.querySelector('description')?.textContent || '';
            // Extract image from description if possible (VNExpress usually puts img tag in description)
            const imgMatch = descriptionRaw.match(/src="([^"]+)"/);
            const image = imgMatch ? imgMatch[1] : null;
            // Clean description text
            const cleanDesc = descriptionRaw.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');

            return {
              title: item.querySelector('title')?.textContent || 'No title',
              link: item.querySelector('link')?.textContent || '#',
              pubDate: item.querySelector('pubDate')?.textContent || null,
              description: cleanDesc,
              image: image
            };
        });

        setArticles(parsed);
      } catch (err) {
        setError('Không thể tải tin tức. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchRss();
  }, [activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Tin tức & Sự kiện</h2>
        <p className="mt-2 text-gray-600">Cập nhật tin tức y tế mới nhất và các hoạt động của bệnh viện.</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'general'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Tin tức y học
          </button>
          <button
            onClick={() => setActiveTab('hospital')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'hospital'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Hoạt động bệnh viện
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-500">Đang tải tin tức...</p>
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((a, idx) => (
            <article key={idx} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 flex flex-col h-full">
              {a.image && (
                  <div className="h-48 overflow-hidden">
                      <img src={a.image} alt={a.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex-1">
                    <a href={a.link} target="_blank" rel="noreferrer" className="block text-lg font-bold text-gray-900 hover:text-blue-600 line-clamp-2 mb-2">
                        {a.title}
                    </a>
                    {a.pubDate && <div className="text-xs text-gray-400 mb-3 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        {new Date(a.pubDate).toLocaleDateString('vi-VN')}
                    </div>}
                    {a.description && (
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{a.description}</p>
                    )}
                </div>
                <div className="mt-auto pt-4 border-t border-gray-50">
                    <a href={a.link} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                        Đọc tiếp
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
