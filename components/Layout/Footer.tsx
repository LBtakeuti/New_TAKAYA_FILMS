import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">TAKAYA FILMS</h3>
            <p className="text-gray-300">
              Professional film director specializing in cinematic storytelling and commercial production.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Commercial Production</li>
              <li>Corporate Films</li>
              <li>Event Documentation</li>
              <li>Short Films</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="space-y-2 text-gray-300">
              <p>Email: contact@takayafilms.com</p>
              <p>Phone: +81-90-xxxx-xxxx</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="hover:text-white transition-colors">
                  Instagram
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  YouTube
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Vimeo
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 TAKAYA FILMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;