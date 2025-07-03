import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  }[type];

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 animate-slide-in`}>
      <span className="text-2xl mr-3">{icon}</span>
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default Toast;