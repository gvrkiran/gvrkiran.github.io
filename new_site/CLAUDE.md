# CLAUDE.md — Personalized Academic Website Implementation Guide

## Project Overview

Transform Vincent's academic website (gvrkiran.github.io) into a deeply personalized experience that adapts to each visitor based on their location, local weather, time of day, cultural context, and regional aesthetic sensibilities.

**Core Philosophy**: The website should feel like it *recognizes* you—not in a surveillance way, but in a hospitable way. Like a thoughtful host who adjusts the lighting, plays appropriate music, and greets you in your language.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         VISITOR ARRIVES                              │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    GEOLOCATION SERVICE                               │
│  • IP → Country/State detection (ipapi.co or ipinfo.io)             │
│  • Returns: country_code, region, city, lat/lon, timezone           │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
┌──────────────────────────────┐  ┌──────────────────────────────────┐
│     WEATHER SERVICE          │  │     TIME/CALENDAR SERVICE         │
│  • OpenWeatherMap API        │  │  • Local time calculation         │
│  • Current conditions        │  │  • Festival/holiday detection     │
│  • Temperature, weather type │  │  • Academic calendar awareness    │
└──────────────────────────────┘  └──────────────────────────────────┘
                    │                           │
                    └─────────────┬─────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    PERSONALIZATION ENGINE                            │
│  • Select profile image (traditional dress)                         │
│  • Determine color palette (weather + time)                         │
│  • Choose ambient background (regional aesthetic)                   │
│  • Set greeting (language + cultural formality)                     │
│  • Configure micro-interactions (weather effects)                   │
│  • Calculate distance visualization data                            │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    RENDER PERSONALIZED SITE                          │
│  • Full-screen welcome animation (5s)                               │
│  • Transition to main site with all personalizations active         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Project Setup & Core Infrastructure

### Step 1.1: Repository Structure

Create the following directory structure:

```
gvrkiran.github.io/
├── index.html                    # Main entry point
├── css/
│   ├── main.css                  # Core styles
│   ├── themes/
│   │   ├── day-clear.css         # Sunny day theme
│   │   ├── day-cloudy.css        # Overcast day theme
│   │   ├── day-rain.css          # Rainy day theme
│   │   ├── night-clear.css       # Clear night theme
│   │   ├── night-cloudy.css      # Cloudy night theme
│   │   └── snow.css              # Snow theme (any time)
│   └── animations/
│       ├── welcome.css           # Full-screen welcome animation
│       ├── rain.css              # Rain droplet effects
│       ├── snow.css              # Snowfall effects
│       ├── stars.css             # Night star drift
│       └── lens-flare.css        # Sunny lens flare
├── js/
│   ├── main.js                   # Core application logic
│   ├── geolocation.js            # IP geolocation service
│   ├── weather.js                # Weather API integration
│   ├── personalization.js        # Personalization engine
│   ├── welcome-animation.js      # Welcome sequence controller
│   ├── micro-interactions.js     # Weather-based effects
│   ├── distance-viz.js           # Distance visualization
│   ├── greetings.js              # Cultural greetings database
│   └── festivals.js              # Festival/holiday detector
├── assets/
│   ├── profile-images/           # Pre-generated Nano Banana images
│   │   ├── base.webp             # Default/fallback image
│   │   ├── us.webp
│   │   ├── india.webp
│   │   ├── brazil.webp
│   │   ├── japan.webp
│   │   ├── ... (all countries)
│   │   └── regions/
│   │       ├── south-america.webp
│   │       ├── africa-west.webp
│   │       ├── africa-east.webp
│   │       ├── middle-east.webp
│   │       ├── southeast-asia.webp
│   │       └── ... (all regions)
│   ├── backgrounds/              # Regional ambient backgrounds
│   │   ├── patterns/             # Abstract regional patterns
│   │   └── textures/             # Subtle texture overlays
│   ├── icons/                    # Lucide or custom SVG icons
│   └── fonts/                    # Self-hosted typography
├── data/
│   ├── countries.json            # Country metadata
│   ├── greetings.json            # Greetings in all languages
│   ├── festivals.json            # Festival dates by region
│   └── cultural-colors.json      # Regional color palettes
└── api/                          # If using serverless functions
    └── (for future backend needs)
```

### Step 1.2: External Service Setup

**Required API Keys (store securely, never commit to repo):**

1. **IP Geolocation**: Sign up at https://ipapi.co (free tier: 30k requests/month)
   - Alternative: https://ipinfo.io (50k free/month)
   
2. **Weather**: Sign up at https://openweathermap.org/api (free tier: 1M calls/month)
   - Use the "Current Weather Data" endpoint
   
3. **Hosting**: GitHub Pages (free, already using)
   - Note: All personalization must be client-side since GitHub Pages is static

**Environment Handling for Static Sites:**

Since GitHub Pages is static, API keys must be handled carefully:
- Option A: Use free tiers that allow CORS from any origin (ipapi.co does)
- Option B: Use a serverless function (Cloudflare Workers free tier) as a proxy
- Option C: Restrict API keys to your domain only

---

## Phase 2: Geolocation & Detection System

### Step 2.1: IP Geolocation Service

Create `js/geolocation.js`:

```javascript
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
      const data = await response.json();
      
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
  }
};
```

### Step 2.2: Weather Service

Create `js/weather.js`:

```javascript
/**
 * Weather Service
 * Fetches current weather conditions for visitor's location
 */

const WeatherService = {
  apiKey: 'YOUR_OPENWEATHERMAP_API_KEY', // Replace or use proxy
  cache: null,
  cacheKey: 'visitor_weather',
  cacheDuration: 1800000, // 30 minutes

  async fetch(lat, lon) {
    const cached = this.getFromCache();
    if (cached) return cached;

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      const weatherData = {
        condition: this.normalizeCondition(data.weather[0].main),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        is_day: data.weather[0].icon.includes('d'),
        sunrise: data.sys.sunrise * 1000,
        sunset: data.sys.sunset * 1000,
        fetched_at: Date.now()
      };

      this.saveToCache(weatherData);
      return weatherData;
    } catch (error) {
      console.error('Weather fetch failed:', error);
      return this.getFallback();
    }
  },

  normalizeCondition(condition) {
    // Normalize to our theme categories
    const mapping = {
      'Clear': 'clear',
      'Clouds': 'cloudy',
      'Rain': 'rain',
      'Drizzle': 'rain',
      'Thunderstorm': 'rain',
      'Snow': 'snow',
      'Mist': 'cloudy',
      'Fog': 'cloudy',
      'Haze': 'cloudy'
    };
    return mapping[condition] || 'clear';
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
      is_fallback: true
    };
  }
};
```

