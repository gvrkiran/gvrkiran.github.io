/**
 * Weather Service
 * Fetches current weather conditions for visitor's location
 * Uses Open-Meteo API (free, no API key required)
 */

const WeatherService = {
  cache: null,
  cacheKey: 'visitor_weather',
  cacheDuration: 1800000, // 30 minutes

  async fetch(lat, lon) {
    const cached = this.getFromCache();
    if (cached) return cached;

    try {
      // Using Open-Meteo API (free, no API key needed)
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,is_day&timezone=auto`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      const current = data.current;

      const weatherData = {
        condition: this.normalizeCondition(current.weather_code),
        weather_code: current.weather_code,
        temperature: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        is_day: current.is_day === 1,
        timezone: data.timezone,
        fetched_at: Date.now()
      };

      this.saveToCache(weatherData);
      return weatherData;
    } catch (error) {
      console.error('Weather fetch failed:', error);
      return this.getFallback();
    }
  },

  /**
   * Normalize WMO weather codes to our theme categories
   * WMO Weather codes: https://open-meteo.com/en/docs
   * 0: Clear sky
   * 1, 2, 3: Mainly clear, partly cloudy, overcast
   * 45, 48: Fog
   * 51, 53, 55: Drizzle
   * 56, 57: Freezing drizzle
   * 61, 63, 65: Rain
   * 66, 67: Freezing rain
   * 71, 73, 75: Snow fall
   * 77: Snow grains
   * 80, 81, 82: Rain showers
   * 85, 86: Snow showers
   * 95: Thunderstorm
   * 96, 99: Thunderstorm with hail
   */
  normalizeCondition(code) {
    if (code === 0) return 'clear';
    if (code >= 1 && code <= 3) return 'cloudy';
    if (code >= 45 && code <= 48) return 'cloudy'; // fog
    if (code >= 51 && code <= 67) return 'rain'; // drizzle and rain
    if (code >= 71 && code <= 77) return 'snow';
    if (code >= 80 && code <= 82) return 'rain'; // rain showers
    if (code >= 85 && code <= 86) return 'snow'; // snow showers
    if (code >= 95 && code <= 99) return 'rain'; // thunderstorm
    return 'clear'; // fallback
  },

  getConditionDescription(code) {
    const descriptions = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };
    return descriptions[code] || 'Unknown';
  },

  getFromCache() {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) return null;

      const data = JSON.parse(cached);
      if (Date.now() - data.fetched_at > this.cacheDuration) {
        localStorage.removeItem(this.cacheKey);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },

  saveToCache(data) {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify(data));
    } catch {}
  },

  getFallback() {
    const hour = new Date().getHours();
    return {
      condition: 'clear',
      is_day: hour >= 6 && hour < 20,
      temperature: null,
      is_fallback: true
    };
  },

  // Utility to clear cache (useful for testing)
  clearCache() {
    try {
      localStorage.removeItem(this.cacheKey);
    } catch {}
  }
};

// Export for module systems while maintaining global access
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WeatherService;
}
