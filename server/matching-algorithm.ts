import { UserPreferences, Neighborhood, Match, InsertMatch } from '../shared/schema';
import { storage } from './storage';

export class NeighborhoodMatcher {
  
  /**
   * Core matching algorithm that evaluates neighborhood-user compatibility
   * Returns matches ranked by compatibility score
   */
  async findMatches(userPreferences: UserPreferences): Promise<Match[]> {
    const neighborhoods = await storage.getAllNeighborhoods();
    const matches: Match[] = [];

    for (const neighborhood of neighborhoods) {
      const matchData = await this.calculateMatch(userPreferences, neighborhood);
      if (matchData) {
        matches.push(matchData);
      }
    }

    // Sort by score (highest first)
    matches.sort((a, b) => b.score - a.score);
    
    // Return top 10 matches
    return matches.slice(0, 10);
  }

  /**
   * Calculate compatibility score between user preferences and neighborhood
   */
  private async calculateMatch(user: UserPreferences, neighborhood: Neighborhood): Promise<Match | null> {
    const factors = {
      budgetMatch: this.calculateBudgetMatch(user, neighborhood),
      lifestyleMatch: this.calculateLifestyleMatch(user, neighborhood),
      commuteMatch: this.calculateCommuteMatch(user, neighborhood),
      amenityMatch: this.calculateAmenityMatch(user, neighborhood),
      safetyMatch: this.calculateSafetyMatch(user, neighborhood),
    };

    // Weighted average of all factors
    const weights = {
      budgetMatch: 0.3,      // 30% - Budget is critical
      lifestyleMatch: 0.25,  // 25% - Lifestyle compatibility
      commuteMatch: 0.2,     // 20% - Commute importance
      amenityMatch: 0.15,    // 15% - Amenity preferences
      safetyMatch: 0.1,      // 10% - Safety baseline
    };

    const score = Object.entries(factors).reduce((total, [key, value]) => {
      return total + (value * weights[key as keyof typeof weights]);
    }, 0);

    const explanation = this.generateExplanation(factors, neighborhood);

    const matchData: InsertMatch = {
      userId: user.id,
      neighborhoodId: neighborhood.id,
      score: Math.round(score),
      factors,
      explanation,
    };

    return await storage.createMatch(matchData);
  }

  /**
   * Calculate budget compatibility (0-100)
   */
  private calculateBudgetMatch(user: UserPreferences, neighborhood: Neighborhood): number {
    const userBudget = user.budget;
    const rent = neighborhood.housing.medianRent;

    // Perfect match if within budget
    if (rent >= userBudget.min && rent <= userBudget.max) {
      return 100;
    }

    // Calculate how far outside budget
    if (rent < userBudget.min) {
      const difference = userBudget.min - rent;
      const tolerance = userBudget.min * 0.2; // 20% tolerance
      return Math.max(0, 100 - (difference / tolerance) * 50);
    }

    if (rent > userBudget.max) {
      const difference = rent - userBudget.max;
      const tolerance = userBudget.max * 0.3; // 30% tolerance for higher rent
      return Math.max(0, 100 - (difference / tolerance) * 100);
    }

    return 0;
  }

  /**
   * Calculate lifestyle compatibility (0-100)
   */
  private calculateLifestyleMatch(user: UserPreferences, neighborhood: Neighborhood): number {
    let score = 0;
    let factors = 0;

    // Walkability preference
    const walkabilityScore = this.mapPreferenceToScore(
      user.lifestyle.walkability,
      neighborhood.lifestyle.walkScore
    );
    score += walkabilityScore;
    factors++;

    // Public transport preference
    const transitScore = this.mapPreferenceToScore(
      user.lifestyle.publicTransport,
      neighborhood.lifestyle.transitScore
    );
    score += transitScore;
    factors++;

    // Nightlife preference
    const nightlifeScore = this.mapPreferenceToScore(
      user.lifestyle.nightLife,
      neighborhood.lifestyle.nightlifeScore * 10 // Convert to 0-100 scale
    );
    score += nightlifeScore;
    factors++;

    // Outdoor activities preference
    const outdoorScore = this.mapPreferenceToScore(
      user.lifestyle.outdoorActivities,
      neighborhood.lifestyle.outdoorScore * 10 // Convert to 0-100 scale
    );
    score += outdoorScore;
    factors++;

    // Family-friendly considerations
    if (user.lifestyle.hasChildren) {
      score += neighborhood.demographics.familyFriendly * 10;
      factors++;
    }

    return factors > 0 ? score / factors : 0;
  }

