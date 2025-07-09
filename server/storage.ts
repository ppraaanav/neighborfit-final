import { UserPreferences, Neighborhood, Match, InsertUserPreferences, InsertNeighborhood, InsertMatch } from '../shared/schema';
import { v4 as uuidv4 } from 'uuid';

export interface IStorage {
  // User preferences
  createUserPreferences(data: InsertUserPreferences): Promise<UserPreferences>;
  getUserPreferences(id: string): Promise<UserPreferences | null>;
  updateUserPreferences(id: string, data: Partial<InsertUserPreferences>): Promise<UserPreferences | null>;
  deleteUserPreferences(id: string): Promise<boolean>;
  
  // Neighborhoods
  createNeighborhood(data: InsertNeighborhood): Promise<Neighborhood>;
  getNeighborhood(id: string): Promise<Neighborhood | null>;
  getAllNeighborhoods(): Promise<Neighborhood[]>;
  searchNeighborhoods(query: { city?: string; state?: string; maxRent?: number }): Promise<Neighborhood[]>;
  
  // Matches
  createMatch(data: InsertMatch): Promise<Match>;
  getMatchesForUser(userId: string): Promise<Match[]>;
  getMatch(id: string): Promise<Match | null>;
  
  // Algorithm support
  findNeighborhoodsByBudget(minBudget: number, maxBudget: number): Promise<Neighborhood[]>;
  findNeighborhoodsByLifestyle(criteria: any): Promise<Neighborhood[]>;
}

export class MemStorage implements IStorage {
  private userPreferences: Map<string, UserPreferences> = new Map();
  private neighborhoods: Map<string, Neighborhood> = new Map();
  private matches: Map<string, Match> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed with some realistic neighborhood data
    const neighborhoods: Omit<Neighborhood, 'id' | 'lastUpdated'>[] = [
      {
        name: "Capitol Hill",
        city: "Seattle",
        state: "WA",
        zipCode: "98102",
        coordinates: { lat: 47.6205, lng: -122.3212 },
        demographics: {
          averageAge: 32,
          medianIncome: 85000,
          populationDensity: 12000,
          familyFriendly: 6
        },
        housing: {
          medianRent: 2200,
          medianHomePrices: 750000,
          averageRent1BR: 1800,
          averageRent2BR: 2400,
          averageRent3BR: 3200
        },
        lifestyle: {
          walkScore: 90,
          transitScore: 85,
          bikeScore: 75,
          crimeRate: 4,
          nightlifeScore: 9,
          outdoorScore: 7
        },
        amenities: ["restaurants", "bars", "coffee_shops", "parks", "grocery_stores", "gyms"],
        nearbyJobHubs: [
          { name: "Downtown Seattle", distance: 2.5, commuteTime: 15 },
          { name: "Amazon HQ", distance: 1.8, commuteTime: 12 },
          { name: "Microsoft Campus", distance: 12, commuteTime: 35 }
        ],
        dataSource: "manual_research"
      },
      {
        name: "Fremont",
        city: "Seattle",
        state: "WA",
        zipCode: "98103",
        coordinates: { lat: 47.6511, lng: -122.3501 },
        demographics: {
          averageAge: 35,
          medianIncome: 78000,
          populationDensity: 8500,
          familyFriendly: 8
        },
        housing: {
          medianRent: 1900,
          medianHomePrices: 680000,
          averageRent1BR: 1600,
          averageRent2BR: 2100,
          averageRent3BR: 2800
        },
        lifestyle: {
          walkScore: 75,
          transitScore: 65,
          bikeScore: 80,
          crimeRate: 2,
          nightlifeScore: 6,
          outdoorScore: 8
        },
        amenities: ["farmers_market", "parks", "coffee_shops", "bicycle_shops", "restaurants", "dog_parks"],
        nearbyJobHubs: [
          { name: "Downtown Seattle", distance: 4.2, commuteTime: 25 },
          { name: "University District", distance: 3.1, commuteTime: 20 },
          { name: "Ballard", distance: 2.8, commuteTime: 18 }
        ],
        dataSource: "manual_research"
      },
      {
        name: "Williamsburg",
        city: "Brooklyn",
        state: "NY",
        zipCode: "11211",
        coordinates: { lat: 40.7081, lng: -73.9571 },
        demographics: {
          averageAge: 29,
          medianIncome: 95000,
          populationDensity: 15000,
          familyFriendly: 5
        },
        housing: {
          medianRent: 3200,
          medianHomePrices: 950000,
          averageRent1BR: 2800,
          averageRent2BR: 3800,
          averageRent3BR: 5200
        },
        lifestyle: {
          walkScore: 88,
          transitScore: 90,
          bikeScore: 70,
          crimeRate: 5,
          nightlifeScore: 10,
          outdoorScore: 6
        },
        amenities: ["restaurants", "bars", "art_galleries", "music_venues", "coffee_shops", "boutiques"],
        nearbyJobHubs: [
          { name: "Manhattan Financial District", distance: 3.2, commuteTime: 20 },
          { name: "Midtown Manhattan", distance: 5.1, commuteTime: 30 },
          { name: "Brooklyn Tech Hub", distance: 2.0, commuteTime: 15 }
        ],
        dataSource: "manual_research"
      },
      {
        name: "Plano",
        city: "Plano",
        state: "TX",
        zipCode: "75023",
        coordinates: { lat: 33.0198, lng: -96.6989 },
        demographics: {
          averageAge: 42,
          medianIncome: 102000,
          populationDensity: 4200,
          familyFriendly: 9
        },
        housing: {
          medianRent: 1600,
          medianHomePrices: 485000,
          averageRent1BR: 1300,
          averageRent2BR: 1700,
          averageRent3BR: 2200
        },
        lifestyle: {
          walkScore: 45,
          transitScore: 35,
          bikeScore: 40,
          crimeRate: 1,
          nightlifeScore: 4,
          outdoorScore: 7
        },
        amenities: ["shopping_malls", "parks", "schools", "golf_courses", "restaurants", "libraries"],
        nearbyJobHubs: [
          { name: "Legacy West", distance: 3.2, commuteTime: 15 },
          { name: "Downtown Dallas", distance: 18, commuteTime: 40 },
          { name: "Frisco Business District", distance: 8, commuteTime: 20 }
        ],
        dataSource: "manual_research"
      },
      {
        name: "Mission District",
        city: "San Francisco",
        state: "CA",
        zipCode: "94110",
        coordinates: { lat: 37.7599, lng: -122.4148 },
        demographics: {
          averageAge: 31,
          medianIncome: 88000,
          populationDensity: 13500,
          familyFriendly: 6
        },
        housing: {
          medianRent: 3800,
          medianHomePrices: 1200000,
          averageRent1BR: 3200,
          averageRent2BR: 4500,
          averageRent3BR: 6200
        },
        lifestyle: {
          walkScore: 95,
          transitScore: 85,
          bikeScore: 80,
          crimeRate: 6,
          nightlifeScore: 9,
          outdoorScore: 8
        },
        amenities: ["restaurants", "bars", "street_art", "parks", "coffee_shops", "food_trucks"],
        nearbyJobHubs: [
          { name: "SOMA Tech District", distance: 2.8, commuteTime: 20 },
          { name: "Financial District", distance: 3.5, commuteTime: 25 },
          { name: "Silicon Valley", distance: 35, commuteTime: 60 }
        ],
        dataSource: "manual_research"
      }
    ];

