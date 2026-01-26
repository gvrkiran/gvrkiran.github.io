/**
 * Distance Visualization
 * Shows connection from site owner's location to visitor
 */

const DistanceVisualization = {
  // Site owner's location (New Jersey / Rutgers area)
  origin: {
    lat: 40.4862,
    lon: -74.4518,
    name: 'New Jersey',
    short: 'NJ'
  },

  container: null,

  initialize(visitorGeo) {
    // Don't show if visitor is very close or location is fallback
    if (visitorGeo.is_fallback) return;

    const distance = this.calculateDistance(
      this.origin.lat, this.origin.lon,
      visitorGeo.latitude, visitorGeo.longitude
    );

    // Skip if distance is very small (same area)
    if (distance < 50) return;

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

  formatDistance(km) {
    if (km >= 1000) {
      return `${(km / 1000).toFixed(1)}k`;
    }
    return km.toLocaleString();
  },

  getDistanceInsight(km) {
    if (km > 15000) {
      return "Nearly opposite sides of the Earth";
    } else if (km > 10000) {
      return "Across oceans and continents";
    } else if (km > 5000) {
      return "A long journey apart";
    } else if (km > 2000) {
      return "Different corners of the world";
    } else if (km > 500) {
      return "A few time zones away";
    } else {
      return "Relatively close neighbors";
    }
  },

  createVisualization(visitorGeo, distance) {
    const visitorShort = visitorGeo.country_code || '??';
    const insight = this.getDistanceInsight(distance);

    const container = document.createElement('div');
    container.className = 'distance-viz';
    container.innerHTML = `
      <div class="distance-content">
        <div class="distance-visual">
          <div class="distance-point origin">
            <span class="point-dot"></span>
            <span class="point-label">${this.origin.short}</span>
          </div>
          <div class="distance-line">
            <svg class="distance-arc" viewBox="0 0 200 60" preserveAspectRatio="none">
              <defs>
                <linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color: var(--accent-primary, #6366f1); stop-opacity: 1" />
                  <stop offset="100%" style="stop-color: var(--accent-secondary, #a78bfa); stop-opacity: 0.5" />
                </linearGradient>
              </defs>
              <path class="arc-path" d="M 10 50 Q 100 0 190 50" fill="none" stroke="url(#arc-gradient)" stroke-width="2" stroke-linecap="round" />
              <circle class="arc-dot" cx="10" cy="50" r="3" fill="var(--accent-primary, #6366f1)" />
              <circle class="arc-dot end" cx="190" cy="50" r="3" fill="var(--accent-secondary, #a78bfa)" />
            </svg>
          </div>
          <div class="distance-point destination">
            <span class="point-dot"></span>
            <span class="point-label">${visitorShort}</span>
          </div>
        </div>
        <div class="distance-info">
          <div class="distance-number">
            <span class="distance-value">${this.formatDistance(distance)}</span>
            <span class="distance-unit">km</span>
          </div>
          <p class="distance-insight">${insight}</p>
        </div>
      </div>
    `;

    // Insert before footer or at end of main
    const footer = document.querySelector('footer');
    const main = document.querySelector('main');

    if (footer) {
      footer.parentNode.insertBefore(container, footer);
    } else if (main) {
      main.appendChild(container);
    } else {
      document.body.appendChild(container);
    }

    this.container = container;

    // Trigger animation after a short delay
    setTimeout(() => {
      container.classList.add('visible');
    }, 100);

    // Animate the arc drawing
    this.animateArc();
  },

  animateArc() {
    const path = this.container?.querySelector('.arc-path');
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    // Trigger animation
    setTimeout(() => {
      path.style.transition = 'stroke-dashoffset 1.5s ease-out';
      path.style.strokeDashoffset = '0';
    }, 500);
  },

  destroy() {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DistanceVisualization;
}
