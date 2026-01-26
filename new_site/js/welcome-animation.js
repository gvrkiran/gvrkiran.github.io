/**
 * Welcome Animation Controller
 * Manages the full-screen welcome → main site transition
 */

const WelcomeAnimation = {
  duration: 4000, // 4 seconds total
  hasPlayed: false,
  overlay: null,

  async initialize(context, visitorHistory = null) {
    // Check if we should skip (returning visitor within same session)
    if (this.shouldSkip()) {
      document.body.classList.add('welcome-complete');
      return;
    }

    this.createOverlay(context, visitorHistory);
    await this.play(context);
    this.markAsPlayed();
  },

  shouldSkip() {
    // Skip if already played this session
    try {
      const sessionPlayed = sessionStorage.getItem('welcome_played');
      if (sessionPlayed) return true;

      // Skip if user prefers reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return true;
      }
    } catch {
      // sessionStorage might be disabled
    }
    return false;
  },

  markAsPlayed() {
    try {
      sessionStorage.setItem('welcome_played', '1');
    } catch {}
  },

  createOverlay(context, visitorHistory = null) {
    const greeting = PersonalizationEngine.getGreeting();
    const profilePath = PersonalizationEngine.getProfileImagePath();
    const countryInfo = context.countryInfo;

    // Build festival badge HTML if applicable
    let festivalBadgeHtml = '';
    if (greeting.isFestival && greeting.festivalName) {
      festivalBadgeHtml = `
        <div class="welcome-festival-badge">
          ${greeting.festivalEmoji || ''} ${greeting.festivalName}
        </div>
      `;
    }

    // Build returning visitor badge if applicable
    let returningBadgeHtml = '';
    if (visitorHistory && visitorHistory.totalVisits > 1) {
      const streak = typeof ReturningVisitor !== 'undefined' ? ReturningVisitor.getStreak() : 0;
      const streakHtml = streak >= 2 ? `<span class="streak-indicator">${streak} day streak</span>` : '';
      returningBadgeHtml = `
        <div class="returning-visitor-badge">
          Visit <span class="visit-count">#${visitorHistory.totalVisits}</span>
          ${streakHtml}
        </div>
      `;
    }

    // Customize greeting for returning visitors
    let greetingText = greeting.primary;
    if (visitorHistory && visitorHistory.totalVisits > 3) {
      greetingText = 'Welcome back!';
    }

    const overlay = document.createElement('div');
    overlay.id = 'welcome-overlay';
    overlay.className = 'welcome-overlay';
    overlay.innerHTML = `
      <div class="welcome-container">
        ${festivalBadgeHtml}
        ${returningBadgeHtml}
        <div class="welcome-profile">
          <img src="${profilePath}" alt="Welcome" class="welcome-avatar" />
        </div>
        <div class="welcome-text">
          <h1 class="welcome-greeting-primary">${greetingText}</h1>
          ${greeting.native && visitorHistory?.totalVisits <= 3 ? `<p class="welcome-greeting-native">${greeting.native}</p>` : ''}
          <p class="welcome-greeting-secondary">${greeting.secondary}</p>
        </div>
        <div class="welcome-meta">
          <p class="welcome-name">${typeof PROFILE !== 'undefined' ? PROFILE.name : 'Welcome'}</p>
          <p class="welcome-location">
            <span class="welcome-from">Visiting from</span>
            <span class="welcome-visitor-location">${context.geo.city && context.geo.city !== 'Unknown' ? `${context.geo.city}, ${context.geo.country_name}` : context.geo.country_name}</span>
          </p>
        </div>
      </div>
      <div class="welcome-progress">
        <div class="welcome-progress-bar"></div>
      </div>
    `;

    document.body.prepend(overlay);
    this.overlay = overlay;

    // Prevent scrolling during animation
    document.body.style.overflow = 'hidden';
  },

  async play(context) {
    return new Promise((resolve) => {
      const overlay = this.overlay;
      if (!overlay) {
        resolve();
        return;
      }

      // Phase 1: Fade in (0-500ms)
      requestAnimationFrame(() => {
        overlay.classList.add('visible');
      });

      // Phase 2: Hold and show content (500ms - 3000ms)
      setTimeout(() => {
        overlay.classList.add('content-visible');
      }, 300);

      // Phase 3: Start fade out (3000ms - 4000ms)
      setTimeout(() => {
        overlay.classList.add('fading-out');
      }, this.duration - 800);

      // Phase 4: Complete and remove
      setTimeout(() => {
        overlay.classList.add('complete');
        document.body.style.overflow = '';
        document.body.classList.add('welcome-complete');

        // Remove overlay after transition
        setTimeout(() => {
          overlay.remove();
          this.overlay = null;
        }, 500);

        resolve();
      }, this.duration);
    });
  },

  // Allow skipping with click or keypress
  enableSkip() {
    const skipHandler = () => {
      if (this.overlay) {
        this.overlay.classList.add('fading-out', 'complete');
        document.body.style.overflow = '';
        document.body.classList.add('welcome-complete');
        setTimeout(() => {
          if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
          }
        }, 300);
      }
      document.removeEventListener('click', skipHandler);
      document.removeEventListener('keydown', skipHandler);
    };

    document.addEventListener('click', skipHandler);
    document.addEventListener('keydown', skipHandler);
  }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WelcomeAnimation;
}
