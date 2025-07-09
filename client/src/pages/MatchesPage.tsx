import { useEffect, useState } from 'react';
import { useParams, Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { MapPin, ArrowRight, Star, DollarSign, Clock, Shield, Zap, Home, Car, Users } from 'lucide-react';
import { Match, Neighborhood, UserPreferences } from '../../../shared/schema';
import { toast } from '../components/ui/toaster';

const MatchesPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Map<string, Neighborhood>>(new Map());
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['/api/user-preferences', userId],
    queryFn: async () => {
      const response = await fetch(`/api/user-preferences/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user preferences');
      return response.json();
    },
    enabled: !!userId,
  });

  const generateMatches = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('Failed to generate matches');
      return response.json();
    },
    onSuccess: (data) => {
      setMatches(data);
      toast.success('Matches generated successfully!');
      
      // Fetch neighborhood details for each match
      data.forEach(async (match: Match) => {
        try {
          const response = await fetch(`/api/neighborhoods/${match.neighborhoodId}`);
          if (response.ok) {
            const neighborhood = await response.json();
            setNeighborhoods(prev => new Map(prev.set(match.neighborhoodId, neighborhood)));
          }
        } catch (error) {
          console.error('Error fetching neighborhood:', error);
        }
      });
    },
    onError: (error) => {
      toast.error('Failed to generate matches', error.message);
    },
  });

  useEffect(() => {
    if (userData) {
      setUserPreferences(userData);
      generateMatches.mutate(userId!);
    }
  }, [userData, userId]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'score-badge';
    if (score >= 60) return 'score-badge medium';
    return 'score-badge low';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  if (userLoading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!userPreferences) {
    return (
      <div className="container">
        <div className="card text-center">
          <h2 className="text-2xl font-bold mb-4">User not found</h2>
          <p className="mb-4" style={{ color: 'var(--gray-600)' }}>
            The user preferences you're looking for don't exist.
          </p>
          <Link href="/preferences" className="btn btn-primary">
            Create New Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="card mb-6">
        <div className="card-header">
          <h1 className="card-title text-3xl">
            Perfect Matches for {userPreferences.name}
          </h1>
          <p className="card-subtitle text-lg">
            Based on your preferences, we found {matches.length} neighborhoods that match your lifestyle
          </p>
        </div>
        
        {/* User Summary */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
              ${userPreferences.budget.min.toLocaleString()} - ${userPreferences.budget.max.toLocaleString()}
            </div>
            <div className="text-sm" style={{ color: 'var(--gray-600)' }}>Monthly Budget</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
              {userPreferences.preferences.maxCommute} min
            </div>
            <div className="text-sm" style={{ color: 'var(--gray-600)' }}>Max Commute</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
              {userPreferences.lifestyle.safetyPriority}
            </div>
            <div className="text-sm" style={{ color: 'var(--gray-600)' }}>Safety Priority</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
              {userPreferences.preferences.neighborhoodTypes.join(', ')}
            </div>
            <div className="text-sm" style={{ color: 'var(--gray-600)' }}>Preferred Types</div>
          </div>
        </div>

        {generateMatches.isPending && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p className="mt-4">Generating your perfect matches...</p>
          </div>
        )}
      </div>

      {/* Matches */}
      {matches.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          {matches.map((match) => {
            const neighborhood = neighborhoods.get(match.neighborhoodId);
            return (
              <div key={match.id} className="match-card">
                <div className="match-header">
                  <div>
                    <h3 className="match-title">
                      {neighborhood?.name || 'Loading...'}
                    </h3>
                    <p className="flex items-center gap-1 text-sm" style={{ color: 'var(--gray-600)' }}>
                      <MapPin style={{ width: '0.875rem', height: '0.875rem' }} />
                      {neighborhood?.city}, {neighborhood?.state}
                    </p>
                  </div>
                  <div className={getScoreColor(match.score)}>
                    <Star style={{ width: '1rem', height: '1rem' }} />
                    {Math.round(match.score)}% Match
                  </div>
                </div>

                {neighborhood && (
                  <div className="match-details">
                    <div className="match-detail">
                      <div className="match-detail-icon">
                        <DollarSign style={{ width: '1.5rem', height: '1.5rem' }} />
                      </div>
                      <div className="match-detail-value">${neighborhood.avgRent.toLocaleString()}</div>
                      <div className="match-detail-label">Avg Rent</div>
                    </div>
                    <div className="match-detail">
                      <div className="match-detail-icon">
                        <Car style={{ width: '1.5rem', height: '1.5rem' }} />
                      </div>
                      <div className="match-detail-value">{neighborhood.commuteTime} min</div>
                      <div className="match-detail-label">Commute</div>
                    </div>
                    <div className="match-detail">
                      <div className="match-detail-icon">
                        <Shield style={{ width: '1.5rem', height: '1.5rem' }} />
                      </div>
                      <div className="match-detail-value">{neighborhood.safetyScore}/10</div>
                      <div className="match-detail-label">Safety</div>
                    </div>
                    <div className="match-detail">
                      <div className="match-detail-icon">
                        <Users style={{ width: '1.5rem', height: '1.5rem' }} />
                      </div>
                      <div className="match-detail-value">{neighborhood.walkabilityScore}/10</div>
                      <div className="match-detail-label">Walkability</div>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Why this matches you:</h4>
                  <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                    {match.explanation}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm" style={{ color: 'var(--gray-500)' }}>
                    Match Score: {getScoreLabel(match.score)}
                  </div>
                  <Link 
                    href={`/neighborhoods/${match.neighborhoodId}`}
                    className="btn btn-primary"
                  >
                    View Details
                    <ArrowRight style={{ width: '1rem', height: '1rem' }} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {matches.length === 0 && !generateMatches.isPending && (
        <div className="card text-center">
          <Zap style={{ width: '3rem', height: '3rem', color: 'var(--primary)', margin: '0 auto 1rem' }} />
          <h2 className="text-2xl font-bold mb-4">No matches found</h2>
          <p className="mb-4" style={{ color: 'var(--gray-600)' }}>
            We couldn't find any neighborhoods matching your criteria. Try adjusting your preferences.
          </p>
          <Link href="/preferences" className="btn btn-primary">
            Update Preferences
          </Link>
        </div>
      )}
    </div>
  );
};

export default MatchesPage;