### Step 2.3: Local Time & Festival Detection

Create `js/festivals.js`:

```javascript
/**
 * Festival & Holiday Detection
 * Detects major cultural events based on date and region
 */

const FestivalService = {
  // Festival database - dates are approximate, some are lunar calendar
  festivals: {
    // Format: { name, greeting, regions, getDate(year) }
    diwali: {
      name: 'Diwali',
      greeting: 'Happy Diwali',
      greeting_local: 'शुभ दीपावली',
      regions: ['IN', 'NP', 'LK', 'MY', 'SG', 'FJ', 'MU', 'TT', 'GY', 'SR'],
      // Approximate dates (would need lunar calendar library for accuracy)
      dates_2024: { start: '2024-11-01', end: '2024-11-05' },
      dates_2025: { start: '2025-10-20', end: '2025-10-24' },
      dates_2026: { start: '2026-11-08', end: '2026-11-12' }
    },
    lunar_new_year: {
      name: 'Lunar New Year',
      greeting: 'Happy New Year',
      greeting_local: '新年快乐',
      regions: ['CN', 'TW', 'HK', 'SG', 'MY', 'VN', 'KR', 'ID', 'TH', 'PH'],
      dates_2024: { start: '2024-02-10', end: '2024-02-24' },
      dates_2025: { start: '2025-01-29', end: '2025-02-12' },
      dates_2026: { start: '2026-02-17', end: '2026-03-03' }
    },
    eid_al_fitr: {
      name: 'Eid al-Fitr',
      greeting: 'Eid Mubarak',
      greeting_local: 'عيد مبارك',
      regions: ['SA', 'AE', 'EG', 'ID', 'MY', 'PK', 'BD', 'TR', 'IR', 'IQ', 'MA', 'DZ', 'TN', 'LY', 'JO', 'LB', 'SY', 'KW', 'QA', 'BH', 'OM', 'YE'],
      dates_2024: { start: '2024-04-09', end: '2024-04-12' },
      dates_2025: { start: '2025-03-30', end: '2025-04-02' },
      dates_2026: { start: '2026-03-20', end: '2026-03-23' }
    },
    carnival: {
      name: 'Carnival',
      greeting: 'Happy Carnival',
      greeting_local: 'Feliz Carnaval',
      regions: ['BR', 'CO', 'VE', 'BO', 'EC', 'PE'],
      dates_2024: { start: '2024-02-09', end: '2024-02-14' },
      dates_2025: { start: '2025-02-28', end: '2025-03-05' },
      dates_2026: { start: '2026-02-13', end: '2026-02-18' }
    },
    thanksgiving_us: {
      name: 'Thanksgiving',
      greeting: 'Happy Thanksgiving',
      greeting_local: 'Happy Thanksgiving',
      regions: ['US'],
      // 4th Thursday of November
      dates_2024: { start: '2024-11-28', end: '2024-11-28' },
      dates_2025: { start: '2025-11-27', end: '2025-11-27' },
      dates_2026: { start: '2026-11-26', end: '2026-11-26' }
    },
    christmas: {
      name: 'Christmas',
      greeting: 'Merry Christmas',
      greeting_local: null, // Use local language
      regions: ['US', 'CA', 'GB', 'AU', 'NZ', 'DE', 'FR', 'IT', 'ES', 'PT', 'NL', 'BE', 'AT', 'CH', 'IE', 'PL', 'CZ', 'HU', 'RO', 'GR', 'SE', 'NO', 'DK', 'FI', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'PH'],
      dates_2024: { start: '2024-12-24', end: '2024-12-26' },
      dates_2025: { start: '2025-12-24', end: '2025-12-26' },
      dates_2026: { start: '2026-12-24', end: '2026-12-26' }
    },
    holi: {
      name: 'Holi',
      greeting: 'Happy Holi',
      greeting_local: 'होली मुबारक',
      regions: ['IN', 'NP', 'BD', 'PK'],
      dates_2024: { start: '2024-03-24', end: '2024-03-25' },
      dates_2025: { start: '2025-03-13', end: '2025-03-14' },
      dates_2026: { start: '2026-03-03', end: '2026-03-04' }
    }
  },

  detect(countryCode, date = new Date()) {
    const year = date.getFullYear();
    const dateStr = date.toISOString().split('T')[0];

    for (const [key, festival] of Object.entries(this.festivals)) {
      if (!festival.regions.includes(countryCode)) continue;
      
      const datesKey = `dates_${year}`;
      if (!festival[datesKey]) continue;
      
      const { start, end } = festival[datesKey];
      if (dateStr >= start && dateStr <= end) {
        return {
          key,
          ...festival,
          is_active: true
        };
      }
    }
    return null;
  }
};
```

---

## Phase 3: Profile Image System

### Step 3.1: Image Mapping Configuration

Create `data/countries.json`:

