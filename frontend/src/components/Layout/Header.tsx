import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-white' : 'text-gray-300 hover:text-white';
  };

  return (
    <header className="bg-black shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-white">
              TAKAYA FILMS
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`${isActive('/')} transition-colors duration-200`}
            >
              Home
            </Link>
            <Link
              to="/portfolio"
              className={`${isActive('/portfolio')} transition-colors duration-200`}
            >
              Portfolio
            </Link>
            <Link
              to="/about"
              className={`${isActive('/about')} transition-colors duration-200`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`${isActive('/contact')} transition-colors duration-200`}
            >
              Contact
            </Link>
            <Link
              to="/admin"
              className={`${isActive('/admin')} transition-colors duration-200 ml-8 px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700`}
            >
              Admin
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;