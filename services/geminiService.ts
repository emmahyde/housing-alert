
import { GoogleGenAI, Type } from "@google/genai";
import { FilterCriteria, GeneratedListing } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const listingSchema = {
    type: Type.OBJECT,
    properties: {
        platform: {
            type: Type.STRING,
            description: 'The platform where the listing was found.',
            enum: ['Zillow', 'Redfin', 'Trulia', 'Craigslist']
        },
        title: {
            type: Type.STRING,
            description: 'A catchy, descriptive title for the listing, e.g., "Sunny 2BR with Modern Kitchen".'
        },
        address: {
            type: Type.STRING,
            description: 'A realistic-looking street address for the property.'
        },
        price: {
            type: Type.INTEGER,
            description: 'The monthly rental price.'
        },
        beds: {
            type: Type.NUMBER,
            description: 'The number of bedrooms.'
        },
        baths: {
            type: Type.NUMBER,
            description: 'The number of bathrooms.'
        },
        propertyType: {
            type: Type.STRING,
            description: 'The type of the property.',
            enum: ['Apartment', 'House', 'Condo', 'Townhouse']
        },
        amenities: {
            type: Type.ARRAY,
            description: 'A list of key amenities available.',
            items: {
                type: Type.STRING,
                enum: ['Pet-Friendly', 'Parking', 'In-Unit Laundry']
            }
        },
    },
    required: ['platform', 'title', 'address', 'price', 'beds', 'baths', 'propertyType', 'amenities']
};

export const generateListings = async (criteria: FilterCriteria): Promise<GeneratedListing[]> => {
    try {
        let prompt = `Generate a list of 5 new, unique apartment listings that have just been posted online. The user's criteria are: Location near ${criteria.location}, within a ${criteria.radius} mile radius, with a monthly budget between $${criteria.minBudget} and $${criteria.maxBudget}.`;
        
        if (criteria.propertyType !== 'Any') {
            prompt += ` The property type must be a ${criteria.propertyType}.`;
        }

        if (criteria.minBeds === 0) {
            prompt += ` The property can be a studio or have any number of bedrooms.`;
        } else {
            prompt += ` The property must have at least ${criteria.minBeds} bedroom(s).`;
        }

        if (criteria.minBaths > 0) {
            prompt += ` The property must have at least ${criteria.minBaths} bathroom(s).`;
        }

        if (criteria.amenities.length > 0) {
            prompt += ` It must include the following amenities: ${criteria.amenities.join(', ')}.`;
        }

        prompt += " The listings should appear to be from various platforms like Zillow, Craigslist, Redfin, and Trulia. Provide realistic and varied details for each property. Ensure prices are within the specified budget and all property constraints are strictly met.";


        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: listingSchema,
                },
            },
        });

        const jsonText = response.text.trim();
        const listings: GeneratedListing[] = JSON.parse(jsonText);
        return listings;

    } catch (error) {
        console.error("Error generating listings with Gemini API:", error);
        // Fallback to mock data on error
        return [
            { platform: 'Zillow', title: 'Charming Downtown Loft', address: '123 Main St, Anytown, USA', price: 2500, beds: 1, baths: 1, propertyType: 'Apartment', amenities: ['Parking'] },
            { platform: 'Redfin', title: 'Spacious Family Home', address: '456 Oak Ave, Anytown, USA', price: 4200, beds: 3, baths: 2.5, propertyType: 'House', amenities: ['Pet-Friendly', 'Parking', 'In-Unit Laundry'] }
        ];
    }
};
