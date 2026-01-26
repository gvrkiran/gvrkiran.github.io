/**
 * Personalization Initialization
 * Main entry point that orchestrates all personalization systems
 */

(async function initializePersonalizedSite() {
  'use strict';

  // Show loading state
  document.body.classList.add('personalizing');

  try {
    // Initialize personalization engine
    const context = await PersonalizationEngine.initialize();

    // Log summary for debugging (can be removed in production)
    console.log('Personalization initialized:', PersonalizationEngine.getSummary());

    // Preload critical assets
    if (typeof Preloader !== 'undefined' && context.geo) {
      await Preloader.initialize(context.geo.country_code);
    }

    // Record visit for returning visitor tracking
    let visitorHistory = null;
    if (typeof ReturningVisitor !== 'undefined') {
      visitorHistory = ReturningVisitor.recordVisit(context);
    }

    // Apply all personalizations to DOM
    PersonalizationEngine.applyToDOM();

    // Update any personalized elements that exist
    updatePersonalizedElements(context);

    // Initialize ambient background (subtle regional patterns)
    if (typeof AmbientBackground !== 'undefined' && context.geo) {
      AmbientBackground.initialize(context.geo.country_code);
    }

    // Initialize welcome animation (shows greeting overlay)
    if (typeof WelcomeAnimation !== 'undefined') {
      // Pass visitor history for returning visitor message
      await WelcomeAnimation.initialize(context, visitorHistory);
      WelcomeAnimation.enableSkip(); // Allow clicking/keypress to skip
    } else {
      document.body.classList.add('welcome-complete');
    }

    // Initialize weather effects (rain, snow, stars, etc.)
    if (typeof WeatherEffects !== 'undefined' && context.weather) {
      WeatherEffects.initialize(context.weather);
    }

    // Initialize distance visualization
    if (typeof DistanceVisualization !== 'undefined' && context.geo && !context.geo.is_fallback) {
      // Delay slightly so it appears after page content
      setTimeout(() => {
        DistanceVisualization.initialize(context.geo);
      }, 500);
    }

    // Apply returning visitor styling
    if (visitorHistory && visitorHistory.totalVisits > 1) {
      document.body.classList.add('returning-visitor');
      document.body.dataset.visitCount = visitorHistory.totalVisits;
    }

  } catch (error) {
    console.error('Personalization failed:', error);
    // Graceful degradation - site still works without personalization
    applyFallbackPersonalization();
  } finally {
    document.body.classList.remove('personalizing');
    document.body.classList.add('personalized');
    document.body.classList.add('welcome-complete');
  }
})();

/**
 * Apply fallback personalization when main system fails
 */
function applyFallbackPersonalization() {
  // Set default theme based on time of day
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour >= 20;
  document.documentElement.setAttribute('data-theme', isNight ? 'night-clear' : 'day-clear');

  // Set default profile image
  const faceImage = document.getElementById('faceImage');
  if (faceImage) {
    faceImage.src = './profile-images/base.webp';
  }

  // Set default greeting
  const greetingEl = document.querySelector('.personalized-greeting');
  if (greetingEl) {
    greetingEl.textContent = 'Hello';
  }

  // Still try to show weather effects with fallback
  if (typeof WeatherEffects !== 'undefined') {
    WeatherEffects.initialize({
      condition: 'clear',
      is_day: !isNight
    });
  }

  document.body.classList.add('welcome-complete');
}

/**
 * Update personalized elements in the DOM
 */