  /**
   * Map user preference level to neighborhood score
   */
  private mapPreferenceToScore(preference: 'low' | 'moderate' | 'high' | 'unnecessary' | 'preferred' | 'required', neighborhoodScore: number): number {
    switch (preference) {
      case 'low':
      case 'unnecessary':
        return neighborhoodScore < 40 ? 100 : Math.max(0, 100 - (neighborhoodScore - 40) * 1.5);
      case 'moderate':
      case 'preferred':
        return neighborhoodScore >= 40 && neighborhoodScore <= 80 ? 100 : Math.max(0, 100 - Math.abs(neighborhoodScore - 60) * 2);
      case 'high':
      case 'required':
        return neighborhoodScore > 70 ? 100 : Math.max(0, neighborhoodScore * 1.4);
      default:
        return 50;
    }
  }

  /**
   * Calculate commute compatibility (0-100)
   */
  private calculateCommuteMatch(user: UserPreferences, neighborhood: Neighborhood): number {
    const maxCommute = user.preferences.maxCommute;
    
    // Find shortest commute time to major job hubs
    const shortestCommute = Math.min(...neighborhood.nearbyJobHubs.map(hub => hub.commuteTime));
    
    if (shortestCommute <= maxCommute) {
      return 100;
    }

    // Penalty for longer commute
    const penalty = (shortestCommute - maxCommute) / maxCommute;
    return Math.max(0, 100 - penalty * 100);
  }

  /**
   * Calculate amenity match (0-100)
   */
  private calculateAmenityMatch(user: UserPreferences, neighborhood: Neighborhood): number {
    const userAmenities = user.preferences.amenities;
    const neighborhoodAmenities = neighborhood.amenities;

    if (userAmenities.length === 0) return 100;

    const matchingAmenities = userAmenities.filter(amenity => 
      neighborhoodAmenities.includes(amenity)
    );

    return (matchingAmenities.length / userAmenities.length) * 100;
  }

  /**
   * Calculate safety match (0-100)
   */
  private calculateSafetyMatch(user: UserPreferences, neighborhood: Neighborhood): number {
    const crimeRate = neighborhood.lifestyle.crimeRate;
    
    switch (user.lifestyle.safetyPriority) {
      case 'high':
        return crimeRate <= 2 ? 100 : Math.max(0, 100 - (crimeRate - 2) * 25);
      case 'moderate':
        return crimeRate <= 5 ? 100 : Math.max(0, 100 - (crimeRate - 5) * 20);
      case 'low':
        return crimeRate <= 8 ? 100 : Math.max(0, 100 - (crimeRate - 8) * 15);
      default:
        return 50;
    }
  }

  /**
   * Generate human-readable explanation for the match
   */
  private generateExplanation(factors: any, neighborhood: Neighborhood): string {
    const explanations = [];

    if (factors.budgetMatch > 80) {
      explanations.push(`Great budget fit with median rent of $${neighborhood.housing.medianRent.toLocaleString()}`);
    } else if (factors.budgetMatch > 60) {
      explanations.push(`Decent budget match with median rent of $${neighborhood.housing.medianRent.toLocaleString()}`);
    } else {
      explanations.push(`Budget stretch with median rent of $${neighborhood.housing.medianRent.toLocaleString()}`);
    }

    if (factors.lifestyleMatch > 80) {
      explanations.push(`Excellent lifestyle match`);
    } else if (factors.lifestyleMatch > 60) {
      explanations.push(`Good lifestyle compatibility`);
    }

    if (factors.commuteMatch > 80) {
      explanations.push(`Convenient commute options`);
    } else if (factors.commuteMatch < 50) {
      explanations.push(`Longer commute times`);
    }

    if (factors.safetyMatch > 80) {
      explanations.push(`Low crime area`);
    }

    if (neighborhood.lifestyle.walkScore > 80) {
      explanations.push(`Very walkable neighborhood`);
    }

    return explanations.join('. ') + '.';
  }
}

export const matcher = new NeighborhoodMatcher();