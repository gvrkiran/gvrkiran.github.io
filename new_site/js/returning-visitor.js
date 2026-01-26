/**
 * Returning Visitor Service
 * Provides personalized experience for returning visitors
 */

const ReturningVisitor = {
  storageKey: 'visitor_history',

  /**
   * Get visitor history
   */
  getHistory() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  /**
   * Save visitor history
   */
  saveHistory(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch {}
  },

  /**
   * Record a visit
   */
  recordVisit(context) {
    const now = new Date();
    const history = this.getHistory() || {
      firstVisit: now.toISOString(),
      visits: [],
      totalVisits: 0,
      lastCountry: null,
      countries: []
    };

    // Update visit data
    history.totalVisits++;
    history.lastVisit = now.toISOString();

    // Record this visit
    const visit = {
      date: now.toISOString(),
      country: context.geo?.country_code,
      city: context.geo?.city,
      weather: context.weather?.condition,
      theme: context.theme
    };

    // Keep last 10 visits
    history.visits.unshift(visit);
    if (history.visits.length > 10) {
      history.visits = history.visits.slice(0, 10);
    }

    // Track countries visited from
    if (context.geo?.country_code && !history.countries.includes(context.geo.country_code)) {
      history.countries.push(context.geo.country_code);
    }
    history.lastCountry = context.geo?.country_code;

    this.saveHistory(history);
    return history;
  },

  /**
   * Check if this is a returning visitor
   */
  isReturning() {
    const history = this.getHistory();
    return history && history.totalVisits > 1;
  },

  /**
   * Get personalized welcome message for returning visitors
   */
  getWelcomeMessage(context) {
    const history = this.getHistory();

    if (!history || history.totalVisits <= 1) {
      return null; // First visit, no special message
    }

    const visitCount = history.totalVisits;
    const daysSinceFirst = this.daysBetween(new Date(history.firstVisit), new Date());
    const daysSinceLast = history.lastVisit
      ? this.daysBetween(new Date(history.lastVisit), new Date())
      : 0;

    // Different messages based on visit patterns
    if (visitCount >= 10) {
      return {
        type: 'frequent',
        message: 'Welcome back, frequent visitor!',
        detail: `Visit #${visitCount}`
      };
    } else if (daysSinceLast > 30) {
      return {
        type: 'returning_long',
        message: 'Welcome back!',
        detail: "It's been a while"
      };
    } else if (daysSinceLast > 7) {
      return {
        type: 'returning_week',
        message: 'Welcome back!',
        detail: null
      };
    } else if (visitCount > 1) {
      return {
        type: 'returning',
        message: 'Welcome back!',
        detail: null
      };
    }

    return null;
  },

  /**
   * Calculate days between two dates
   */
  daysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.floor(Math.abs((date2 - date1) / oneDay));
  },

  /**
   * Get visit streak (consecutive days)
   */
  getStreak() {
    const history = this.getHistory();
    if (!history || history.visits.length < 2) return 0;

    let streak = 1;
    const today = new Date().toDateString();
    let lastDate = new Date(history.visits[0].date).toDateString();

    // Check if visited today
    if (lastDate !== today) return 0;

    for (let i = 1; i < history.visits.length; i++) {
      const visitDate = new Date(history.visits[i].date);
      const expectedDate = new Date(history.visits[i - 1].date);
      expectedDate.setDate(expectedDate.getDate() - 1);

      if (visitDate.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  },

  /**
   * Check if visitor has been here from different locations
   */
  isTraveler() {
    const history = this.getHistory();
    return history && history.countries && history.countries.length > 1;
  },

  /**
   * Get statistics about visitor
   */
  getStats() {
    const history = this.getHistory();
    if (!history) {
      return {
        isNew: true,
        totalVisits: 0,
        streak: 0,
        isTraveler: false,
        countriesVisitedFrom: []
      };
    }

    return {
      isNew: false,
      totalVisits: history.totalVisits,
      firstVisit: history.firstVisit,
      lastVisit: history.lastVisit,
      streak: this.getStreak(),
      isTraveler: this.isTraveler(),
      countriesVisitedFrom: history.countries || []
    };
  },

  /**
   * Clear visitor history
   */
  clearHistory() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch {}
  }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ReturningVisitor;
}