```json
{
  "countries": {
    "US": {
      "name": "United States",
      "image": "us.webp",
      "traditional_dress": "Western business casual / Americana",
      "greeting": "Hello",
      "greeting_formal": "Welcome",
      "language": "en",
      "color_palette": ["#002868", "#BF0A30", "#FFFFFF"],
      "aesthetic_keywords": ["minimalist", "modern", "clean lines"]
    },
    "IN": {
      "name": "India",
      "image": "india.webp",
      "traditional_dress": "Kurta or Sherwani",
      "greeting": "नमस्ते",
      "greeting_formal": "स्वागत है",
      "greeting_romanized": "Namaste",
      "language": "hi",
      "color_palette": ["#FF9933", "#FFFFFF", "#138808", "#000080"],
      "aesthetic_keywords": ["intricate", "vibrant", "ornate patterns"]
    },
    "JP": {
      "name": "Japan",
      "image": "japan.webp",
      "traditional_dress": "Haori jacket or modern minimalist",
      "greeting": "こんにちは",
      "greeting_formal": "ようこそ",
      "greeting_romanized": "Konnichiwa",
      "language": "ja",
      "color_palette": ["#BC002D", "#FFFFFF", "#000000"],
      "aesthetic_keywords": ["zen", "minimalist", "wabi-sabi", "clean"]
    },
    "BR": {
      "name": "Brazil",
      "image": "brazil.webp",
      "traditional_dress": "Linen suit or gaucho-inspired",
      "greeting": "Olá",
      "greeting_formal": "Bem-vindo",
      "language": "pt",
      "color_palette": ["#009739", "#FFDF00", "#002776"],
      "aesthetic_keywords": ["tropical", "vibrant", "organic curves"]
    },
    "CN": {
      "name": "China",
      "image": "china.webp",
      "traditional_dress": "Zhongshan suit or Tang jacket",
      "greeting": "你好",
      "greeting_formal": "欢迎",
      "greeting_romanized": "Nǐ hǎo",
      "language": "zh",
      "color_palette": ["#DE2910", "#FFDE00", "#FFFFFF"],
      "aesthetic_keywords": ["elegant", "silk", "traditional motifs"]
    },
    "GB": {
      "name": "United Kingdom",
      "image": "uk.webp",
      "traditional_dress": "Tweed jacket or formal British style",
      "greeting": "Hello",
      "greeting_formal": "Welcome",
      "language": "en",
      "color_palette": ["#012169", "#C8102E", "#FFFFFF"],
      "aesthetic_keywords": ["classic", "refined", "understated"]
    },
    "DE": {
      "name": "Germany",
      "image": "germany.webp",
      "traditional_dress": "Modern professional or Trachten-inspired",
      "greeting": "Hallo",
      "greeting_formal": "Willkommen",
      "language": "de",
      "color_palette": ["#000000", "#DD0000", "#FFCC00"],
      "aesthetic_keywords": ["bauhaus", "functional", "precise"]
    },
    "FR": {
      "name": "France",
      "image": "france.webp",
      "traditional_dress": "Parisian chic / beret optional",
      "greeting": "Bonjour",
      "greeting_formal": "Bienvenue",
      "language": "fr",
      "color_palette": ["#002395", "#FFFFFF", "#ED2939"],
      "aesthetic_keywords": ["elegant", "romantic", "refined"]
    },
    "IT": {
      "name": "Italy",
      "image": "italy.webp",
      "traditional_dress": "Italian tailored style",
      "greeting": "Ciao",
      "greeting_formal": "Benvenuto",
      "language": "it",
      "color_palette": ["#009246", "#FFFFFF", "#CE2B37"],
      "aesthetic_keywords": ["renaissance", "artisanal", "sophisticated"]
    },
    "ES": {
      "name": "Spain",
      "image": "spain.webp",
      "traditional_dress": "Spanish formal or regional touch",
      "greeting": "Hola",
      "greeting_formal": "Bienvenido",
      "language": "es",
      "color_palette": ["#AA151B", "#F1BF00", "#FFFFFF"],
      "aesthetic_keywords": ["warm", "passionate", "moorish influence"]
    },
    "KR": {
      "name": "South Korea",
      "image": "korea.webp",
      "traditional_dress": "Modern hanbok-inspired or K-fashion",
      "greeting": "안녕하세요",
      "greeting_formal": "환영합니다",
      "greeting_romanized": "Annyeonghaseyo",
      "language": "ko",
      "color_palette": ["#003478", "#C60C30", "#FFFFFF", "#000000"],
      "aesthetic_keywords": ["modern", "sleek", "tech-forward"]
    },
    "CA": {
      "name": "Canada",
      "image": "canada.webp",
      "traditional_dress": "Smart casual with subtle plaid",
      "greeting": "Hello / Bonjour",
      "greeting_formal": "Welcome / Bienvenue",
      "language": "en",
      "color_palette": ["#FF0000", "#FFFFFF"],
      "aesthetic_keywords": ["natural", "warm", "approachable"]
    },
    "AU": {
      "name": "Australia",
      "image": "australia.webp",
      "traditional_dress": "Relaxed smart casual",
      "greeting": "G'day",
      "greeting_formal": "Welcome",
      "language": "en",
      "color_palette": ["#00008B", "#FFFFFF", "#FFD700", "#008000"],
      "aesthetic_keywords": ["outdoor", "relaxed", "natural"]
    },
    "MX": {
      "name": "Mexico",
      "image": "mexico.webp",
      "traditional_dress": "Guayabera or modern Mexican style",
      "greeting": "Hola",
      "greeting_formal": "Bienvenido",
      "language": "es",
      "color_palette": ["#006341", "#FFFFFF", "#CE1126"],
      "aesthetic_keywords": ["vibrant", "folkloric", "warm colors"]
    },
    "NL": {
      "name": "Netherlands",
      "image": "netherlands.webp",
      "traditional_dress": "Dutch modern minimalist",
      "greeting": "Hallo",
      "greeting_formal": "Welkom",
      "language": "nl",
      "color_palette": ["#AE1C28", "#FFFFFF", "#21468B", "#FF6600"],
      "aesthetic_keywords": ["design-forward", "practical", "clean"]
    },
    "CH": {
      "name": "Switzerland",
      "image": "switzerland.webp",
      "traditional_dress": "Alpine-inspired formal",
      "greeting": "Grüezi",
      "greeting_formal": "Willkommen",
      "language": "de",
      "color_palette": ["#FF0000", "#FFFFFF"],
      "aesthetic_keywords": ["precise", "luxurious", "alpine"]
    },
    "SE": {
      "name": "Sweden",
      "image": "sweden.webp",
      "traditional_dress": "Scandinavian minimalist",
      "greeting": "Hej",
      "greeting_formal": "Välkommen",
      "language": "sv",
      "color_palette": ["#006AA7", "#FECC00"],
      "aesthetic_keywords": ["lagom", "functional", "light wood"]
    },
    "PL": {
      "name": "Poland",
      "image": "poland.webp",
      "traditional_dress": "Polish formal with subtle folk elements",
      "greeting": "Cześć",
      "greeting_formal": "Witamy",
      "language": "pl",
      "color_palette": ["#FFFFFF", "#DC143C"],
      "aesthetic_keywords": ["historic", "resilient", "geometric folk"]
    },
    "BE": {
      "name": "Belgium",
      "image": "belgium.webp",
      "traditional_dress": "European professional",
      "greeting": "Hallo / Bonjour",
      "greeting_formal": "Welkom / Bienvenue",
      "language": "nl",
      "color_palette": ["#000000", "#FFD700", "#FF0000"],
      "aesthetic_keywords": ["art nouveau", "surreal", "refined"]
    },
    "AT": {
      "name": "Austria",
      "image": "austria.webp",
      "traditional_dress": "Austrian formal or Tracht-inspired",
      "greeting": "Servus",
      "greeting_formal": "Willkommen",
      "language": "de",
      "color_palette": ["#ED2939", "#FFFFFF"],
      "aesthetic_keywords": ["imperial", "musical", "alpine"]
    },
    "NO": {
      "name": "Norway",
      "image": "norway.webp",
      "traditional_dress": "Norwegian modern or bunad-inspired",
      "greeting": "Hei",
      "greeting_formal": "Velkommen",
      "language": "no",
      "color_palette": ["#BA0C2F", "#FFFFFF", "#00205B"],
      "aesthetic_keywords": ["fjord", "natural", "midnight sun"]
    },
    "DK": {
      "name": "Denmark",
      "image": "denmark.webp",
      "traditional_dress": "Danish hygge style",
      "greeting": "Hej",
      "greeting_formal": "Velkommen",
      "language": "da",
      "color_palette": ["#C8102E", "#FFFFFF"],
      "aesthetic_keywords": ["hygge", "cozy", "functional design"]
    },
    "IE": {
      "name": "Ireland",
      "image": "ireland.webp",
      "traditional_dress": "Irish tweed or modern Celtic",
      "greeting": "Dia dhuit",
      "greeting_formal": "Fáilte",
      "language": "en",
      "color_palette": ["#009A49", "#FFFFFF", "#FF7900"],
      "aesthetic_keywords": ["celtic", "green", "literary"]
    }
  },
  "regions": {
    "SOUTH_AMERICA": {
      "name": "South America",
      "countries": ["AR", "CL", "CO", "PE", "VE", "EC", "BO", "PY", "UY", "GY", "SR"],
      "image": "south-america.webp",
      "greeting": "Hola",
      "language": "es",
      "color_palette": ["#FCD116", "#009739", "#003893"],
      "aesthetic_keywords": ["tropical", "vibrant", "indigenous patterns"]
    },
    "CENTRAL_AMERICA": {
      "name": "Central America & Caribbean",
      "countries": ["GT", "HN", "SV", "NI", "CR", "PA", "CU", "DO", "HT", "JM", "TT", "PR", "BS", "BB"],
      "image": "central-america.webp",
      "greeting": "Hola",
      "language": "es",
      "color_palette": ["#00BFFF", "#FFD700", "#228B22"],
      "aesthetic_keywords": ["caribbean", "tropical", "colonial"]
    },
    "WEST_AFRICA": {
      "name": "West Africa",
      "countries": ["NG", "GH", "SN", "CI", "ML", "BF", "NE", "GN", "BJ", "TG", "SL", "LR", "GM", "GW", "CV", "MR"],
      "image": "west-africa.webp",
      "greeting": "Hello",
      "language": "en",
      "color_palette": ["#FCD116", "#009739", "#CE1126"],
      "aesthetic_keywords": ["kente", "vibrant", "bold patterns"]
    },
    "EAST_AFRICA": {
      "name": "East Africa",
      "countries": ["KE", "TZ", "UG", "RW", "ET", "SO", "DJ", "ER", "SS", "BI", "MW", "MZ", "ZM", "ZW"],
      "image": "east-africa.webp",
      "greeting": "Jambo",
      "language": "sw",
      "color_palette": ["#000000", "#BB0000", "#006600"],
      "aesthetic_keywords": ["savanna", "maasai", "earth tones"]
    },
    "NORTH_AFRICA": {
      "name": "North Africa",
      "countries": ["EG", "MA", "DZ", "TN", "LY", "SD"],
      "image": "north-africa.webp",
      "greeting": "مرحبا",
      "greeting_romanized": "Marhaba",
      "language": "ar",
      "color_palette": ["#C8102E", "#007A3D", "#FFFFFF"],
      "aesthetic_keywords": ["arabesque", "geometric", "mediterranean"]
    },
    "SOUTHERN_AFRICA": {
      "name": "Southern Africa",
      "countries": ["ZA", "BW", "NA", "SZ", "LS", "AO"],
      "image": "southern-africa.webp",
      "greeting": "Sawubona",
      "language": "zu",
      "color_palette": ["#007A4D", "#FFB612", "#DE3831", "#002395", "#000000"],
      "aesthetic_keywords": ["rainbow nation", "ndebele", "natural"]
    },
    "MIDDLE_EAST": {
      "name": "Middle East",
      "countries": ["SA", "AE", "QA", "KW", "BH", "OM", "YE", "JO", "LB", "SY", "IQ", "IR", "IL", "PS"],
      "image": "middle-east.webp",
      "greeting": "مرحبا",
      "greeting_romanized": "Marhaba",
      "language": "ar",
      "color_palette": ["#006C35", "#FFFFFF", "#CE1126"],
      "aesthetic_keywords": ["islamic geometry", "calligraphy", "desert"]
    },
    "SOUTH_ASIA": {
      "name": "South Asia",
      "countries": ["PK", "BD", "LK", "NP", "BT", "MV", "AF"],
      "image": "south-asia.webp",
      "greeting": "Namaste",
      "language": "hi",
      "color_palette": ["#01411C", "#FFFFFF", "#FF6600", "#000080"],
      "aesthetic_keywords": ["mughal", "intricate", "vibrant textiles"]
    },
    "SOUTHEAST_ASIA": {
      "name": "Southeast Asia",
      "countries": ["TH", "VN", "PH", "MY", "SG", "ID", "MM", "KH", "LA", "BN"],
      "image": "southeast-asia.webp",
      "greeting": "Hello",
      "language": "en",
      "color_palette": ["#FF0000", "#FFD700", "#00FF00"],
      "aesthetic_keywords": ["tropical", "temple", "batik"]
    },
    "CENTRAL_ASIA": {
      "name": "Central Asia",
      "countries": ["KZ", "UZ", "TM", "TJ", "KG", "MN"],
      "image": "central-asia.webp",
      "greeting": "Salam",
      "language": "ru",
      "color_palette": ["#00AFCA", "#FFCC00", "#6CBB3C"],
      "aesthetic_keywords": ["silk road", "nomadic", "geometric"]
    },
    "EASTERN_EUROPE": {
      "name": "Eastern Europe",
      "countries": ["RU", "UA", "BY", "MD", "RO", "BG", "RS", "HR", "SI", "BA", "ME", "MK", "AL", "XK", "CZ", "SK", "HU", "LT", "LV", "EE"],
      "image": "eastern-europe.webp",
      "greeting": "Здравствуйте",
      "greeting_romanized": "Zdravstvuyte",
      "language": "ru",
      "color_palette": ["#0033A0", "#FFD700", "#DA291C"],
      "aesthetic_keywords": ["orthodox", "folk", "resilient"]
    },
    "OCEANIA": {
      "name": "Oceania & Pacific",
      "countries": ["NZ", "FJ", "PG", "WS", "TO", "VU", "SB", "NC", "PF", "GU"],
      "image": "oceania.webp",
      "greeting": "Kia ora",
      "language": "en",
      "color_palette": ["#000000", "#FFFFFF", "#CC142B"],
      "aesthetic_keywords": ["polynesian", "ocean", "tribal patterns"]
    }
  }
}
```

