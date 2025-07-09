import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { MapPin, ArrowLeft, DollarSign, Users, Shield, Car, Home, Star, TrendingUp, Clock } from 'lucide-react';
import { Neighborhood } from '../../../shared/schema';

const NeighborhoodPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: neighborhood, isLoading, error } = useQuery({
    queryKey: ['/api/neighborhoods', id],
    queryFn: async () => {
      const response = await fetch(`/api/neighborhoods/${id}`);
      if (!response.ok) throw new Error('Failed to fetch neighborhood');
      return response.json();
    },
    enabled: !!id,
  });

  const { data: allNeighborhoods } = useQuery({
    queryKey: ['/api/neighborhoods'],
    queryFn: async () => {
      const response = await fetch('/api/neighborhoods');
      if (!response.ok) throw new Error('Failed to fetch neighborhoods');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error || !neighborhood) {
    return (
      <div className="container">
        <div className="card text-center">
          <h2 className="text-2xl font-bold mb-4">Neighborhood not found</h2>
          <p className="mb-4" style={{ color: 'var(--gray-600)' }}>
            The neighborhood you're looking for doesn't exist.
          </p>
          <Link href="/neighborhoods" className="btn btn-primary">
            Browse All Neighborhoods
          </Link>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'var(--success)';
    if (score >= 6) return 'var(--warning)';
    return 'var(--error)';
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="mb-6">
        <Link href="/neighborhoods" className="btn btn-secondary mb-4 inline-flex items-center gap-2">
          <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
          Back to Neighborhoods
        </Link>
        
        <div className="card">
          <div className="card-header">
            <h1 className="card-title text-4xl flex items-center gap-3">
              <MapPin style={{ width: '2.5rem', height: '2.5rem', color: 'var(--primary)' }} />
              {neighborhood.name}
            </h1>
            <p className="card-subtitle text-xl">
              {neighborhood.city}, {neighborhood.state} • {neighborhood.type} neighborhood
            </p>
          </div>
          
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                {formatCurrency(neighborhood.avgRent)}
              </div>
              <div className="text-sm" style={{ color: 'var(--gray-600)' }}>Average Rent</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                {formatCurrency(neighborhood.avgHomePrice)}
              </div>
              <div className="text-sm" style={{ color: 'var(--gray-600)' }}>Average Home Price</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: getScoreColor(neighborhood.safetyScore) }}>
                {neighborhood.safetyScore}/10
              </div>
              <div className="text-sm" style={{ color: 'var(--gray-600)' }}>Safety Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: getScoreColor(neighborhood.walkabilityScore) }}>
                {neighborhood.walkabilityScore}/10
              </div>
              <div className="text-sm" style={{ color: 'var(--gray-600)' }}>Walkability</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Lifestyle Scores */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title flex items-center gap-2">
              <Star style={{ width: '1.5rem', height: '1.5rem', color: 'var(--primary)' }} />
              Lifestyle Scores
            </h2>
            <p className="card-subtitle">Quality of life indicators</p>
          </div>
          
          <div className="grid gap-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Nightlife</span>
              <div className="flex items-center gap-2">
                <div className="progress-bar" style={{ width: '100px' }}>
                  <div 
                    className="progress-fill" 
                    style={{ width: `${neighborhood.nightlifeScore * 10}%` }}
                  ></div>
                </div>
                <span className="font-bold" style={{ color: getScoreColor(neighborhood.nightlifeScore) }}>
                  {neighborhood.nightlifeScore}/10
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Outdoor Activities</span>
              <div className="flex items-center gap-2">
                <div className="progress-bar" style={{ width: '100px' }}>
                  <div 
                    className="progress-fill" 
                    style={{ width: `${neighborhood.outdoorScore * 10}%` }}
                  ></div>
                </div>
                <span className="font-bold" style={{ color: getScoreColor(neighborhood.outdoorScore) }}>
                  {neighborhood.outdoorScore}/10
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Public Transit</span>
              <div className="flex items-center gap-2">
                <div className="progress-bar" style={{ width: '100px' }}>
                  <div 
                    className="progress-fill" 
                    style={{ width: `${neighborhood.transitScore * 10}%` }}
                  ></div>
                </div>
                <span className="font-bold" style={{ color: getScoreColor(neighborhood.transitScore) }}>
                  {neighborhood.transitScore}/10
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Facts */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title flex items-center gap-2">
              <Home style={{ width: '1.5rem', height: '1.5rem', color: 'var(--primary)' }} />
              Quick Facts
            </h2>
            <p className="card-subtitle">Essential neighborhood information</p>
          </div>
          
          <div className="grid gap-4">
            <div className="flex justify-between items-center">
              <span className="font-medium flex items-center gap-2">
                <Clock style={{ width: '1rem', height: '1rem' }} />
                Commute Time
              </span>
              <span className="font-bold">{neighborhood.commuteTime} min</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium flex items-center gap-2">
                <Users style={{ width: '1rem', height: '1rem' }} />
                Population
              </span>
              <span className="font-bold">{neighborhood.population?.toLocaleString() || 'N/A'}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium flex items-center gap-2">
                <Car style={{ width: '1rem', height: '1rem' }} />
                Parking
              </span>
              <span className="font-bold">{neighborhood.parkingAvailability || 'Available'}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Neighborhood Type</span>
              <span className="font-bold capitalize">{neighborhood.type}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {neighborhood.description && (
        <div className="card mt-6">
          <div className="card-header">
            <h2 className="card-title">About {neighborhood.name}</h2>
          </div>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--gray-700)' }}>
            {neighborhood.description}
          </p>
        </div>
      )}

      {/* Amenities */}
      {neighborhood.amenities && neighborhood.amenities.length > 0 && (
        <div className="card mt-6">
          <div className="card-header">
            <h2 className="card-title">Available Amenities</h2>
            <p className="card-subtitle">What you'll find in this neighborhood</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {neighborhood.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'var(--gray-50)' }}>
                <div 
                  style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: 'var(--primary)' 
                  }}
                ></div>
                <span className="font-medium capitalize">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar Neighborhoods */}
      {allNeighborhoods && (
        <div className="card mt-6">
          <div className="card-header">
            <h2 className="card-title">Similar Neighborhoods</h2>
            <p className="card-subtitle">You might also like these areas</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {allNeighborhoods
              .filter((n: Neighborhood) => n.id !== neighborhood.id && n.city === neighborhood.city)
              .slice(0, 3)
              .map((n: Neighborhood) => (
                <Link key={n.id} href={`/neighborhoods/${n.id}`} className="card hover:shadow-lg transition-all">
                  <h3 className="font-bold mb-2">{n.name}</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm" style={{ color: 'var(--gray-600)' }}>Avg Rent</span>
                    <span className="font-semibold">{formatCurrency(n.avgRent)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: 'var(--gray-600)' }}>Safety</span>
                    <span className="font-semibold" style={{ color: getScoreColor(n.safetyScore) }}>
                      {n.safetyScore}/10
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="card mt-6 text-center" style={{ 
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', 
        color: 'white' 
      }}>
        <h2 className="text-2xl font-bold mb-4">Ready to Find Your Match?</h2>
        <p className="text-lg mb-6 opacity-90">
          Create your profile to see how well this neighborhood matches your preferences.
        </p>
        <Link href="/preferences" className="btn btn-large" style={{ 
          background: 'white', 
          color: 'var(--primary)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }}>
          <TrendingUp style={{ width: '1.25rem', height: '1.25rem' }} />
          Create My Profile
        </Link>
      </div>
    </div>
  );
};

export default NeighborhoodPage;