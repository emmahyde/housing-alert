
import React from 'react';

const Loader: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary dark:border-secondary"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">{message}</p>
    </div>
  );
};

export default Loader;
