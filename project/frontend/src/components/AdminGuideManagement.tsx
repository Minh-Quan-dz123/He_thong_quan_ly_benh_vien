import React, { useState, useEffect } from 'react';
import { Save, Eye, Edit3, BookOpen, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5080';
const ADMIN_API_BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL || `${API_BASE_URL}/admin`;

interface Guide {
  slug: string;
  title: string;
  content: string;
}

const AdminGuideManagement = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('process');
  const [editData, setEditData] = useState({ title: '', content: '' });
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${ADMIN_API_BASE_URL}/guides`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (response.ok) {
        const data = await response.json();
        setGuides(data);
        const current = data.find((g: Guide) => g.slug === selectedSlug);
        if (current) {
          setEditData({ title: current.title, content: current.content });
        }
      }
    } catch (error) {
      toast.error("Không thể tải danh sách hướng dẫn");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectGuide = (slug: string) => {
    setSelectedSlug(slug);
    const guide = guides.find(g => g.slug === slug);
    if (guide) {
      setEditData({ title: guide.title, content: guide.content });
    }
    setIsPreview(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${ADMIN_API_BASE_URL}/guides/${selectedSlug}`, {
        method: 'PUT',
        headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: `Bearer ${token}` } : {}),
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        toast.success("Đã lưu thay đổi thành công!");
        fetchGuides();
      } else {
        toast.error("Lỗi khi lưu thay đổi");
      }
    } catch (error) {
      toast.error("Lỗi kết nối server");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                Danh sách bài viết
              </h3>
            </div>
            <div className="p-2">
              {guides.map((guide) => (
                <button
                  key={guide.slug}
                  onClick={() => handleSelectGuide(guide.slug)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between group ${
                    selectedSlug === guide.slug
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {guide.title}
                  <ChevronRight className={`w-4 h-4 transition-transform ${selectedSlug === guide.slug ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Lưu ý:</strong> Nội dung hỗ trợ mã HTML. Hãy cẩn thận khi chỉnh sửa các thẻ div và class để giữ nguyên giao diện.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsPreview(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors ${
                    !isPreview ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Soạn thảo
                </button>
                <button
                  onClick={() => setIsPreview(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors ${
                    isPreview ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Xem trước
                </button>
              </div>
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-bold flex items-center transition-all shadow-sm hover:shadow-md"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Lưu thay đổi
              </button>
            </div>

            <div className="p-6">
              {!isPreview ? (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tiêu đề bài viết</label>
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium"
                      placeholder="Nhập tiêu đề..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nội dung (HTML)</label>
                    <textarea
                      value={editData.content}
                      onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                      className="w-full h-[500px] px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-mono text-sm leading-relaxed"
                      placeholder="Nhập mã HTML nội dung..."
                    />
                  </div>
                </div>
              ) : (
                <div className="animate-fadeIn">
                  <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-extrabold text-blue-800 mb-8 border-b pb-4">
                      {editData.title}
                    </h1>
                    <div 
                      className="guide-content prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: editData.content }} 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGuideManagement;
