import { Router, Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/HomePage';
import PreferencesPage from './pages/PreferencesPage';
import MatchesPage from './pages/MatchesPage';
import NeighborhoodPage from './pages/NeighborhoodPage';
import AnalyticsPage from './pages/AnalyticsPage';
import Navigation from './components/Navigation';
import { Toaster } from './components/ui/toaster';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="app">
          <Navigation />
          <main className="main-content">
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/preferences" component={PreferencesPage} />
              <Route path="/matches" component={MatchesPage} />
              <Route path="/matches/:userId" component={MatchesPage} />
              <Route path="/neighborhoods" component={NeighborhoodPage} />
              <Route path="/neighborhoods/:id" component={NeighborhoodPage} />
              <Route path="/analytics" component={AnalyticsPage} />
              <Route>
                <div className="container text-center" style={{ padding: '4rem 0' }}>
                  <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                </div>
              </Route>
            </Switch>
          </main>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;