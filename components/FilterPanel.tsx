import React, { useState } from 'react';
import { FilterCriteria, PropertyType, Amenity } from '../types';
import DollarIcon from './icons/DollarIcon';
import LocationIcon from './icons/LocationIcon';
import RadiusIcon from './icons/RadiusIcon';
import BuildingIcon from './icons/BuildingIcon';
import ClockIcon from './icons/ClockIcon';
import BellIcon from './icons/BellIcon';
import EmailIcon from './icons/EmailIcon';


interface FilterPanelProps {
  onMonitorToggle: (criteria: FilterCriteria) => void;
  isMonitoring: boolean;
  isLoading: boolean;
}

const amenitiesOptions: Amenity[] = ['Pet-Friendly', 'Parking', 'In-Unit Laundry'];

const FilterPanel: React.FC<FilterPanelProps> = ({ onMonitorToggle, isMonitoring, isLoading }) => {
  const [criteria, setCriteria] = useState<FilterCriteria>({
    location: 'San Francisco, CA',
    radius: 5,
    minBudget: 2000,
    maxBudget: 4500,
    propertyType: 'Any',
    minBeds: 0,
    minBaths: 1,
    amenities: [],
    monitoringFrequency: 'Immediate',
    notificationMethod: 'App',
    emailAddress: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCriteria(prev => ({ ...prev, [name]: name.includes('Budget') || name.includes('radius') || name.includes('Beds') || name.includes('Baths') ? parseInt(value, 10) : value }));
  };
  
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCriteria(prev => ({ ...prev, [name]: value}));
  };

  const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const amenity = value as Amenity;
    setCriteria(prev => {
        const newAmenities = checked
            ? [...prev.amenities, amenity]
            : prev.amenities.filter(a => a !== amenity);
        return { ...prev, amenities: newAmenities };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(criteria.notificationMethod === 'Email' && !criteria.emailAddress) {
        alert('Please enter an email address for email notifications.');
        return;
    }
    onMonitorToggle(criteria);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Search Criteria</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Filters */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LocationIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" name="location" id="location" value={criteria.location} onChange={handleInputChange} disabled={isMonitoring || isLoading} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white disabled:opacity-50" placeholder="e.g., New York, NY" />
          </div>
        </div>
        <div>
          <label htmlFor="radius" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Radius ({criteria.radius} miles)</label>
          <div className="relative flex items-center">
             <RadiusIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input type="range" name="radius" id="radius" min="1" max="50" value={criteria.radius} onChange={handleInputChange} disabled={isMonitoring || isLoading} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 disabled:opacity-50" />
          </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget</label>
            <div className="flex items-center space-x-4">
                 <div className="relative flex-1">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <DollarIcon className="h-5 w-5 text-gray-400" /></div>
                    <input type="number" name="minBudget" value={criteria.minBudget} onChange={handleInputChange} disabled={isMonitoring || isLoading} className="w-full pl-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white disabled:opacity-50" step="100"/>
                 </div>
                 <span className="text-gray-500 dark:text-gray-400">-</span>
                 <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><DollarIcon className="h-5 w-5 text-gray-400" /></div>
                    <input type="number" name="maxBudget" value={criteria.maxBudget} onChange={handleInputChange} disabled={isMonitoring || isLoading} className="w-full pl-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white disabled:opacity-50" step="100"/>
                 </div>
            </div>
        </div>
        
        {/* Advanced Filters */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Advanced Filters</h3>
            <div>
                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Property Type</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><BuildingIcon className="h-5 w-5 text-gray-400" /></div>
                    <select name="propertyType" id="propertyType" value={criteria.propertyType} onChange={handleInputChange} disabled={isMonitoring || isLoading} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white disabled:opacity-50">
                        <option value="Any">Any</option>
                        <option value="Apartment">Apartment</option>
                        <option value="House">House</option>
                        <option value="Condo">Condo</option>
                        <option value="Townhouse">Townhouse</option>
                    </select>
                </div>
            </div>
            <div className="flex space-x-4">
                <div className="flex-1">
                    <label htmlFor="minBeds" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Beds</label>
                    <select name="minBeds" id="minBeds" value={criteria.minBeds} onChange={handleInputChange} disabled={isMonitoring || isLoading} className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white disabled:opacity-50">
                        <option value="0">Studio+</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label htmlFor="minBaths" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Baths</label>
                    <select name="minBaths" id="minBaths" value={criteria.minBaths} onChange={handleInputChange} disabled={isMonitoring || isLoading} className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white disabled:opacity-50">
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                    </select>
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amenities</label>
                <div className="space-y-2">
                    {amenitiesOptions.map(amenity => (
                         <div key={amenity} className="flex items-center">
                            <input
                                id={amenity}
                                name="amenities"
                                type="checkbox"
                                value={amenity}
                                checked={criteria.amenities.includes(amenity)}
                                onChange={handleAmenityChange}
                                disabled={isMonitoring || isLoading}
                                className="h-4 w-4 text-primary focus:ring-secondary border-gray-300 rounded disabled:opacity-50 dark:bg-gray-600 dark:border-gray-500"
                            />
                            <label htmlFor={amenity} className="ml-3 block text-sm text-gray-700 dark:text-gray-300">{amenity}</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Notification Settings */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Notification Settings</h3>
            <div>
                <label htmlFor="monitoringFrequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frequency</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><ClockIcon className="h-5 w-5 text-gray-400" /></div>
                    <select name="monitoringFrequency" id="monitoringFrequency" value={criteria.monitoringFrequency} onChange={handleInputChange} disabled={isMonitoring || isLoading} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white disabled:opacity-50">
                        <option value="Immediate">Immediate</option>
                        <option value="Daily">Daily Rollup</option>
                        <option value="Weekly">Weekly Rollup</option>
                    </select>
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Delivery Method</label>
                <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                        <input id="app-notification" name="notificationMethod" type="radio" value="App" checked={criteria.notificationMethod === 'App'} onChange={handleRadioChange} disabled={isMonitoring || isLoading} className="h-4 w-4 text-primary focus:ring-secondary border-gray-300 disabled:opacity-50" />
                        <label htmlFor="app-notification" className="ml-2 flex items-center text-sm text-gray-700 dark:text-gray-300"><BellIcon className="mr-1 h-4 w-4" /> App</label>
                    </div>
                    <div className="flex items-center">
                        <input id="email-notification" name="notificationMethod" type="radio" value="Email" checked={criteria.notificationMethod === 'Email'} onChange={handleRadioChange} disabled={isMonitoring || isLoading} className="h-4 w-4 text-primary focus:ring-secondary border-gray-300 disabled:opacity-50" />
                        <label htmlFor="email-notification" className="ml-2 flex items-center text-sm text-gray-700 dark:text-gray-300"><EmailIcon className="mr-1 h-4 w-4" /> Email</label>
                    </div>
                </div>
                {criteria.notificationMethod === 'Email' && (
                    <div className="relative mt-4">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <EmailIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="email" name="emailAddress" value={criteria.emailAddress} onChange={handleInputChange} disabled={isMonitoring || isLoading} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white disabled:opacity-50" placeholder="your.email@example.com" required />
                    </div>
                )}
            </div>
        </div>

        <button type="submit" disabled={isLoading} className={`w-full text-white font-bold py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center ${isMonitoring ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-blue-800'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {isLoading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Starting...</>) : isMonitoring ? ('Stop Monitoring') : ('Start Monitoring')}
        </button>
      </form>
    </div>
  );
};

export default FilterPanel;