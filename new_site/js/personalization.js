/**
 * Personalization Engine
 * Orchestrates all personalization based on visitor context
 */

const PersonalizationEngine = {
  countryData: null,
  visitorContext: null,
  basePath: './profile-images/',

  async initialize() {
    // Load country/region data
    try {
      const response = await fetch('./data/countries.json');
      this.countryData = await response.json();
    } catch (error) {
      console.error('Failed to load country data:', error);
      this.countryData = { countries: {}, regions: {} };
    }

    // Detect visitor context
    const geo = await GeoService.detect();
    const weather = await WeatherService.fetch(geo.latitude, geo.longitude);
    const localTime = this.getLocalTime(geo.timezone);

    // Detect active festival
    let festival = null;
    if (typeof FestivalService !== 'undefined') {
      festival = FestivalService.detect(geo.country_code);
    }

    this.visitorContext = {
      geo,
      weather,
      festival,
      localTime,
      timeOfDay: this.getTimeOfDay(localTime),
      countryInfo: this.getCountryInfo(geo.country_code),
      theme: this.determineTheme(weather, localTime)
    };

    return this.visitorContext;
  },

  getCountryInfo(countryCode) {
    if (!this.countryData) {
      return this.getDefaultCountryInfo();
    }

    // Check if we have specific country data
    // Handle case-insensitive matching
    const code = countryCode ? countryCode.toUpperCase() : 'US';

    if (this.countryData.countries && this.countryData.countries[code]) {
      return {
        ...this.countryData.countries[code],
        type: 'country',
        code: code
      };
    }

    // Fall back to region
    if (this.countryData.regions) {
      for (const [regionKey, region] of Object.entries(this.countryData.regions)) {
        if (region.countries && region.countries.includes(code)) {
          return {
            ...region,
            type: 'region',
            code: regionKey
          };
        }
      }
    }

    // Ultimate fallback
    return this.getDefaultCountryInfo();
  },

  getDefaultCountryInfo() {
    return {
      name: 'World',
      image: 'base.webp',
      greeting: 'Hello',
      greeting_formal: 'Welcome',
      language: 'en',
      type: 'fallback',
      color_palette: ['#6366f1', '#8b5cf6', '#a78bfa']
    };
  },

  getLocalTime(timezone) {
    try {
      return new Date().toLocaleString('en-US', { timeZone: timezone });
    } catch {
      return new Date().toLocaleString();
    }
  },

  getTimeOfDay(localTimeStr) {
    let date;
    try {
      date = new Date(localTimeStr);
      if (isNaN(date.getTime())) {
        date = new Date();
      }
    } catch {
      date = new Date();
    }

    const hour = date.getHours();

    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  },

  determineTheme(weather, localTime) {
    const isDay = weather.is_day;
    const condition = weather.condition;

    // Theme naming: {time}-{weather}
    if (condition === 'snow') return 'snow';
    if (condition === 'rain') return isDay ? 'day-rain' : 'night-rain';
    if (condition === 'cloudy') return isDay ? 'day-cloudy' : 'night-cloudy';
    return isDay ? 'day-clear' : 'night-clear';
  },

  getProfileImagePath() {
    if (!this.visitorContext) {
      return this.basePath + 'base.webp';
    }

    const info = this.visitorContext.countryInfo;

    if (info.type === 'region') {
      return this.basePath + info.image;
    }

    // For countries, the image is stored as lowercase country code
    if (info.image) {
      return this.basePath + info.image;
    }

    return this.basePath + 'base.webp';
  },

  getGreeting() {
    if (!this.visitorContext) {
      return {
        primary: 'Hello',
        secondary: 'Welcome',
        romanized: null,
        isFestival: false
      };
    }

    const info = this.visitorContext.countryInfo;
    const timeOfDay = this.visitorContext.timeOfDay;
    const festival = this.visitorContext.festival;

    // Time-appropriate greeting suffixes
    const timeGreetings = {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
      night: 'Good evening'
    };

    // If there's an active festival, use festival greeting
    if (festival && festival.is_active) {
      return {
        primary: festival.greeting,
        secondary: timeGreetings[timeOfDay],
        native: festival.greeting_native || null,
        romanized: null,
        isFestival: true,
        festivalName: festival.name,
        festivalEmoji: festival.emoji
      };
    }

    return {
      primary: info.greeting || info.greeting_formal || 'Hello',
      secondary: timeGreetings[timeOfDay],
      native: info.greeting_native || null,
      romanized: info.greeting_romanized || null,
      isFestival: false
    };
  },

  getColorPalette() {
    if (!this.visitorContext) {
      return {
        cultural: ['#6366f1', '#8b5cf6', '#a78bfa'],
        mood: { saturation: 1, brightness: 1 },
        theme: 'day-clear'
      };
    }

    const info = this.visitorContext.countryInfo;
    const theme = this.visitorContext.theme;

    // Blend cultural colors with weather-based mood
    const culturalColors = info.color_palette || ['#1a1a2e', '#16213e', '#0f3460'];

    // Weather mood adjustments
    const moodOverlay = {
      'day-clear': { saturation: 1.1, brightness: 1.1 },
      'day-cloudy': { saturation: 0.8, brightness: 0.95 },
      'day-rain': { saturation: 0.7, brightness: 0.85 },
      'night-clear': { saturation: 0.9, brightness: 0.6 },
      'night-cloudy': { saturation: 0.7, brightness: 0.5 },
      'night-rain': { saturation: 0.6, brightness: 0.45 },
      'snow': { saturation: 0.5, brightness: 1.0 }
    };

    return {
      cultural: culturalColors,
      mood: moodOverlay[theme] || moodOverlay['day-clear'],
      theme
    };
  },

  // Apply all personalizations to the DOM
  applyToDOM() {
    if (!this.visitorContext) return;

    // Apply theme
    document.documentElement.setAttribute('data-theme', this.visitorContext.theme);

    // Apply cultural accent color as CSS custom property
    const palette = this.getColorPalette();
    if (palette.cultural && palette.cultural[0]) {
      document.documentElement.style.setProperty('--cultural-accent', palette.cultural[0]);
    }

    // Update profile image if element exists
    const profileImg = document.querySelector('.site-profile-image img, #faceImage');
    if (profileImg && this.visitorContext.countryInfo.type !== 'fallback') {
      profileImg.src = this.getProfileImagePath();
      profileImg.alt = `Profile - ${this.visitorContext.countryInfo.name} style`;
    }

    // Update greeting if element exists
    const greetingEl = document.querySelector('.personalized-greeting');
    if (greetingEl) {
      const greeting = this.getGreeting();
      greetingEl.textContent = greeting.primary;
    }

    // Update location pill if it exists
    const locationEl = document.getElementById('visitor-location');
    if (locationEl && this.visitorContext.geo) {
      const geo = this.visitorContext.geo;
      locationEl.textContent = geo.city && geo.city !== 'Unknown'
        ? `${geo.city}, ${geo.country_name}`
        : geo.country_name;
    }
  },

  // Get a summary of the current personalization state (useful for debugging)
  getSummary() {
    if (!this.visitorContext) {
      return { initialized: false };
    }

    const greeting = this.getGreeting();

    return {
      initialized: true,
      country: this.visitorContext.geo.country_code,
      countryName: this.visitorContext.countryInfo.name,
      city: this.visitorContext.geo.city,
      theme: this.visitorContext.theme,
      weather: this.visitorContext.weather.condition,
      temperature: this.visitorContext.weather.temperature,
      timeOfDay: this.visitorContext.timeOfDay,
      greeting: greeting.primary,
      isFestival: greeting.isFestival,
      festivalName: greeting.festivalName || null,
      profileImage: this.getProfileImagePath()
    };
  }
};

// Export for module systems while maintaining global access
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PersonalizationEngine;
}