### Step 3.2: Profile Image Loader

Create `js/personalization.js`:

```javascript
/**
 * Personalization Engine
 * Orchestrates all personalization based on visitor context
 */

const PersonalizationEngine = {
  countryData: null,
  visitorContext: null,

  async initialize() {
    // Load country/region data
    const response = await fetch('/data/countries.json');
    this.countryData = await response.json();

    // Detect visitor context
    const geo = await GeoService.detect();
    const weather = await WeatherService.fetch(geo.latitude, geo.longitude);
    const festival = FestivalService.detect(geo.country_code);
    const localTime = this.getLocalTime(geo.timezone);

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
    // Check if we have specific country data
    if (this.countryData.countries[countryCode]) {
      return {
        ...this.countryData.countries[countryCode],
        type: 'country',
        code: countryCode
      };
    }

    // Fall back to region
    for (const [regionKey, region] of Object.entries(this.countryData.regions)) {
      if (region.countries.includes(countryCode)) {
        return {
          ...region,
          type: 'region',
          code: regionKey
        };
      }
    }

    // Ultimate fallback
    return {
      name: 'World',
      image: 'base.webp',
      greeting: 'Hello',
      greeting_formal: 'Welcome',
      language: 'en',
      type: 'fallback'
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
    const date = new Date(localTimeStr);
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
    const info = this.visitorContext.countryInfo;
    const basePath = '/assets/profile-images/';
    
    if (info.type === 'region') {
      return `${basePath}regions/${info.image}`;
    }
    return `${basePath}${info.image}`;
  },

  getGreeting() {
    const info = this.visitorContext.countryInfo;
    const festival = this.visitorContext.festival;
    const timeOfDay = this.visitorContext.timeOfDay;

    // If there's an active festival, lead with that
    if (festival) {
      return {
        primary: festival.greeting_local || festival.greeting,
        secondary: festival.greeting,
        isFestival: true,
        festivalName: festival.name
      };
    }

    // Time-appropriate greeting
    const timeGreetings = {
      morning: { en: 'Good morning', suffix: '☀️' },
      afternoon: { en: 'Good afternoon', suffix: '' },
      evening: { en: 'Good evening', suffix: '' },
      night: { en: 'Good evening', suffix: '🌙' }
    };

    return {
      primary: info.greeting || info.greeting_formal,
      secondary: timeGreetings[timeOfDay].en,
      romanized: info.greeting_romanized || null,
      isFestival: false
    };
  },

  getColorPalette() {
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
  }
};
```

