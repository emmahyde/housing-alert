import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import FilterPanel from './components/FilterPanel';
import ListingCard from './components/ListingCard';
import Loader from './components/Loader';
import Notification from './components/Notification';
import { Listing, FilterCriteria, GeneratedListing } from './types';
import { generateListings } from './services/geminiService';

const App: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("Set your criteria and start monitoring to find your next home!");
  const [notification, setNotification] = useState<string | null>(null);
  
  const monitoringInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentCriteria = useRef<FilterCriteria | null>(null);

  const notifyUser = (message: string) => {
      if (!currentCriteria.current) return;

      if(currentCriteria.current.notificationMethod === 'App') {
          setNotification(message);
      } else if (currentCriteria.current.notificationMethod === 'Email') {
          setStatusMessage(`${message} A summary has been sent to ${currentCriteria.current.emailAddress}.`);
      }
  };


  const fetchNewListings = useCallback(async () => {
    if (!currentCriteria.current) return;
    
    // For immediate monitoring, show a subtle search message. For rollups, this is the main message.
    if (currentCriteria.current.monitoringFrequency === 'Immediate') {
      setStatusMessage("Searching for new listings...");
    }

    try {
      const newGeneratedListings = await generateListings(currentCriteria.current);
      if (newGeneratedListings.length > 0) {
        const newListings: Listing[] = newGeneratedListings.map((l: GeneratedListing) => ({
          ...l,
          id: `${l.address}-${Date.now()}-${Math.random()}`,
          imageUrl: `https://picsum.photos/seed/${Math.random()}/400/300`,
          postedAt: new Date(),
        }));

        setListings(prev => [...newListings, ...prev]);
        const notificationMessage = `Found ${newListings.length} new listings!`;
        notifyUser(notificationMessage);
        
        // Update status only for immediate, as email message is handled in notifyUser
        if (currentCriteria.current.notificationMethod === 'App') {
            setStatusMessage(`${notificationMessage} Still monitoring...`);
        }

      } else {
         if (currentCriteria.current.monitoringFrequency === 'Immediate') {
            setStatusMessage("No new listings found. Still monitoring...");
         }
      }
    } catch (error) {
      console.error("Failed to fetch new listings:", error);
      setStatusMessage("Error fetching listings. Retrying shortly...");
    }
  }, []);

  const startMonitoring = async (criteria: FilterCriteria) => {
    setIsLoading(true);
    setIsMonitoring(true);
    setListings([]);
    setStatusMessage("Starting monitor... This may take a moment.");
    currentCriteria.current = criteria;

    await fetchNewListings();

    setIsLoading(false);

    if (monitoringInterval.current) clearInterval(monitoringInterval.current);
    
    if (criteria.monitoringFrequency === 'Immediate') {
        monitoringInterval.current = setInterval(fetchNewListings, 20000); // Check for new listings every 20 seconds
    } else {
        const frequencyText = criteria.monitoringFrequency === 'Daily' ? 'daily' : 'weekly';
        setStatusMessage(`Monitoring is active. You will receive ${frequencyText} rollups.`);
    }
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    if (monitoringInterval.current) {
      clearInterval(monitoringInterval.current);
      monitoringInterval.current = null;
    }
    currentCriteria.current = null;
    setStatusMessage("Monitoring stopped. Set new criteria to begin again.");
  };

  const handleMonitorToggle = (criteria: FilterCriteria) => {
    if (isMonitoring) {
      stopMonitoring();
    } else {
      startMonitoring(criteria);
    }
  };

  useEffect(() => {
    return () => {
      if (monitoringInterval.current) {
        clearInterval(monitoringInterval.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-light dark:bg-dark text-gray-900 dark:text-gray-100 font-sans">
      <Header />
      {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
      <main className="container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-8">
                <FilterPanel onMonitorToggle={handleMonitorToggle} isMonitoring={isMonitoring} isLoading={isLoading} />
            </div>
          </aside>
          
          <section className="lg:col-span-8 xl:col-span-9">
            {isLoading && <Loader message="Fetching initial listings..." />}
            
            {!isLoading && (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6 text-center">
                  <p className="text-gray-700 dark:text-gray-300">{statusMessage}</p>
              </div>
            )}

            {!isLoading && listings.length === 0 && !isMonitoring && (
                 <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Welcome to Apartment Alerter!</h2>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Your personalized feed of new rental listings will appear here once you start monitoring.</p>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;