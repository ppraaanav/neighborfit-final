import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { insertUserPreferencesSchema } from '../../../shared/schema';
import { toast } from '../components/ui/toaster';
import { Save, User, DollarSign, Home, MapPin, Zap, ArrowRight, ArrowLeft } from 'lucide-react';

const PreferencesPage = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const form = useForm<z.infer<typeof insertUserPreferencesSchema>>({
    resolver: zodResolver(insertUserPreferencesSchema),
    defaultValues: {
      name: '',
      email: '',
      age: 25,
      budget: { min: 1000, max: 3000 },
      lifestyle: {
        workFromHome: false,
        hasChildren: false,
        hasPets: false,
        nightLife: 'moderate',
        outdoorActivities: 'moderate',
        publicTransport: 'preferred',
        walkability: 'moderate',
        safetyPriority: 'high',
      },
      preferences: {
        maxCommute: 30,
        neighborhoodTypes: ['urban'],
        amenities: [],
        dealBreakers: [],
      },
    },
  });

  const createUserPreferences = useMutation({
    mutationFn: async (data: z.infer<typeof insertUserPreferencesSchema>) => {
      const response = await fetch('/api/user-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create preferences');
      return response.json();
    },
    onSuccess: (data) => {
      toast.success('Preferences saved successfully!', `User ID: ${data.id}`);
      window.location.href = `/matches/${data.id}`;
    },
    onError: (error) => {
      toast.error('Failed to save preferences', error.message);
    },
  });

  const onSubmit = (data: z.infer<typeof insertUserPreferencesSchema>) => {
    createUserPreferences.mutate(data);
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2" style={{ 
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Create Your Profile
          </h1>
          <p className="text-xl" style={{ color: 'var(--gray-600)' }}>
            Tell us about your preferences to find your perfect neighborhood match
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="progress-container">
          <div className="progress-info">
            <span className="progress-label">Step {step} of {totalSteps}</span>
            <span className="progress-percentage">{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <div className="card-header">
                <h2 className="card-title flex items-center gap-2">
                  <User style={{ width: '1.5rem', height: '1.5rem', color: 'var(--primary)' }} />
                  Personal Information
                </h2>
                <p className="card-subtitle">Let's start with some basic information about you</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  {...form.register('name')}
                  placeholder="Enter your full name"
                />
                {form.formState.errors.name && (
                  <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  {...form.register('email')}
                  placeholder="Enter your email address"
                />
                {form.formState.errors.email && (
                  <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="age" className="form-label">Age</label>
                <input
                  id="age"
                  type="number"
                  className="form-input"
                  {...form.register('age', { valueAsNumber: true })}
                  placeholder="Enter your age"
                  min="18"
                  max="100"
                />
                {form.formState.errors.age && (
                  <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>
                    {form.formState.errors.age.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Budget */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <div className="card-header">
                <h2 className="card-title flex items-center gap-2">
                  <DollarSign style={{ width: '1.5rem', height: '1.5rem', color: 'var(--primary)' }} />
                  Budget Range
                </h2>
                <p className="card-subtitle">What's your monthly housing budget?</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="budget.min" className="form-label">Minimum Budget</label>
                  <input
                    id="budget.min"
                    type="number"
                    className="form-input"
                    {...form.register('budget.min', { valueAsNumber: true })}
                    placeholder="$1,000"
                    min="500"
                  />
                  {form.formState.errors.budget?.min && (
                    <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>
                      {form.formState.errors.budget.min.message}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="budget.max" className="form-label">Maximum Budget</label>
                  <input
                    id="budget.max"
                    type="number"
                    className="form-input"
                    {...form.register('budget.max', { valueAsNumber: true })}
                    placeholder="$3,000"
                    min="500"
                  />
                  {form.formState.errors.budget?.max && (
                    <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>
                      {form.formState.errors.budget.max.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Lifestyle */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <div className="card-header">
                <h2 className="card-title flex items-center gap-2">
                  <Home style={{ width: '1.5rem', height: '1.5rem', color: 'var(--primary)' }} />
                  Lifestyle Preferences
                </h2>
                <p className="card-subtitle">Tell us about your lifestyle and daily routines</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="form-checkbox">
                  <input
                    id="workFromHome"
                    type="checkbox"
                    {...form.register('lifestyle.workFromHome')}
                  />
                  <label htmlFor="workFromHome" className="form-label">Work from Home</label>
                </div>

                <div className="form-checkbox">
                  <input
                    id="hasChildren"
                    type="checkbox"
                    {...form.register('lifestyle.hasChildren')}
                  />
                  <label htmlFor="hasChildren" className="form-label">Have Children</label>
                </div>

                <div className="form-checkbox">
                  <input
                    id="hasPets"
                    type="checkbox"
                    {...form.register('lifestyle.hasPets')}
                  />
                  <label htmlFor="hasPets" className="form-label">Have Pets</label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="nightLife" className="form-label">Night Life Preference</label>
                  <select
                    id="nightLife"
                    className="form-select"
                    {...form.register('lifestyle.nightLife')}
                  >
                    <option value="low">Low - Quiet evenings</option>
                    <option value="moderate">Moderate - Some entertainment</option>
                    <option value="high">High - Active nightlife</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="outdoorActivities" className="form-label">Outdoor Activities</label>
                  <select
                    id="outdoorActivities"
                    className="form-select"
                    {...form.register('lifestyle.outdoorActivities')}
                  >
                    <option value="low">Low - Indoor focused</option>
                    <option value="moderate">Moderate - Some outdoor time</option>
                    <option value="high">High - Very active outdoors</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="publicTransport" className="form-label">Public Transportation</label>
                  <select
                    id="publicTransport"
                    className="form-select"
                    {...form.register('lifestyle.publicTransport')}
                  >
                    <option value="unnecessary">Unnecessary - I have a car</option>
                    <option value="preferred">Preferred - Convenient option</option>
                    <option value="required">Required - Essential for me</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="safetyPriority" className="form-label">Safety Priority</label>
                  <select
                    id="safetyPriority"
                    className="form-select"
                    {...form.register('lifestyle.safetyPriority')}
                  >
                    <option value="low">Low - Not a major concern</option>
                    <option value="moderate">Moderate - Important factor</option>
                    <option value="high">High - Top priority</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Preferences */}
          {step === 4 && (
            <div className="animate-fadeIn">
              <div className="card-header">
                <h2 className="card-title flex items-center gap-2">
                  <MapPin style={{ width: '1.5rem', height: '1.5rem', color: 'var(--primary)' }} />
                  Location Preferences
                </h2>
                <p className="card-subtitle">Final details about your ideal neighborhood</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="maxCommute" className="form-label">Maximum Commute Time (minutes)</label>
                <input
                  id="maxCommute"
                  type="number"
                  className="form-input"
                  {...form.register('preferences.maxCommute', { valueAsNumber: true })}
                  placeholder="30"
                  min="5"
                  max="120"
                />
                {form.formState.errors.preferences?.maxCommute && (
                  <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>
                    {form.formState.errors.preferences.maxCommute.message}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Neighborhood Types (Select all that apply)</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['urban', 'suburban', 'rural'].map((type) => (
                    <div key={type} className="form-checkbox">
                      <input
                        id={type}
                        type="checkbox"
                        value={type}
                        {...form.register('preferences.neighborhoodTypes')}
                      />
                      <label htmlFor={type} className="form-label capitalize">{type}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Important Amenities (Select all that apply)</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['parks', 'schools', 'shopping', 'restaurants', 'gyms', 'hospitals', 'libraries', 'transit'].map((amenity) => (
                    <div key={amenity} className="form-checkbox">
                      <input
                        id={amenity}
                        type="checkbox"
                        value={amenity}
                        {...form.register('preferences.amenities')}
                      />
                      <label htmlFor={amenity} className="form-label capitalize">{amenity}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="btn btn-secondary flex items-center gap-2"
              >
                <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
                Previous
              </button>
            )}
            
            {step < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn btn-primary flex items-center gap-2"
                style={{ marginLeft: 'auto' }}
              >
                Next
                <ArrowRight style={{ width: '1rem', height: '1rem' }} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={createUserPreferences.isPending}
                className="btn btn-primary flex items-center gap-2"
                style={{ marginLeft: 'auto' }}
              >
                {createUserPreferences.isPending ? (
                  <>
                    <div className="loading-spinner" style={{ width: '1rem', height: '1rem' }}></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save style={{ width: '1rem', height: '1rem' }} />
                    Save & Find Matches
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PreferencesPage;