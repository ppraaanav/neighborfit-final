import { Router } from 'express';
import { z } from 'zod';
import { storage } from './storage';
import { matcher } from './matching-algorithm';
import { insertUserPreferencesSchema, insertNeighborhoodSchema } from '../shared/schema';

const router = Router();

// User preferences routes
router.post('/api/user-preferences', async (req, res) => {
  try {
    const validatedData = insertUserPreferencesSchema.parse(req.body);
    const userPreferences = await storage.createUserPreferences(validatedData);
    res.json(userPreferences);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

router.get('/api/user-preferences/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userPreferences = await storage.getUserPreferences(id);
    
    if (!userPreferences) {
      return res.status(404).json({ error: 'User preferences not found' });
    }
    
    res.json(userPreferences);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/api/user-preferences/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = insertUserPreferencesSchema.partial().parse(req.body);
    const updatedPreferences = await storage.updateUserPreferences(id, validatedData);
    
    if (!updatedPreferences) {
      return res.status(404).json({ error: 'User preferences not found' });
    }
    
    res.json(updatedPreferences);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Neighborhood routes
router.get('/api/neighborhoods', async (req, res) => {
  try {
    const { city, state, maxRent } = req.query;
    
    if (city || state || maxRent) {
      const searchParams = {
        city: city as string,
        state: state as string,
        maxRent: maxRent ? parseInt(maxRent as string) : undefined
      };
      const neighborhoods = await storage.searchNeighborhoods(searchParams);
      res.json(neighborhoods);
    } else {
      const neighborhoods = await storage.getAllNeighborhoods();
      res.json(neighborhoods);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/neighborhoods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const neighborhood = await storage.getNeighborhood(id);
    
    if (!neighborhood) {
      return res.status(404).json({ error: 'Neighborhood not found' });
    }
    
    res.json(neighborhood);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/api/neighborhoods', async (req, res) => {
  try {
    const validatedData = insertNeighborhoodSchema.parse(req.body);
    const neighborhood = await storage.createNeighborhood(validatedData);
    res.json(neighborhood);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Matching routes
router.post('/api/matches', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const userPreferences = await storage.getUserPreferences(userId);
    
    if (!userPreferences) {
      return res.status(404).json({ error: 'User preferences not found' });
    }
    
    const matches = await matcher.findMatches(userPreferences);
    res.json(matches);
  } catch (error) {
    console.error('Error generating matches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/matches/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const matches = await storage.getMatchesForUser(userId);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/matches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const match = await storage.getMatch(id);
    
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    res.json(match);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Analytics and insights routes
router.get('/api/analytics/neighborhoods', async (req, res) => {
  try {
    const neighborhoods = await storage.getAllNeighborhoods();
    
    const analytics = {
      total: neighborhoods.length,
      byState: neighborhoods.reduce((acc, n) => {
        acc[n.state] = (acc[n.state] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      averageRent: neighborhoods.reduce((sum, n) => sum + n.housing.medianRent, 0) / neighborhoods.length,
      priceRanges: {
        under2000: neighborhoods.filter(n => n.housing.medianRent < 2000).length,
        under3000: neighborhoods.filter(n => n.housing.medianRent < 3000).length,
        under4000: neighborhoods.filter(n => n.housing.medianRent < 4000).length,
        over4000: neighborhoods.filter(n => n.housing.medianRent >= 4000).length,
      },
      averageScores: {
        walkability: neighborhoods.reduce((sum, n) => sum + n.lifestyle.walkScore, 0) / neighborhoods.length,
        transit: neighborhoods.reduce((sum, n) => sum + n.lifestyle.transitScore, 0) / neighborhoods.length,
        safety: neighborhoods.reduce((sum, n) => sum + (10 - n.lifestyle.crimeRate), 0) / neighborhoods.length,
      }
    };
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;