function updatePersonalizedElements(context) {
  if (!context) return;

  const greeting = PersonalizationEngine.getGreeting();

  // Update greeting text
  const greetingEl = document.querySelector('.personalized-greeting, #personalized-greeting');
  if (greetingEl) {
    // Add festival emoji if applicable
    if (greeting.isFestival && greeting.festivalEmoji) {
      greetingEl.textContent = `${greeting.festivalEmoji} ${greeting.primary}`;
    } else {
      greetingEl.textContent = greeting.primary;
    }

    // If there's a native script greeting, show it
    const nativeEl = document.querySelector('.greeting-native');
    if (nativeEl) {
      if (greeting.native) {
        nativeEl.textContent = greeting.native;
        nativeEl.style.display = 'inline';
      } else {
        nativeEl.style.display = 'none';
      }
    }

    // Show romanized version if different from primary
    const romanizedEl = document.querySelector('.greeting-romanized');
    if (romanizedEl) {
      if (greeting.romanized && greeting.romanized !== greeting.primary) {
        romanizedEl.textContent = `(${greeting.romanized})`;
        romanizedEl.style.display = 'block';
      } else {
        romanizedEl.style.display = 'none';
      }
    }
  }

  // Update secondary greeting (time-based)
  const secondaryGreetingEl = document.querySelector('.greeting-secondary');
  if (secondaryGreetingEl) {
    const greeting = PersonalizationEngine.getGreeting();
    secondaryGreetingEl.textContent = greeting.secondary;
  }

  // Update visitor location display
  const locationEl = document.querySelector('#visitor-location, .visitor-location');
  if (locationEl && context.geo) {
    const { city, country_name, region } = context.geo;
    if (city && city !== 'Unknown') {
      locationEl.textContent = `${city}, ${country_name}`;
    } else if (region) {
      locationEl.textContent = `${region}, ${country_name}`;
    } else {
      locationEl.textContent = country_name;
    }
  }

  // Update weather display if element exists
  const weatherEl = document.querySelector('.weather-condition');
  if (weatherEl && context.weather) {
    const temp = context.weather.temperature;
    const condition = context.weather.condition;
    if (temp !== null && temp !== undefined) {
      weatherEl.textContent = `${Math.round(temp)}°C, ${condition}`;
    } else {
      weatherEl.textContent = condition;
    }
  }

  // Update profile image and disable face tracker
  const faceImage = document.getElementById('faceImage');
  const faceTracker = document.getElementById('faceTracker');

  if (faceImage) {
    const newSrc = PersonalizationEngine.getProfileImagePath();
    faceImage.src = newSrc;
    faceImage.alt = `Profile - ${context.countryInfo.name} style`;

    // Disable face tracker mouse events when using personalized images
    // The personalized images don't have gaze tracking variations
    if (faceTracker) {
      faceTracker.style.cursor = 'default';
      // Add a flag to indicate personalization is active
      faceTracker.dataset.personalized = 'true';
    }
  }

  // Update any other profile images
  const otherProfileImages = document.querySelectorAll('.personalized-profile-image:not(#faceImage), .site-profile-image img');
  otherProfileImages.forEach(img => {
    const newSrc = PersonalizationEngine.getProfileImagePath();
    img.src = newSrc;
    img.alt = `Welcome - ${context.countryInfo.name} style`;
  });

  // Apply cultural color accent to specific elements
  const accentElements = document.querySelectorAll('.cultural-accent');
  const palette = PersonalizationEngine.getColorPalette();
  if (palette.cultural && palette.cultural[0]) {
    accentElements.forEach(el => {
      el.style.setProperty('--element-accent', palette.cultural[0]);
    });
  }
}

/**
 * Handle returning visitors with personalized touches
 */
function handleReturningVisitor() {
  const visitKey = 'personalization_visit_count';
  const lastVisitKey = 'personalization_last_visit';

  try {
    const visits = parseInt(localStorage.getItem(visitKey) || '0') + 1;
    const lastVisit = localStorage.getItem(lastVisitKey);

    localStorage.setItem(visitKey, visits.toString());
    localStorage.setItem(lastVisitKey, new Date().toISOString());

    if (visits > 1) {
      // Returning visitor
      document.body.classList.add('returning-visitor');

      // Could customize greeting for returning visitors
      const greetingEl = document.querySelector('.personalized-greeting');
      if (greetingEl && visits > 3) {
        // After 3+ visits, could show "Welcome back"
        // greetingEl.textContent = 'Welcome back!';
      }

      console.log(`Returning visitor (visit #${visits})`);
    }
  } catch {
    // localStorage might be disabled
  }
}

/**
 * Utility function to manually refresh personalization
 * (useful for testing or after user changes preferences)
 */
window.refreshPersonalization = async function() {
  // Clear caches
  GeoService.clearCache();
  WeatherService.clearCache();

  // Re-initialize
  const context = await PersonalizationEngine.initialize();
  PersonalizationEngine.applyToDOM();
  updatePersonalizedElements(context);

  console.log('Personalization refreshed:', PersonalizationEngine.getSummary());
};