---

## Phase 4: Welcome Animation System

### Step 4.1: Animation Controller

Create `js/welcome-animation.js`:

```javascript
/**
 * Welcome Animation Controller
 * Manages the full-screen welcome → minimized profile transition
 */

const WelcomeAnimation = {
  duration: 5000, // 5 seconds
  elements: {
    overlay: null,
    profileLarge: null,
    greeting: null,
    profileSmall: null
  },

  async initialize(context) {
    this.createOverlay();
    this.setContent(context);
    await this.play();
  },

  createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'welcome-overlay';
    overlay.innerHTML = `
      <div class="welcome-container">
        <div class="welcome-profile-large">
          <img src="" alt="Profile" class="welcome-avatar" />
        </div>
        <div class="welcome-greeting">
          <h1 class="greeting-primary"></h1>
          <p class="greeting-secondary"></p>
          <p class="greeting-romanized"></p>
        </div>
        <div class="welcome-subtext">
          <p>Vincent Rios</p>
          <p class="welcome-title">Assistant Professor, Rutgers University</p>
        </div>
      </div>
    `;
    document.body.prepend(overlay);
    this.elements.overlay = overlay;
  },

  setContent(context) {
    const profilePath = PersonalizationEngine.getProfileImagePath();
    const greeting = PersonalizationEngine.getGreeting();

    // Set profile image
    const avatar = this.elements.overlay.querySelector('.welcome-avatar');
    avatar.src = profilePath;

    // Set greeting text
    const primaryEl = this.elements.overlay.querySelector('.greeting-primary');
    const secondaryEl = this.elements.overlay.querySelector('.greeting-secondary');
    const romanizedEl = this.elements.overlay.querySelector('.greeting-romanized');

    primaryEl.textContent = greeting.primary;
    secondaryEl.textContent = greeting.secondary;
    
    if (greeting.romanized) {
      romanizedEl.textContent = `(${greeting.romanized})`;
      romanizedEl.style.display = 'block';
    } else {
      romanizedEl.style.display = 'none';
    }

    // Festival badge if active
    if (greeting.isFestival) {
      const badge = document.createElement('div');
      badge.className = 'festival-badge';
      badge.textContent = greeting.festivalName;
      this.elements.overlay.querySelector('.welcome-container').appendChild(badge);
    }
  },

  async play() {
    const overlay = this.elements.overlay;
    const mainProfile = document.querySelector('.site-profile-image');

    return new Promise((resolve) => {
      // Phase 1: Fade in (0-0.5s)
      overlay.classList.add('fade-in');

      // Phase 2: Hold (0.5s-4s)
      setTimeout(() => {
        overlay.classList.add('visible');
      }, 500);

      // Phase 3: Shrink and move (4s-5s)
      setTimeout(() => {
        // Get target position (where the small profile will be)
        const targetRect = mainProfile.getBoundingClientRect();
        const avatarRect = overlay.querySelector('.welcome-profile-large').getBoundingClientRect();

        // Calculate transform
        const scaleX = targetRect.width / avatarRect.width;
        const scaleY = targetRect.height / avatarRect.height;
        const translateX = targetRect.left - avatarRect.left + (targetRect.width - avatarRect.width) / 2;
        const translateY = targetRect.top - avatarRect.top + (targetRect.height - avatarRect.height) / 2;

        // Apply CSS custom properties for the animation
        overlay.style.setProperty('--target-scale', Math.min(scaleX, scaleY));
        overlay.style.setProperty('--target-x', `${translateX}px`);
        overlay.style.setProperty('--target-y', `${translateY}px`);

        overlay.classList.add('shrinking');
      }, 4000);

      // Phase 4: Fade out overlay, reveal site
      setTimeout(() => {
        overlay.classList.add('fade-out');
        document.body.classList.add('site-revealed');
      }, 4800);

      // Complete
      setTimeout(() => {
        overlay.remove();
        resolve();
      }, this.duration);
    });
  }
};
```

### Step 4.2: Welcome Animation CSS

Create `css/animations/welcome.css`:

