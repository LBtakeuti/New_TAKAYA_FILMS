import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            TAKAYA FILMS
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto px-4">
            Creating cinematic stories that captivate and inspire through professional video production
          </p>
          <div className="space-x-6">
            <Link
              to="/portfolio"
              className="inline-block bg-white text-black px-8 py-3 rounded-md font-semibold hover:bg-gray-200 transition-colors"
            >
              View Portfolio
            </Link>
            <Link
              to="/contact"
              className="inline-block border border-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-black transition-colors"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Placeholder for featured videos */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform">
                <div className="aspect-video bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400">Video Thumbnail</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Project Title {item}</h3>
                  <p className="text-gray-400 mb-4">Brief description of the video project...</p>
                  <span className="text-sm text-gray-500">Commercial</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/portfolio"
              className="inline-block bg-white text-black px-8 py-3 rounded-md font-semibold hover:bg-gray-200 transition-colors"
            >
              View All Work
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              'Commercial Videos',
              'Corporate Content',
              'Event Documentation',
              'Music Videos'
            ].map((service) => (
              <div key={service} className="text-center">
                <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-black font-bold">📹</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{service}</h3>
                <p className="text-gray-400">Professional video production services tailored to your needs.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;