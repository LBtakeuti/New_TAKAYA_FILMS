import React, { useState, useEffect } from 'react';
import { Video } from '../types';

const Portfolio: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVideos.map((video) => (
                <div key={video.id} className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform">
                  <div className="aspect-video bg-gray-700 flex items-center justify-center">
                    {video.thumbnail_url ? (
                      <img 
                        src={video.thumbnail_url} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">No Thumbnail</span>
                    )}
                  </div>
                  <div className="p-6">
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
    </div>
  );
};

export default Portfolio;