```css
/* Welcome Overlay Base */
#welcome-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary, #0a0a0f);
  opacity: 0;
  transition: opacity 0.5s ease-out;
}

#welcome-overlay.fade-in {
  opacity: 1;
}

#welcome-overlay.fade-out {
  opacity: 0;
  pointer-events: none;
}

/* Welcome Container */
.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  text-align: center;
}

/* Large Profile Image */
.welcome-profile-large {
  width: min(300px, 60vw);
  height: min(300px, 60vw);
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 
    0 0 0 2px rgba(255, 255, 255, 0.1),
    0 20px 60px rgba(0, 0, 0, 0.5);
  transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.welcome-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Shrinking Animation */
#welcome-overlay.shrinking .welcome-profile-large {
  transform: 
    translate(var(--target-x), var(--target-y)) 
    scale(var(--target-scale));
}

#welcome-overlay.shrinking .welcome-greeting,
#welcome-overlay.shrinking .welcome-subtext,
#welcome-overlay.shrinking .festival-badge {
  opacity: 0;
  transform: translateY(20px);
}

/* Greeting Text */
.welcome-greeting {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.greeting-primary {
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 300;
  color: var(--text-primary, #ffffff);
  margin: 0;
  letter-spacing: 0.02em;
}

.greeting-secondary {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  font-weight: 400;
  color: var(--text-secondary, rgba(255, 255, 255, 0.7));
  margin: 0.5rem 0 0;
}

.greeting-romanized {
  font-size: clamp(0.875rem, 2vw, 1rem);
  color: var(--text-tertiary, rgba(255, 255, 255, 0.5));
  font-style: italic;
  margin: 0.25rem 0 0;
}

/* Subtext */
.welcome-subtext {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.welcome-subtext p {
  margin: 0;
  color: var(--text-secondary, rgba(255, 255, 255, 0.7));
}

.welcome-title {
  font-size: 0.875rem;
  opacity: 0.7;
}

/* Festival Badge */
.festival-badge {
  position: absolute;
  bottom: 2rem;
  padding: 0.5rem 1.5rem;
  background: var(--accent-primary, rgba(255, 255, 255, 0.1));
  border-radius: 2rem;
  font-size: 0.875rem;
  color: var(--text-primary, #ffffff);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
```

---

## Phase 5: Micro-Interactions & Weather Effects

### Step 5.1: Weather Effect Controller

Create `js/micro-interactions.js`:

