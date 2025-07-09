import { Link } from 'wouter';
import { MapPin, Users, TrendingUp, Shield, Zap, Heart, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: MapPin,
      title: 'Smart Matching',
      description: 'Our platform's algorithm matches you with neighborhoods based on your lifestyle, budget, and preferences.',
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'Find neighborhoods with communities that align with your values and interests.',
    },
    {
      icon: TrendingUp,
      title: 'Data-Driven',
      description: 'Make informed decisions with comprehensive neighborhood analytics and insights.',
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Prioritize your safety with detailed crime statistics and safety ratings.',
    },
  ];

  const stats = [
    { number: '50+', label: 'Neighborhoods' },
    { number: '5', label: 'Major Cities' },
    { number: '95%', label: 'Match Accuracy' },
    { number: '24/7', label: 'Support' },
  ];

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero animate-fadeIn">
        <div className="hero-content">
          <h1 className="hero-title">
            Find Your Perfect Neighborhood
          </h1>
          <p className="hero-subtitle">
            Discover neighborhoods that match your lifestyle, budget, and dreams. Our platform helps you find your ideal home by analyzing key data points tailored to your needs.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/preferences" className="btn btn-primary btn-large">
              <Zap style={{ width: '1.25rem', height: '1.25rem' }} />
              Get Started
            </Link>
            <Link href="/analytics" className="btn btn-secondary btn-large">
              <TrendingUp style={{ width: '1.25rem', height: '1.25rem' }} />
              View Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card animate-fadeIn">
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-4">Why Choose NeighborFit?</h2>
        <p className="text-xl text-center mb-8" style={{ color: 'var(--gray-600)' }}>
          Our comprehensive platform helps you make the most important decision of your life.
        </p>
        <div className="grid grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="feature-card animate-fadeIn">
                <div className="feature-icon">
                  <Icon style={{ width: '2.5rem', height: '2.5rem' }} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="card mb-8">
        <div className="card-header text-center">
          <h2 className="card-title text-3xl">How It Works</h2>
          <p className="card-subtitle text-xl">Three simple steps to find your perfect neighborhood</p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center" 
                 style={{ 
                   width: '4rem', 
                   height: '4rem', 
                   background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', 
                   color: 'white',
                   borderRadius: '50%',
                   fontSize: '1.5rem',
                   fontWeight: 'bold',
                   marginBottom: '1rem'
                 }}>
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Set Your Preferences</h3>
            <p style={{ color: 'var(--gray-600)' }}>
              Tell us about your lifestyle, budget, and what matters most to you in a neighborhood.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center" 
                 style={{ 
                   width: '4rem', 
                   height: '4rem', 
                   background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', 
                   color: 'white',
                   borderRadius: '50%',
                   fontSize: '1.5rem',
                   fontWeight: 'bold',
                   marginBottom: '1rem'
                 }}>
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Matched</h3>
            <p style={{ color: 'var(--gray-600)' }}>
              Our AI algorithm analyzes your preferences against our comprehensive neighborhood database.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center" 
                 style={{ 
                   width: '4rem', 
                   height: '4rem', 
                   background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', 
                   color: 'white',
                   borderRadius: '50%',
                   fontSize: '1.5rem',
                   fontWeight: 'bold',
                   marginBottom: '1rem'
                 }}>
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Explore & Decide</h3>
            <p style={{ color: 'var(--gray-600)' }}>
              Review your personalized matches with detailed insights and make your perfect choice.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mb-8">
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', 
          color: 'white' 
        }}>
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Neighborhood?</h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands of satisfied users who found their ideal home with NeighborFit.
          </p>
          <Link href="/preferences" className="btn btn-large" style={{ 
            background: 'white', 
            color: 'var(--primary)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
          }}>
            <Heart style={{ width: '1.25rem', height: '1.25rem' }} />
            Start Your Journey
            <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
