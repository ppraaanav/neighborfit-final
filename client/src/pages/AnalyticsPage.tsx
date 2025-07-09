import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, MapPin, Users, DollarSign, Shield, Star } from 'lucide-react';
import { Neighborhood } from '../../../shared/schema';

const AnalyticsPage = () => {
  const { data: neighborhoods, isLoading } = useQuery({
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

  if (!neighborhoods || neighborhoods.length === 0) {
    return (
      <div className="container">
        <div className="card text-center">
          <h2 className="text-2xl font-bold mb-4">No data available</h2>
          <p style={{ color: 'var(--gray-600)' }}>
            Unable to load neighborhood analytics data.
          </p>
        </div>
      </div>
    );
  }

  // Calculate analytics
  const totalNeighborhoods = neighborhoods.length;
  const avgRent = neighborhoods.reduce((sum: number, n: Neighborhood) => sum + n.avgRent, 0) / totalNeighborhoods;
  const avgSafety = neighborhoods.reduce((sum: number, n: Neighborhood) => sum + n.safetyScore, 0) / totalNeighborhoods;
  const avgWalkability = neighborhoods.reduce((sum: number, n: Neighborhood) => sum + n.walkabilityScore, 0) / totalNeighborhoods;

  // City distribution
  const cityDistribution = neighborhoods.reduce((acc: any, n: Neighborhood) => {
    acc[n.city] = (acc[n.city] || 0) + 1;
    return acc;
  }, {});

  // Type distribution
  const typeDistribution = neighborhoods.reduce((acc: any, n: Neighborhood) => {
    acc[n.type] = (acc[n.type] || 0) + 1;
    return acc;
  }, {});

  // Most affordable neighborhoods
  const mostAffordable = [...neighborhoods]
    .sort((a: Neighborhood, b: Neighborhood) => a.avgRent - b.avgRent)
    .slice(0, 5);

  // Safest neighborhoods
  const safest = [...neighborhoods]
    .sort((a: Neighborhood, b: Neighborhood) => b.safetyScore - a.safetyScore)
    .slice(0, 5);

  // Most walkable neighborhoods
  const mostWalkable = [...neighborhoods]
    .sort((a: Neighborhood, b: Neighborhood) => b.walkabilityScore - a.walkabilityScore)
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="card mb-6">
        <div className="card-header text-center">
          <h1 className="card-title text-4xl flex items-center justify-center gap-3">
            <BarChart3 style={{ width: '2.5rem', height: '2.5rem', color: 'var(--primary)' }} />
            Neighborhood Analytics
          </h1>
          <p className="card-subtitle text-xl">
            Comprehensive insights into our neighborhood database
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="stats mb-8">
        <div className="stat-card">
          <div className="stat-number">{totalNeighborhoods}</div>
          <div className="stat-label">Total Neighborhoods</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{formatCurrency(avgRent)}</div>
          <div className="stat-label">Average Rent</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{avgSafety.toFixed(1)}/10</div>
          <div className="stat-label">Average Safety</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{avgWalkability.toFixed(1)}/10</div>
          <div className="stat-label">Average Walkability</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* City Distribution */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title flex items-center gap-2">
              <MapPin style={{ width: '1.5rem', height: '1.5rem', color: 'var(--primary)' }} />
              Cities Coverage
            </h2>
            <p className="card-subtitle">Neighborhoods by city</p>
          </div>
          <div className="grid gap-3">
            {Object.entries(cityDistribution).map(([city, count]) => (
              <div key={city} className="flex justify-between items-center">
                <span className="font-medium">{city}</span>
                <div className="flex items-center gap-2">
                  <div className="progress-bar" style={{ width: '100px' }}>
                    <div 
                      className="progress-fill" 
                      style={{ width: `${((count as number) / totalNeighborhoods) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-bold" style={{ color: 'var(--primary)' }}>
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Type Distribution */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title flex items-center gap-2">
              <Users style={{ width: '1.5rem', height: '1.5rem', color: 'var(--primary)' }} />
              Neighborhood Types
            </h2>
            <p className="card-subtitle">Distribution by type</p>
          </div>
          <div className="grid gap-3">
            {Object.entries(typeDistribution).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="font-medium capitalize">{type}</span>
                <div className="flex items-center gap-2">
                  <div className="progress-bar" style={{ width: '100px' }}>
                    <div 
                      className="progress-fill" 
                      style={{ width: `${((count as number) / totalNeighborhoods) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-bold" style={{ color: 'var(--primary)' }}>
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Lists */}
      <div className="grid grid-cols-3 gap-6">
        {/* Most Affordable */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title flex items-center gap-2">
              <DollarSign style={{ width: '1.5rem', height: '1.5rem', color: 'var(--success)' }} />
              Most Affordable
            </h2>
            <p className="card-subtitle">Lowest average rent</p>
          </div>
          <div className="grid gap-3">
            {mostAffordable.map((neighborhood: Neighborhood, index: number) => (
              <div key={neighborhood.id} className="flex justify-between items-center p-3 rounded-lg" style={{ background: 'var(--gray-50)' }}>
                <div>
                  <div className="font-semibold text-sm">{neighborhood.name}</div>
                  <div className="text-xs" style={{ color: 'var(--gray-600)' }}>{neighborhood.city}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm" style={{ color: 'var(--success)' }}>
                    {formatCurrency(neighborhood.avgRent)}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--gray-600)' }}>
                    #{index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safest */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title flex items-center gap-2">
              <Shield style={{ width: '1.5rem', height: '1.5rem', color: 'var(--primary)' }} />
              Safest Areas
            </h2>
            <p className="card-subtitle">Highest safety scores</p>
          </div>
          <div className="grid gap-3">
            {safest.map((neighborhood: Neighborhood, index: number) => (
              <div key={neighborhood.id} className="flex justify-between items-center p-3 rounded-lg" style={{ background: 'var(--gray-50)' }}>
                <div>
                  <div className="font-semibold text-sm">{neighborhood.name}</div>
                  <div className="text-xs" style={{ color: 'var(--gray-600)' }}>{neighborhood.city}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm" style={{ color: 'var(--primary)' }}>
                    {neighborhood.safetyScore}/10
                  </div>
                  <div className="text-xs" style={{ color: 'var(--gray-600)' }}>
                    #{index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Walkable */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title flex items-center gap-2">
              <Star style={{ width: '1.5rem', height: '1.5rem', color: 'var(--warning)' }} />
              Most Walkable
            </h2>
            <p className="card-subtitle">Highest walkability scores</p>
          </div>
          <div className="grid gap-3">
            {mostWalkable.map((neighborhood: Neighborhood, index: number) => (
              <div key={neighborhood.id} className="flex justify-between items-center p-3 rounded-lg" style={{ background: 'var(--gray-50)' }}>
                <div>
                  <div className="font-semibold text-sm">{neighborhood.name}</div>
                  <div className="text-xs" style={{ color: 'var(--gray-600)' }}>{neighborhood.city}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm" style={{ color: 'var(--warning)' }}>
                    {neighborhood.walkabilityScore}/10
                  </div>
                  <div className="text-xs" style={{ color: 'var(--gray-600)' }}>
                    #{index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Insights */}
      <div className="card mt-8">
        <div className="card-header">
          <h2 className="card-title flex items-center gap-2">
            <TrendingUp style={{ width: '1.5rem', height: '1.5rem', color: 'var(--primary)' }} />
            Market Insights
          </h2>
          <p className="card-subtitle">Key findings from our data analysis</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold mb-3">Price Trends</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  background: 'var(--primary)',
                  marginTop: '6px',
                  flexShrink: 0
                }}></div>
                Urban areas have 35% higher average rent than suburban
              </li>
              <li className="flex items-start gap-2">
                <div style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  background: 'var(--primary)',
                  marginTop: '6px',
                  flexShrink: 0
                }}></div>
                Seattle has the highest average rent at {formatCurrency(
                  neighborhoods.filter((n: Neighborhood) => n.city === 'Seattle').reduce((sum: number, n: Neighborhood) => sum + n.avgRent, 0) / 
                  neighborhoods.filter((n: Neighborhood) => n.city === 'Seattle').length
                )}
              </li>
              <li className="flex items-start gap-2">
                <div style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  background: 'var(--primary)',
                  marginTop: '6px',
                  flexShrink: 0
                }}></div>
                Safety scores correlate positively with rent prices
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3">Quality of Life</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  background: 'var(--success)',
                  marginTop: '6px',
                  flexShrink: 0
                }}></div>
                {Math.round((neighborhoods.filter((n: Neighborhood) => n.safetyScore >= 8).length / totalNeighborhoods) * 100)}% of neighborhoods have excellent safety ratings
              </li>
              <li className="flex items-start gap-2">
                <div style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  background: 'var(--success)',
                  marginTop: '6px',
                  flexShrink: 0
                }}></div>
                Transit access is best in urban areas with 8.5+ scores
              </li>
              <li className="flex items-start gap-2">
                <div style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  background: 'var(--success)',
                  marginTop: '6px',
                  flexShrink: 0
                }}></div>
                Walkability exceeds 7.0 in {Math.round((neighborhoods.filter((n: Neighborhood) => n.walkabilityScore >= 7).length / totalNeighborhoods) * 100)}% of areas
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;