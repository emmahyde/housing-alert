
import React from 'react';
import BuildingIcon from './icons/BuildingIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4">
      <div className="container mx-auto flex items-center">
        <BuildingIcon className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold ml-3 text-gray-800 dark:text-white">
          Real-Time Apartment Alerter
        </h1>
      </div>
    </header>
  );
};

export default Header;
