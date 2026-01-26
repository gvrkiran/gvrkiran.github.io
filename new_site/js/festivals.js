/**
 * Festival & Holiday Detection
 * Detects major cultural events based on date and region
 */

const FestivalService = {
  // Festival database with approximate dates
  festivals: {
    diwali: {
      name: 'Diwali',
      greeting: 'Happy Diwali',
      greeting_native: '\u0936\u0941\u092d \u0926\u0940\u092a\u093e\u0935\u0932\u0940',
      regions: ['IN', 'NP', 'LK', 'MY', 'SG', 'FJ', 'MU', 'TT', 'GY', 'SR'],
      dates: {
        2024: { start: '2024-11-01', end: '2024-11-05' },
        2025: { start: '2025-10-20', end: '2025-10-24' },
        2026: { start: '2026-11-08', end: '2026-11-12' }
      },
      emoji: '\u2728'
    },
    lunar_new_year: {
      name: 'Lunar New Year',
      greeting: 'Happy New Year',
      greeting_native: '\u65b0\u5e74\u5feb\u4e50',
      regions: ['CN', 'TW', 'HK', 'SG', 'MY', 'VN', 'KR', 'ID', 'TH', 'PH'],
      dates: {
        2024: { start: '2024-02-10', end: '2024-02-24' },
        2025: { start: '2025-01-29', end: '2025-02-12' },
        2026: { start: '2026-02-17', end: '2026-03-03' }
      },
      emoji: '\ud83c\udf8a'
    },
    eid_al_fitr: {
      name: 'Eid al-Fitr',
      greeting: 'Eid Mubarak',
      greeting_native: '\u0639\u064a\u062f \u0645\u0628\u0627\u0631\u0643',
      regions: ['SA', 'AE', 'EG', 'ID', 'MY', 'PK', 'BD', 'TR', 'IR', 'IQ', 'MA', 'DZ', 'TN', 'LY', 'JO', 'LB', 'SY', 'KW', 'QA', 'BH', 'OM', 'YE'],
      dates: {
        2024: { start: '2024-04-09', end: '2024-04-12' },
        2025: { start: '2025-03-30', end: '2025-04-02' },
        2026: { start: '2026-03-20', end: '2026-03-23' }
      },
      emoji: '\u2b50'
    },
    eid_al_adha: {
      name: 'Eid al-Adha',
      greeting: 'Eid Mubarak',
      greeting_native: '\u0639\u064a\u062f \u0645\u0628\u0627\u0631\u0643',
      regions: ['SA', 'AE', 'EG', 'ID', 'MY', 'PK', 'BD', 'TR', 'IR', 'IQ', 'MA', 'DZ', 'TN', 'LY', 'JO', 'LB', 'SY', 'KW', 'QA', 'BH', 'OM', 'YE'],
      dates: {
        2024: { start: '2024-06-16', end: '2024-06-19' },
        2025: { start: '2025-06-06', end: '2025-06-09' },
        2026: { start: '2026-05-27', end: '2026-05-30' }
      },
      emoji: '\u2b50'
    },
    holi: {
      name: 'Holi',
      greeting: 'Happy Holi',
      greeting_native: '\u0939\u094b\u0932\u0940 \u092e\u0941\u092c\u093e\u0930\u0915',
      regions: ['IN', 'NP', 'BD', 'PK'],
      dates: {
        2024: { start: '2024-03-24', end: '2024-03-25' },
        2025: { start: '2025-03-13', end: '2025-03-14' },
        2026: { start: '2026-03-03', end: '2026-03-04' }
      },
      emoji: '\ud83c\udf08'
    },
    christmas: {
      name: 'Christmas',
      greeting: 'Merry Christmas',
      greeting_native: null,
      regions: ['US', 'CA', 'GB', 'AU', 'NZ', 'DE', 'FR', 'IT', 'ES', 'PT', 'NL', 'BE', 'AT', 'CH', 'IE', 'PL', 'CZ', 'HU', 'RO', 'GR', 'SE', 'NO', 'DK', 'FI', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'PH'],
      dates: {
        2024: { start: '2024-12-24', end: '2024-12-26' },
        2025: { start: '2025-12-24', end: '2025-12-26' },
        2026: { start: '2026-12-24', end: '2026-12-26' }
      },
      emoji: '\ud83c\udf84'
    },
    thanksgiving_us: {
      name: 'Thanksgiving',
      greeting: 'Happy Thanksgiving',
      greeting_native: null,
      regions: ['US'],
      dates: {
        2024: { start: '2024-11-28', end: '2024-11-28' },
        2025: { start: '2025-11-27', end: '2025-11-27' },
        2026: { start: '2026-11-26', end: '2026-11-26' }
      },
      emoji: '\ud83e\udd83'
    },
    carnival: {
      name: 'Carnival',
      greeting: 'Happy Carnival',
      greeting_native: 'Feliz Carnaval',
      regions: ['BR', 'CO', 'VE', 'BO', 'EC', 'PE'],
      dates: {
        2024: { start: '2024-02-09', end: '2024-02-14' },
        2025: { start: '2025-02-28', end: '2025-03-05' },
        2026: { start: '2026-02-13', end: '2026-02-18' }
      },
      emoji: '\ud83c\udf89'
    },
    new_year: {
      name: 'New Year',
      greeting: 'Happy New Year',
      greeting_native: null,
      regions: ['US', 'CA', 'GB', 'AU', 'NZ', 'DE', 'FR', 'IT', 'ES', 'PT', 'NL', 'BE', 'AT', 'CH', 'IE', 'SE', 'NO', 'DK', 'FI', 'MX', 'BR', 'AR', 'IN', 'JP', 'KR'],
      dates: {
        2024: { start: '2024-01-01', end: '2024-01-01' },
        2025: { start: '2025-01-01', end: '2025-01-01' },
        2026: { start: '2026-01-01', end: '2026-01-01' }
      },
      emoji: '\ud83c\udf89'
    },
    mid_autumn: {
      name: 'Mid-Autumn Festival',
      greeting: 'Happy Mid-Autumn',
      greeting_native: '\u4e2d\u79cb\u5feb\u4e50',
      regions: ['CN', 'TW', 'HK', 'VN', 'SG', 'MY'],
      dates: {
        2024: { start: '2024-09-17', end: '2024-09-17' },
        2025: { start: '2025-10-06', end: '2025-10-06' },
        2026: { start: '2026-09-25', end: '2026-09-25' }
      },
      emoji: '\ud83c\udf19'
    }
  },

  /**
   * Detect if there's an active festival for the given country
   * @param {string} countryCode - ISO country code
   * @param {Date} date - Date to check (defaults to today)
   * @returns {Object|null} Festival info or null
   */
  detect(countryCode, date = new Date()) {
    const year = date.getFullYear();
    const dateStr = date.toISOString().split('T')[0];

    for (const [key, festival] of Object.entries(this.festivals)) {
      // Check if country celebrates this festival
      if (!festival.regions.includes(countryCode)) continue;

      // Check if date falls within festival period
      const yearDates = festival.dates[year];
      if (!yearDates) continue;

      const { start, end } = yearDates;
      if (dateStr >= start && dateStr <= end) {
        return {
          key,
          name: festival.name,
          greeting: festival.greeting,
          greeting_native: festival.greeting_native,
          emoji: festival.emoji,
          is_active: true
        };
      }
    }

    return null;
  },

  /**
   * Get upcoming festivals for a country
   * @param {string} countryCode - ISO country code
   * @param {number} daysAhead - How many days to look ahead
   * @returns {Array} List of upcoming festivals
   */
  getUpcoming(countryCode, daysAhead = 30) {
    const today = new Date();
    const upcoming = [];

    for (const [key, festival] of Object.entries(this.festivals)) {
      if (!festival.regions.includes(countryCode)) continue;

      const year = today.getFullYear();
      const yearDates = festival.dates[year];
      if (!yearDates) continue;

      const startDate = new Date(yearDates.start);
      const daysUntil = Math.floor((startDate - today) / (1000 * 60 * 60 * 24));

      if (daysUntil > 0 && daysUntil <= daysAhead) {
        upcoming.push({
          key,
          name: festival.name,
          date: yearDates.start,
          daysUntil,
          emoji: festival.emoji
        });
      }
    }

    return upcoming.sort((a, b) => a.daysUntil - b.daysUntil);
  }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FestivalService;
}
