/**
 * Geolocation Service
 * Detects visitor location from IP address
 * Returns: country, region/state, city, coordinates, timezone
 */

const GeoService = {
  cache: null,
  cacheKey: 'visitor_geo_data',
  cacheDuration: 3600000, // 1 hour in ms

  async detect() {
    // Check cache first
    const cached = this.getFromCache();
    if (cached) return cached;

    try {
      // Primary: ipapi.co (no API key needed for basic use)
      const response = await fetch('https://ipapi.co/json/');

      if (!response.ok) {
        throw new Error(`Geolocation API error: ${response.status}`);
      }

      const data = await response.json();

      // Check for rate limiting or error response
      if (data.error) {
        console.warn('Geolocation API returned error:', data.reason);
        return this.getFallback();
      }

      const geoData = {
        country_code: data.country_code,
        country_name: data.country_name,
        region: data.region,
        region_code: data.region_code,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        currency: data.currency,
        languages: data.languages,
        detected_at: Date.now()
      };

      this.saveToCache(geoData);
      return geoData;
    } catch (error) {
      console.error('Geolocation failed:', error);
      return this.getFallback();
    }
  },

  getFromCache() {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) return null;

      const data = JSON.parse(cached);
      if (Date.now() - data.detected_at > this.cacheDuration) {
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
    } catch {
      // localStorage might be disabled
    }
  },

  getFallback() {
    // Default to US if detection fails
    return {
      country_code: 'US',
      country_name: 'United States',
      region: 'New Jersey',
      city: 'Unknown',
      latitude: 40.7128,
      longitude: -74.0060,
      timezone: 'America/New_York',
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
  module.exports = GeoService;
}