/**
 * Utility to simulate different locations (for testing)
 */
window.simulateLocation = async function(countryCode) {
  // Override the geo and country info for testing
  PersonalizationEngine.visitorContext.geo.country_code = countryCode;
  PersonalizationEngine.visitorContext.countryInfo = PersonalizationEngine.getCountryInfo(countryCode);

  // Check for festival in new location
  if (typeof FestivalService !== 'undefined') {
    PersonalizationEngine.visitorContext.festival = FestivalService.detect(countryCode);
  }

  // Re-apply personalization
  PersonalizationEngine.applyToDOM();
  updatePersonalizedElements(PersonalizationEngine.visitorContext);

  console.log(`Simulated location: ${countryCode}`, PersonalizationEngine.getSummary());
};

/**
 * Utility to simulate different weather conditions (for testing)
 */
window.simulateWeather = function(condition, isDay = true) {
  const validConditions = ['clear', 'cloudy', 'rain', 'snow'];
  if (!validConditions.includes(condition)) {
    console.error(`Invalid condition. Use: ${validConditions.join(', ')}`);
    return;
  }

  // Update weather in context
  PersonalizationEngine.visitorContext.weather.condition = condition;
  PersonalizationEngine.visitorContext.weather.is_day = isDay;
  PersonalizationEngine.visitorContext.theme = PersonalizationEngine.determineTheme(
    PersonalizationEngine.visitorContext.weather,
    PersonalizationEngine.visitorContext.localTime
  );

  // Re-apply theme
  document.documentElement.setAttribute('data-theme', PersonalizationEngine.visitorContext.theme);

  // Restart weather effects
  if (typeof WeatherEffects !== 'undefined') {
    WeatherEffects.destroy();
    WeatherEffects.initialize(PersonalizationEngine.visitorContext.weather);
  }

  console.log(`Simulated weather: ${condition} (${isDay ? 'day' : 'night'})`, PersonalizationEngine.getSummary());
};

/**
 * Utility to simulate a festival (for testing)
 */
window.simulateFestival = function(festivalKey) {
  if (typeof FestivalService === 'undefined') {
    console.error('FestivalService not loaded');
    return;
  }

  const festival = FestivalService.festivals[festivalKey];
  if (!festival) {
    console.error(`Unknown festival. Available: ${Object.keys(FestivalService.festivals).join(', ')}`);
    return;
  }

  PersonalizationEngine.visitorContext.festival = {
    key: festivalKey,
    name: festival.name,
    greeting: festival.greeting,
    greeting_native: festival.greeting_native,
    emoji: festival.emoji,
    is_active: true
  };

  // Update greeting display
  updatePersonalizedElements(PersonalizationEngine.visitorContext);

  console.log(`Simulated festival: ${festival.name}`, PersonalizationEngine.getSummary());
};

/**
 * Utility to replay the welcome animation (for testing)
 */
window.replayWelcome = async function() {
  // Clear session flag
  try {
    sessionStorage.removeItem('welcome_played');
  } catch {}

  // Re-run welcome animation
  if (typeof WelcomeAnimation !== 'undefined') {
    document.body.classList.remove('welcome-complete');
    await WelcomeAnimation.initialize(PersonalizationEngine.visitorContext);
  }
};

/**
 * Show all available testing commands
 */
window.showPersonalizationHelp = function() {
  console.log(`
=== Personalization Testing Commands ===

refreshPersonalization()
  - Clears cache and re-fetches geo/weather data

simulateLocation('JP')
  - Simulate visiting from a different country
  - Examples: 'US', 'IN', 'JP', 'BR', 'DE', 'FR'

simulateWeather('rain', true)
  - Simulate weather conditions
  - Conditions: 'clear', 'cloudy', 'rain', 'snow'
  - Second param: true = day, false = night

simulateFestival('diwali')
  - Simulate an active festival
  - Options: diwali, lunar_new_year, christmas, holi, eid_al_fitr, carnival, thanksgiving_us

replayWelcome()
  - Replay the welcome animation

PersonalizationEngine.getSummary()
  - View current personalization state
  `);
};

// Log help hint on load
console.log('Personalization active. Type showPersonalizationHelp() for testing commands.');
