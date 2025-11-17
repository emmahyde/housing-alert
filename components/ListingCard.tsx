
import React from 'react';
import { Listing, Platform, Amenity } from '../types';
import PetIcon from './icons/PetIcon';
import ParkingIcon from './icons/ParkingIcon';
import LaundryIcon from './icons/LaundryIcon';

interface ListingCardProps {
  listing: Listing;
}

const platformColors: Record<Platform, string> = {
  Zillow: 'bg-blue-500 text-white',
  Redfin: 'bg-red-500 text-white',
  Trulia: 'bg-green-500 text-white',
  Craigslist: 'bg-purple-500 text-white',
};

const amenityIcons: Record<Amenity, React.ReactElement> = {
  'Pet-Friendly': <PetIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" title="Pet-Friendly" />,
  'Parking': <ParkingIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" title="Parking Available" />,
  'In-Unit Laundry': <LaundryIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" title="In-Unit Laundry" />,
};


const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 5) return 'Just now';
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours} hour${hours > 1 ? 's' : ''} ago`;
};

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const [timeAgo, setTimeAgo] = React.useState(formatTimeAgo(listing.postedAt));

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(formatTimeAgo(listing.postedAt));
    }, 5000);
    return () => clearInterval(interval);
  }, [listing.postedAt]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 animate-fade-in flex flex-col">
      <img className="w-full h-48 object-cover" src={listing.imageUrl} alt={listing.title} />
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{listing.title}</h3>
            <div className="flex-shrink-0 ml-2 text-right">
                <span className={`block px-2 py-1 text-xs font-semibold rounded ${platformColors[listing.platform]}`}>
                    {listing.platform}
                </span>
                <span className="mt-1 block px-2 py-1 text-xs font-semibold rounded bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200">
                    {listing.propertyType}
                </span>
            </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{listing.address}</p>
        
        {listing.amenities.length > 0 && (
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 my-3">
                {listing.amenities.map(amenity => (
                    <div key={amenity} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        {amenityIcons[amenity]}
                        <span className="ml-1.5">{amenity}</span>
                    </div>
                ))}
            </div>
        )}

        <div className="mt-auto flex justify-between items-center text-gray-800 dark:text-gray-200">
          <span className="text-2xl font-bold text-primary dark:text-secondary">${listing.price.toLocaleString()}/mo</span>
          <div className="text-right">
            <p className="font-semibold">{listing.beds} bd | {listing.baths} ba</p>
          </div>
        </div>
      </div>
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <p className="text-xs text-gray-500 dark:text-gray-400">Posted: {timeAgo}</p>
      </div>
    </div>
  );
};

export default ListingCard;
