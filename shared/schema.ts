import { z } from 'zod';

// User preferences schema
export const userPreferencesSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  age: z.number().min(18, 'Must be at least 18 years old').max(100),
  budget: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }),
  lifestyle: z.object({
    workFromHome: z.boolean(),
    hasChildren: z.boolean(),
    hasPets: z.boolean(),
    nightLife: z.enum(['low', 'moderate', 'high']),
    outdoorActivities: z.enum(['low', 'moderate', 'high']),
    publicTransport: z.enum(['unnecessary', 'preferred', 'required']),
    walkability: z.enum(['low', 'moderate', 'high']),
    safetyPriority: z.enum(['low', 'moderate', 'high']),
  }),
  preferences: z.object({
    maxCommute: z.number().min(0), // in minutes
    neighborhoodTypes: z.array(z.enum(['urban', 'suburban', 'rural'])),
    amenities: z.array(z.string()),
    dealBreakers: z.array(z.string()),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Neighborhood data schema
export const neighborhoodSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  demographics: z.object({
    averageAge: z.number(),
    medianIncome: z.number(),
    populationDensity: z.number(),
    familyFriendly: z.number().min(0).max(10), // 0-10 scale
  }),
  housing: z.object({
    medianRent: z.number(),
    medianHomePrices: z.number(),
    averageRent1BR: z.number(),
    averageRent2BR: z.number(),
    averageRent3BR: z.number(),
  }),
  lifestyle: z.object({
    walkScore: z.number().min(0).max(100),
    transitScore: z.number().min(0).max(100),
    bikeScore: z.number().min(0).max(100),
    crimeRate: z.number().min(0).max(10), // 0-10 scale, lower is better
    nightlifeScore: z.number().min(0).max(10),
    outdoorScore: z.number().min(0).max(10),
  }),
  amenities: z.array(z.string()),
  nearbyJobHubs: z.array(z.object({
    name: z.string(),
    distance: z.number(), // in miles
    commuteTime: z.number(), // in minutes
  })),
  dataSource: z.string(),
  lastUpdated: z.date(),
});

// Matching result schema
export const matchSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  neighborhoodId: z.string().uuid(),
  score: z.number().min(0).max(100),
  factors: z.object({
    budgetMatch: z.number().min(0).max(100),
    lifestyleMatch: z.number().min(0).max(100),
    commuteMatch: z.number().min(0).max(100),
    amenityMatch: z.number().min(0).max(100),
    safetyMatch: z.number().min(0).max(100),
  }),
  explanation: z.string(),
  createdAt: z.date(),
});

// Insert schemas using drizzle-zod
export const insertUserPreferencesSchema = userPreferencesSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertNeighborhoodSchema = neighborhoodSchema.omit({ 
  id: true, 
  lastUpdated: true 
});

export const insertMatchSchema = matchSchema.omit({ 
  id: true, 
  createdAt: true 
});

// Types
export type UserPreferences = z.infer<typeof userPreferencesSchema>;
export type Neighborhood = z.infer<typeof neighborhoodSchema>;
export type Match = z.infer<typeof matchSchema>;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type InsertNeighborhood = z.infer<typeof insertNeighborhoodSchema>;
export type InsertMatch = z.infer<typeof insertMatchSchema>;