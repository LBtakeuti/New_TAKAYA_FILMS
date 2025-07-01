import React, { useState, useEffect } from 'react';
import { Video } from '../types';
import VideoPlayerModal from '../components/VideoPlayerModal';

const Portfolio: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['all', 'commercial', 'corporate', 'music', 'event'];

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/videos');
      const data = await response.json();
      setVideos(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setLoading(false);
    }
  };

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category.toLowerCase() === selectedCategory);

  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const isLocalVideoFile = (url: string) => {
    return url.startsWith('/uploads/') && (url.includes('.mp4') || url.includes('.mov') || url.includes('.avi') || url.includes('.wmv'));
  };

  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=)([^&\n?#]+)/);
    if (youtubeMatch) return youtubeMatch[1];
    const youtubeShortMatch = url.match(/(?:youtu\.be\/)([^&\n?#]+)/);
    if (youtubeShortMatch) return youtubeShortMatch[1];
    const embedMatch = url.match(/(?:youtube\.com\/embed\/)([^&\n?#]+)/);
    if (embedMatch) return embedMatch[1];
    return null;
  };

  const getThumbnailUrl = (video: Video) => {
    if (video.thumbnail_url) {
      return video.thumbnail_url.startsWith('/uploads/') 
        ? `http://localhost:5001${video.thumbnail_url}` 
        : video.thumbnail_url;
    }
    
    if (isYouTubeUrl(video.video_url)) {
      const videoId = getYouTubeVideoId(video.video_url);
      if (videoId) {
        // 高品質なサムネイルを試し、失敗したらデフォルトにフォールバック
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    }
    
    return null;
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-center mb-8">Portfolio</h1>
          <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto">
            Explore our collection of cinematic works, from commercial productions to artistic endeavors.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-white text-black'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredVideos.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold mb-4">No videos available</h3>
              <p className="text-gray-400">Videos will be displayed here once they are uploaded through the admin panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <div 
                  key={video.id} 
                  className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="aspect-video bg-gray-900 relative group overflow-hidden">
                    {getThumbnailUrl(video) ? (
                      <>
                        <img 
                          src={getThumbnailUrl(video) || ''} 
                          alt={video.title}
                          className="w-full h-full object-cover block"
                          style={{ filter: 'none', WebkitFilter: 'none' }}
                          onLoad={(e) => {
                            e.currentTarget.style.filter = 'none';
                            e.currentTarget.style.webkitFilter = 'none';
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-16 h-16 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-800">
                          <span>No Thumbnail</span>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-16 h-16 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-3">{video.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
                        {video.category}
                      </span>
                      {video.client && (
                        <span className="text-sm text-gray-400">
                          {video.client}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Video Player Modal */}
      <VideoPlayerModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Portfolio;