export type Platform = 'Zillow' | 'Redfin' | 'Trulia' | 'Craigslist';
export type PropertyType = 'Apartment' | 'House' | 'Condo' | 'Townhouse';
export type Amenity = 'Pet-Friendly' | 'Parking' | 'In-Unit Laundry';
export type MonitoringFrequency = 'Immediate' | 'Daily' | 'Weekly';
export type NotificationMethod = 'App' | 'Email';


export interface Listing {
  id: string;
  platform: Platform;
  title: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  imageUrl: string;
  postedAt: Date;
  propertyType: PropertyType;
  amenities: Amenity[];
}

export interface FilterCriteria {
  location: string;
  radius: number;
  minBudget: number;
  maxBudget: number;
  propertyType: PropertyType | 'Any';
  minBeds: number; // 0 for Studio/Any
  minBaths: number; // 0 for Any
  amenities: Amenity[];
  monitoringFrequency: MonitoringFrequency;
  notificationMethod: NotificationMethod;
  emailAddress?: string;
}

export interface GeneratedListing {
    platform: Platform;
    title: string;
    address: string;
    price: number;
    beds: number;
    baths: number;
    propertyType: PropertyType;
    amenities: Amenity[];
}