```javascript
/**
 * Micro-Interaction Controller
 * Manages subtle weather-based visual effects
 */

const MicroInteractions = {
  activeEffects: [],
  canvas: null,
  ctx: null,

  initialize(weather) {
    this.createCanvas();
    
    switch (weather.condition) {
      case 'rain':
        this.startRainEffect();
        break;
      case 'snow':
        this.startSnowEffect();
        break;
      case 'clear':
        if (!weather.is_day) {
          this.startStarEffect();
        } else {
          this.startLensFlareEffect();
        }
        break;
    }
  },

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'weather-effects-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 1;
      opacity: 0.6;
    `;
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  // Rain Effect
  startRainEffect() {
    const drops = [];
    const dropCount = Math.floor(window.innerWidth / 15);

    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        length: Math.random() * 15 + 10,
        speed: Math.random() * 3 + 4,
        opacity: Math.random() * 0.3 + 0.1
      });
    }

    const animate = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      drops.forEach(drop => {
        this.ctx.beginPath();
        this.ctx.moveTo(drop.x, drop.y);
        this.ctx.lineTo(drop.x + 1, drop.y + drop.length);
        this.ctx.strokeStyle = `rgba(174, 194, 224, ${drop.opacity})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        drop.y += drop.speed;
        if (drop.y > this.canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * this.canvas.width;
        }
      });

      this.activeEffects.push(requestAnimationFrame(animate));
    };

    animate();
  },

  // Snow Effect
  startSnowEffect() {
    const flakes = [];
    const flakeCount = Math.floor(window.innerWidth / 20);

    for (let i = 0; i < flakeCount; i++) {
      flakes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 2 + 1,
        speed: Math.random() * 1 + 0.5,
        drift: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.3
      });
    }

    const animate = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      flakes.forEach(flake => {
        this.ctx.beginPath();
        this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        this.ctx.fill();

        flake.y += flake.speed;
        flake.x += flake.drift + Math.sin(flake.y * 0.01) * 0.5;

        if (flake.y > this.canvas.height) {
          flake.y = -flake.radius;
          flake.x = Math.random() * this.canvas.width;
        }
      });

      this.activeEffects.push(requestAnimationFrame(animate));
    };

    animate();
  },

  // Star Effect (Night)
  startStarEffect() {
    const stars = [];
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        baseOpacity: Math.random() * 0.5 + 0.3
      });
    }

    let time = 0;
    const animate = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
        const opacity = star.baseOpacity + twinkle * 0.2;

        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        this.ctx.fill();

        // Slow drift
        star.x += 0.01;
        if (star.x > this.canvas.width) star.x = 0;
      });

      time++;
      this.activeEffects.push(requestAnimationFrame(animate));
    };

    animate();
  },

  // Lens Flare Effect (Sunny Day)
  startLensFlareEffect() {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animate = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Subtle gradient following scroll/mouse
      const gradient = this.ctx.createRadialGradient(
        mouseX, mouseY, 0,
        mouseX, mouseY, 300
      );
      gradient.addColorStop(0, 'rgba(255, 250, 230, 0.15)');
      gradient.addColorStop(0.5, 'rgba(255, 245, 200, 0.05)');
      gradient.addColorStop(1, 'rgba(255, 240, 180, 0)');

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.activeEffects.push(requestAnimationFrame(animate));
    };

    animate();
  },

  destroy() {
    this.activeEffects.forEach(id => cancelAnimationFrame(id));
    if (this.canvas) this.canvas.remove();
  }
};
```

---

## Phase 6: Distance Visualization

### Step 6.1: Distance Calculator & Visualizer

Create `js/distance-viz.js`:

```javascript
/**
 * Distance Visualization
 * Shows animated connection line from New Jersey to visitor location
 */

const DistanceVisualization = {
  // Vincent's location (New Brunswick, NJ)
  origin: {
    lat: 40.4862,
    lon: -74.4518,
    name: 'New Jersey'
  },

  svg: null,

  initialize(visitorGeo) {
    const distance = this.calculateDistance(
      this.origin.lat, this.origin.lon,
      visitorGeo.latitude, visitorGeo.longitude
    );

    this.createVisualization(visitorGeo, distance);
  },

  calculateDistance(lat1, lon1, lat2, lon2) {
    // Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  },

  toRad(deg) {
    return deg * (Math.PI / 180);
  },

  createVisualization(visitorGeo, distance) {
    const container = document.createElement('div');
    container.className = 'distance-viz';
    container.innerHTML = `
      <div class="distance-content">
        <svg class="distance-map" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
          <!-- Simplified world outline or abstract representation -->
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color: var(--accent-primary); stop-opacity: 1" />
              <stop offset="100%" style="stop-color: var(--accent-secondary); stop-opacity: 0.5" />
            </linearGradient>
          </defs>
          
          <!-- Origin point (NJ) -->
          <circle class="origin-point" cx="100" cy="100" r="4" />
          <text class="origin-label" x="100" y="120" text-anchor="middle">NJ</text>
          
          <!-- Destination point -->
          <circle class="dest-point" cx="300" cy="100" r="4" />
          <text class="dest-label" x="300" y="120" text-anchor="middle">${visitorGeo.country_code}</text>
          
          <!-- Animated arc -->
          <path class="connection-arc" 
                d="M 100 100 Q 200 30 300 100" 
                fill="none" 
                stroke="url(#line-gradient)" 
                stroke-width="2"
                stroke-dasharray="200"
                stroke-dashoffset="200" />
        </svg>
        
        <div class="distance-text">
          <span class="distance-value">${distance.toLocaleString()}</span>
          <span class="distance-unit">km apart</span>
        </div>
        
        <p class="distance-insight">
          Information travels fast. A viral message could reach here in hours.
        </p>
      </div>
    `;

    // Find insertion point (e.g., in footer or as floating element)
    const footer = document.querySelector('footer') || document.body;
    footer.insertBefore(container, footer.firstChild);

    // Trigger animation after a delay
    setTimeout(() => {
      container.querySelector('.connection-arc').style.strokeDashoffset = '0';
    }, 500);
  }
};
```

### Step 6.2: Distance Visualization CSS

Add to `css/main.css`:

```css
/* Distance Visualization */
.distance-viz {
  padding: 3rem 0;
  border-top: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1));
  margin-top: 4rem;
}

.distance-content {
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
}

.distance-map {
  width: 100%;
  max-width: 400px;
  height: auto;
  margin-bottom: 1.5rem;
}

.origin-point,
.dest-point {
  fill: var(--accent-primary, #6366f1);
}

.origin-label,
.dest-label {
  font-size: 10px;
  fill: var(--text-secondary, rgba(255, 255, 255, 0.6));
  font-family: var(--font-mono, monospace);
}

.connection-arc {
  transition: stroke-dashoffset 2s ease-out;
}

.distance-text {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.distance-value {
  font-size: 2.5rem;
  font-weight: 300;
  color: var(--text-primary, #ffffff);
  font-variant-numeric: tabular-nums;
}

.distance-unit {
  font-size: 1rem;
  color: var(--text-secondary, rgba(255, 255, 255, 0.6));
}

.distance-insight {
  font-size: 0.875rem;
  color: var(--text-tertiary, rgba(255, 255, 255, 0.5));
  font-style: italic;
  margin: 0;
}
```

---

## Phase 7: Theme System

### Step 7.1: CSS Custom Properties & Theme Switching

Create `css/themes/base.css`:

```css
/* Base Theme Variables */
:root {
  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-serif: 'Newsreader', Georgia, serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --space-xl: 4rem;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 500ms ease;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;
}

/* Day Clear Theme */
[data-theme="day-clear"] {
  --bg-primary: #fafafa;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f5f5f5;
  
  --text-primary: #1a1a1a;
  --text-secondary: #525252;
  --text-tertiary: #a3a3a3;
  
  --accent-primary: #2563eb;
  --accent-secondary: #60a5fa;
  
  --border-subtle: rgba(0, 0, 0, 0.08);
  --border-medium: rgba(0, 0, 0, 0.15);
  
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.12);
}

/* Day Cloudy Theme */
[data-theme="day-cloudy"] {
  --bg-primary: #f0f0f0;
  --bg-secondary: #f8f8f8;
  --bg-tertiary: #e8e8e8;
  
  --text-primary: #262626;
  --text-secondary: #5c5c5c;
  --text-tertiary: #9ca3af;
  
  --accent-primary: #4b5563;
  --accent-secondary: #9ca3af;
  
  --border-subtle: rgba(0, 0, 0, 0.06);
  --border-medium: rgba(0, 0, 0, 0.12);
}

/* Day Rain Theme */
[data-theme="day-rain"] {
  --bg-primary: #e4e8eb;
  --bg-secondary: #eef1f4;
  --bg-tertiary: #d9dfe4;
  
  --text-primary: #1e293b;
  --text-secondary: #475569;
  --text-tertiary: #94a3b8;
  
  --accent-primary: #3b82f6;
  --accent-secondary: #93c5fd;
  
  --border-subtle: rgba(0, 0, 0, 0.05);
  --border-medium: rgba(0, 0, 0, 0.1);
}

/* Night Clear Theme */
[data-theme="night-clear"] {
  --bg-primary: #0a0a0f;
  --bg-secondary: #111118;
  --bg-tertiary: #18181f;
  
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --text-tertiary: #52525b;
  
  --accent-primary: #8b5cf6;
  --accent-secondary: #c4b5fd;
  
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-medium: rgba(255, 255, 255, 0.12);
  
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.5);
}

/* Night Cloudy Theme */
[data-theme="night-cloudy"] {
  --bg-primary: #0d0d12;
  --bg-secondary: #15151c;
  --bg-tertiary: #1c1c25;
  
  --text-primary: #e4e4e7;
  --text-secondary: #9898a3;
  --text-tertiary: #5a5a66;
  
  --accent-primary: #6366f1;
  --accent-secondary: #a5b4fc;
}

/* Night Rain Theme */
[data-theme="night-rain"] {
  --bg-primary: #080810;
  --bg-secondary: #0f0f18;
  --bg-tertiary: #161620;
  
  --text-primary: #d4d4d8;
  --text-secondary: #8b8b96;
  --text-tertiary: #52525c;
  
  --accent-primary: #818cf8;
  --accent-secondary: #c7d2fe;
}

/* Snow Theme */
[data-theme="snow"] {
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f1f5f9;
  
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-tertiary: #94a3b8;
  
  --accent-primary: #0ea5e9;
  --accent-secondary: #7dd3fc;
  
  --border-subtle: rgba(148, 163, 184, 0.2);
  --border-medium: rgba(148, 163, 184, 0.3);
}
```

---

## Phase 8: Main Application Entry Point

### Step 8.1: Main JavaScript Controller

Create `js/main.js`:

```javascript
/**
 * Main Application Controller
 * Orchestrates all personalization systems
 */

(async function initializePersonalizedSite() {
  'use strict';

  // Show loading state
  document.body.classList.add('loading');

  try {
    // Step 1: Initialize personalization engine
    const context = await PersonalizationEngine.initialize();
    console.log('Visitor context:', context);

    // Step 2: Apply theme
    document.documentElement.setAttribute('data-theme', context.theme);

    // Step 3: Set profile image on main site (for after animation)
    const mainProfileImg = document.querySelector('.site-profile-image img');
    if (mainProfileImg) {
      mainProfileImg.src = PersonalizationEngine.getProfileImagePath();
    }

    // Step 4: Initialize and play welcome animation
    await WelcomeAnimation.initialize(context);

    // Step 5: Start micro-interactions
    MicroInteractions.initialize(context.weather);

    // Step 6: Initialize distance visualization
    if (!context.geo.is_fallback) {
      DistanceVisualization.initialize(context.geo);
    }

    // Step 7: Apply cultural color accents (optional)
    applyCulturalAccents(context.countryInfo);

    // Step 8: Handle returning visitors
    handleReturningVisitor();

  } catch (error) {
    console.error('Personalization failed:', error);
    // Graceful degradation - site still works without personalization
    document.documentElement.setAttribute('data-theme', 'day-clear');
  } finally {
    document.body.classList.remove('loading');
  }
})();

function applyCulturalAccents(countryInfo) {
  if (!countryInfo.color_palette || countryInfo.color_palette.length === 0) return;

  // Use first cultural color as subtle accent
  const accentColor = countryInfo.color_palette[0];
  document.documentElement.style.setProperty('--cultural-accent', accentColor);
  
  // Apply to specific elements if desired
  // e.g., subtle border on profile, link hover states, etc.
}

function handleReturningVisitor() {
  const visitKey = 'visit_count';
  const visits = parseInt(localStorage.getItem(visitKey) || '0') + 1;
  localStorage.setItem(visitKey, visits.toString());

  if (visits > 1) {
    // Could show "Welcome back" instead of just the greeting
    // Or highlight "What's new since your last visit"
    console.log(`Returning visitor (visit #${visits})`);
  }
}
```

---

## Phase 9: Testing & Quality Assurance

### Step 9.1: Testing Checklist

```markdown
## Personalization Testing Checklist

### Geolocation
- [ ] Test with VPN set to different countries
- [ ] Verify fallback behavior when geolocation fails
- [ ] Check localStorage caching works correctly
- [ ] Confirm rate limits aren't hit on ipapi.co

### Weather
- [ ] Test all weather conditions (may need to mock)
- [ ] Verify day/night detection accuracy
- [ ] Check theme transitions are smooth
- [ ] Test fallback when API fails

### Profile Images
- [ ] All country images load correctly
- [ ] All regional fallback images load
- [ ] Images are optimized (WebP, correct dimensions)
- [ ] Base fallback image works

### Welcome Animation
- [ ] Animation plays smoothly
- [ ] Profile shrinks to correct position
- [ ] Greeting text is correct for locale
- [ ] Festival greetings show at right times
- [ ] Works on mobile devices

### Micro-Interactions
- [ ] Rain effect renders properly
- [ ] Snow effect renders properly
- [ ] Star effect renders properly
- [ ] Lens flare effect renders properly
- [ ] Effects don't impact scroll performance
- [ ] Canvas resizes on window resize

### Distance Visualization
- [ ] Distance calculation is accurate
- [ ] Animation plays smoothly
- [ ] Looks good at various distances

### Themes
- [ ] All 7 themes render correctly
- [ ] Transitions between themes are smooth
- [ ] Cultural color accents apply properly
- [ ] Contrast ratios meet accessibility standards

### Performance
- [ ] Initial load under 3s on 3G
- [ ] All API calls cached appropriately
- [ ] Images lazy-loaded where possible
- [ ] No layout shift during personalization
- [ ] Works without JavaScript (graceful degradation)

### Cross-Browser
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] iOS Safari
- [ ] Android Chrome

