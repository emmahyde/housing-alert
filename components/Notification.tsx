import React from 'react';

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Automatically close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      role="alert"
      className="fixed top-8 right-8 z-50 bg-secondary text-white py-3 px-6 rounded-lg shadow-xl transform transition-transform duration-300 ease-out animate-slide-in"
      style={{ animation: 'slideIn 0.5s ease-out forwards' }}
    >
      <div className="flex items-center justify-between">
        <p className="font-medium">{message}</p>
        <button 
          onClick={onClose} 
          aria-label="Close notification"
          className="ml-4 -mr-2 p-1 text-white hover:bg-blue-400 rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default Notification;