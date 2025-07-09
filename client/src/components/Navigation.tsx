import { Link, useLocation } from 'wouter';
import { Home, Users, Settings, BarChart3, MapPin } from 'lucide-react';

const Navigation = () => {
  const [location] = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/preferences', label: 'Preferences', icon: Settings },
    { path: '/matches', label: 'Matches', icon: Users },
    { path: '/neighborhoods', label: 'Neighborhoods', icon: MapPin },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="flex items-center">
          <Link href="/" className="nav-logo flex items-center gap-2">
            <MapPin style={{ width: '2rem', height: '2rem', color: 'var(--primary)' }} />
            <span>NeighborFit</span>
          </Link>
        </div>
        
        <ul className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`nav-link flex items-center gap-2 ${isActive ? 'active' : ''}`}
                >
                  <Icon style={{ width: '1rem', height: '1rem' }} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;