### Accessibility
- [ ] All text has sufficient contrast
- [ ] Animations respect prefers-reduced-motion
- [ ] Screen reader announces content properly
- [ ] Keyboard navigation works
```

### Step 9.2: Performance Optimization Notes

```markdown
## Performance Guidelines

1. **Image Optimization**
   - All profile images: 400x400px max, WebP format, <50KB each
   - Use `loading="lazy"` for below-fold images
   - Preload the detected country's image

2. **API Calls**
   - Cache geolocation for 1 hour
   - Cache weather for 30 minutes
   - Use Promise.all() for parallel requests

3. **Animation Performance**
   - Use CSS transforms, not top/left
   - Use will-change sparingly
   - Debounce scroll handlers
   - Use requestAnimationFrame for canvas

4. **Bundle Size**
   - Keep total JS under 50KB gzipped
   - Inline critical CSS
   - Defer non-critical scripts

5. **Caching Strategy**
   - Static assets: 1 year cache
   - HTML: no-cache, ETag
   - API responses: as specified above
```

---

## Phase 10: Deployment

### Step 10.1: GitHub Pages Deployment

```markdown
## Deployment Steps

1. **Pre-deployment Checklist**
   - [ ] All images optimized and in /assets/profile-images/
   - [ ] API keys removed from committed code
   - [ ] All tests passing
   - [ ] Performance audit passed

2. **Repository Setup**
   - Ensure repo is named `gvrkiran.github.io`
   - Push all changes to `main` branch
   - GitHub Pages will auto-deploy

3. **Custom Domain (if applicable)**
   - Add CNAME file with domain
   - Configure DNS records
   - Enable HTTPS in repo settings

4. **Post-deployment Verification**
   - [ ] Site loads correctly
   - [ ] Personalization works
   - [ ] All images load
   - [ ] Weather effects render
   - [ ] No console errors
```

---

## Quick Reference: File Dependencies

```
index.html
├── css/main.css (includes all theme imports)
└── js/main.js
    ├── js/geolocation.js
    ├── js/weather.js
    ├── js/festivals.js
    ├── js/personalization.js
    ├── js/welcome-animation.js
    ├── js/micro-interactions.js
    └── js/distance-viz.js

data/countries.json (loaded by personalization.js)
assets/profile-images/*.webp (loaded based on detected country)
```

---

## Implementation Order Summary

1. **Week 1**: Core infrastructure (Phase 1-2)
   - Set up file structure
   - Implement geolocation service
   - Implement weather service

2. **Week 2**: Profile & Animation (Phase 3-4)
   - Generate all profile images with Nano Banana
   - Implement welcome animation
   - Set up profile image loading

3. **Week 3**: Visual Polish (Phase 5-7)
   - Implement micro-interactions
   - Build distance visualization
   - Create all theme CSS

4. **Week 4**: Integration & Testing (Phase 8-10)
   - Wire everything together in main.js
   - Comprehensive testing
   - Performance optimization
   - Deploy

---

*This document should be treated as the single source of truth for implementation. Update it as you build.*
