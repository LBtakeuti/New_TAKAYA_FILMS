import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Profile } from '../../types';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    videos: 0,
    profileUpdated: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        navigate('/admin/login');
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      // Load dashboard stats here
    } catch (error) {
      console.error('Error loading user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">📹</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">
                        Total Videos
                      </dt>
                      <dd className="text-lg font-medium text-white">
                        {stats.videos}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">👤</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">
                        Profile Status
                      </dt>
                      <dd className="text-lg font-medium text-white">
                        {stats.profileUpdated ? 'Updated' : 'Needs Update'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-lg font-medium text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button
              onClick={() => navigate('/admin/videos/new')}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors"
            >
              <div className="text-2xl mb-2">📹</div>
              <div className="font-medium">Add New Video</div>
            </button>

            <button
              onClick={() => navigate('/admin/videos')}
              className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg text-center transition-colors"
            >
              <div className="text-2xl mb-2">📝</div>
              <div className="font-medium">Manage Videos</div>
            </button>

            <button
              onClick={() => navigate('/admin/profile')}
              className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center transition-colors"
            >
              <div className="text-2xl mb-2">👤</div>
              <div className="font-medium">Edit Profile</div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-lg font-medium text-white mb-4">Recent Activity</h2>
          <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:p-6">
              <p className="text-gray-400 text-center">
                No recent activity to display.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;