    neighborhoods.forEach(neighborhood => {
      const id = uuidv4();
      const fullNeighborhood: Neighborhood = {
        ...neighborhood,
        id,
        lastUpdated: new Date()
      };
      this.neighborhoods.set(id, fullNeighborhood);
    });
  }

  async createUserPreferences(data: InsertUserPreferences): Promise<UserPreferences> {
    const id = uuidv4();
    const now = new Date();
    const userPreferences: UserPreferences = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.userPreferences.set(id, userPreferences);
    return userPreferences;
  }

  async getUserPreferences(id: string): Promise<UserPreferences | null> {
    return this.userPreferences.get(id) || null;
  }

  async updateUserPreferences(id: string, data: Partial<InsertUserPreferences>): Promise<UserPreferences | null> {
    const existing = this.userPreferences.get(id);
    if (!existing) return null;
    
    const updated: UserPreferences = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    this.userPreferences.set(id, updated);
    return updated;
  }

  async deleteUserPreferences(id: string): Promise<boolean> {
    return this.userPreferences.delete(id);
  }

  async createNeighborhood(data: InsertNeighborhood): Promise<Neighborhood> {
    const id = uuidv4();
    const neighborhood: Neighborhood = {
      ...data,
      id,
      lastUpdated: new Date(),
    };
    this.neighborhoods.set(id, neighborhood);
    return neighborhood;
  }

  async getNeighborhood(id: string): Promise<Neighborhood | null> {
    return this.neighborhoods.get(id) || null;
  }

  async getAllNeighborhoods(): Promise<Neighborhood[]> {
    return Array.from(this.neighborhoods.values());
  }

  async searchNeighborhoods(query: { city?: string; state?: string; maxRent?: number }): Promise<Neighborhood[]> {
    const allNeighborhoods = Array.from(this.neighborhoods.values());
    
    return allNeighborhoods.filter(neighborhood => {
      if (query.city && neighborhood.city.toLowerCase() !== query.city.toLowerCase()) {
        return false;
      }
      if (query.state && neighborhood.state.toLowerCase() !== query.state.toLowerCase()) {
        return false;
      }
      if (query.maxRent && neighborhood.housing.medianRent > query.maxRent) {
        return false;
      }
      return true;
    });
  }

  async createMatch(data: InsertMatch): Promise<Match> {
    const id = uuidv4();
    const match: Match = {
      ...data,
      id,
      createdAt: new Date(),
    };
    this.matches.set(id, match);
    return match;
  }

  async getMatchesForUser(userId: string): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(match => match.userId === userId);
  }

  async getMatch(id: string): Promise<Match | null> {
    return this.matches.get(id) || null;
  }

  async findNeighborhoodsByBudget(minBudget: number, maxBudget: number): Promise<Neighborhood[]> {
    const allNeighborhoods = Array.from(this.neighborhoods.values());
    
    return allNeighborhoods.filter(neighborhood => {
      return neighborhood.housing.medianRent >= minBudget && neighborhood.housing.medianRent <= maxBudget;
    });
  }

  async findNeighborhoodsByLifestyle(criteria: any): Promise<Neighborhood[]> {
    const allNeighborhoods = Array.from(this.neighborhoods.values());
    
    return allNeighborhoods.filter(neighborhood => {
      let matches = true;
      
      if (criteria.minWalkScore && neighborhood.lifestyle.walkScore < criteria.minWalkScore) {
        matches = false;
      }
      if (criteria.minTransitScore && neighborhood.lifestyle.transitScore < criteria.minTransitScore) {
        matches = false;
      }
      if (criteria.maxCrimeRate && neighborhood.lifestyle.crimeRate > criteria.maxCrimeRate) {
        matches = false;
      }
      if (criteria.minNightlifeScore && neighborhood.lifestyle.nightlifeScore < criteria.minNightlifeScore) {
        matches = false;
      }
      if (criteria.minOutdoorScore && neighborhood.lifestyle.outdoorScore < criteria.minOutdoorScore) {
        matches = false;
      }
      
      return matches;
    });
  }
}

export const storage = new MemStorage();