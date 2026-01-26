/**
 * Ambient Background Generator
 * Creates subtle regional aesthetic backgrounds using CSS patterns
 */

const AmbientBackground = {
  container: null,

  // Regional aesthetic patterns - subtle, non-distracting
  aesthetics: {
    // East Asian - clean lines, zen patterns
    zen: {
      regions: ['JP', 'KR', 'CN', 'TW', 'HK'],
      pattern: 'zen',
      colors: ['rgba(0,0,0,0.02)', 'rgba(0,0,0,0.01)']
    },
    // South Asian - intricate geometric
    mandala: {
      regions: ['IN', 'PK', 'BD', 'NP', 'LK'],
      pattern: 'mandala',
      colors: ['rgba(255,153,51,0.03)', 'rgba(19,136,8,0.02)']
    },
    // Middle Eastern - Islamic geometry
    geometric: {
      regions: ['SA', 'AE', 'EG', 'MA', 'TR', 'IR', 'IQ', 'JO', 'LB', 'SY', 'KW', 'QA', 'BH', 'OM'],
      pattern: 'islamic',
      colors: ['rgba(0,108,53,0.03)', 'rgba(206,17,38,0.02)']
    },
    // European - subtle classic patterns
    classic: {
      regions: ['GB', 'FR', 'DE', 'IT', 'ES', 'PT', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'IE', 'PL'],
      pattern: 'classic',
      colors: ['rgba(0,0,0,0.015)', 'rgba(0,0,0,0.01)']
    },
    // Americas - organic, natural
    organic: {
      regions: ['US', 'CA', 'MX', 'BR', 'AR', 'CO', 'PE', 'CL'],
      pattern: 'organic',
      colors: ['rgba(0,0,0,0.02)', 'rgba(0,100,0,0.01)']
    },
    // African - bold geometric, earth tones
    african: {
      regions: ['NG', 'GH', 'KE', 'ZA', 'EG', 'MA', 'ET', 'TZ'],
      pattern: 'tribal',
      colors: ['rgba(139,69,19,0.03)', 'rgba(0,0,0,0.02)']
    },
    // Southeast Asian - tropical, batik-inspired
    tropical: {
      regions: ['TH', 'VN', 'PH', 'MY', 'SG', 'ID'],
      pattern: 'batik',
      colors: ['rgba(255,215,0,0.02)', 'rgba(0,128,0,0.02)']
    },
    // Oceania - wave patterns
    oceanic: {
      regions: ['AU', 'NZ', 'FJ', 'PG'],
      pattern: 'wave',
      colors: ['rgba(0,0,139,0.02)', 'rgba(0,128,128,0.02)']
    }
  },

  initialize(countryCode) {
    // Skip if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const aesthetic = this.getAesthetic(countryCode);
    if (!aesthetic) return;

    this.createBackground(aesthetic);
  },

  getAesthetic(countryCode) {
    for (const [key, aesthetic] of Object.entries(this.aesthetics)) {
      if (aesthetic.regions.includes(countryCode)) {
        return { key, ...aesthetic };
      }
    }
    // Default to classic
    return { key: 'classic', ...this.aesthetics.classic };
  },

  createBackground(aesthetic) {
    this.container = document.createElement('div');
    this.container.className = 'ambient-background';
    this.container.dataset.pattern = aesthetic.pattern;

    // Generate SVG pattern based on type
    const patternSvg = this.generatePattern(aesthetic);
    this.container.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(patternSvg)}")`;

    document.body.prepend(this.container);

    // Fade in
    requestAnimationFrame(() => {
      this.container.classList.add('visible');
    });
  },

  generatePattern(aesthetic) {
    const patterns = {
      zen: this.zenPattern(aesthetic.colors),
      mandala: this.mandalaPattern(aesthetic.colors),
      islamic: this.islamicPattern(aesthetic.colors),
      classic: this.classicPattern(aesthetic.colors),
      organic: this.organicPattern(aesthetic.colors),
      tribal: this.tribalPattern(aesthetic.colors),
      batik: this.batikPattern(aesthetic.colors),
      wave: this.wavePattern(aesthetic.colors)
    };

    return patterns[aesthetic.pattern] || patterns.classic;
  },

  // Zen pattern - horizontal lines
  zenPattern(colors) {
    return `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="25" x2="100" y2="25" stroke="${colors[0]}" stroke-width="1"/>
      <line x1="0" y1="50" x2="100" y2="50" stroke="${colors[1]}" stroke-width="0.5"/>
      <line x1="0" y1="75" x2="100" y2="75" stroke="${colors[0]}" stroke-width="1"/>
    </svg>`;
  },

  // Mandala-inspired - concentric circles
  mandalaPattern(colors) {
    return `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="none" stroke="${colors[0]}" stroke-width="0.5"/>
      <circle cx="50" cy="50" r="30" fill="none" stroke="${colors[1]}" stroke-width="0.5"/>
      <circle cx="50" cy="50" r="20" fill="none" stroke="${colors[0]}" stroke-width="0.5"/>
      <circle cx="50" cy="50" r="10" fill="none" stroke="${colors[1]}" stroke-width="0.5"/>
    </svg>`;
  },

  // Islamic geometric - octagonal pattern
  islamicPattern(colors) {
    return `<svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
      <polygon points="40,5 55,20 75,20 60,35 65,55 40,45 15,55 20,35 5,20 25,20"
               fill="none" stroke="${colors[0]}" stroke-width="0.5"/>
      <rect x="25" y="25" width="30" height="30" fill="none" stroke="${colors[1]}" stroke-width="0.5"
            transform="rotate(45 40 40)"/>
    </svg>`;
  },

  // Classic European - subtle diamond grid
  classicPattern(colors) {
    return `<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="0" x2="60" y2="60" stroke="${colors[0]}" stroke-width="0.5"/>
      <line x1="60" y1="0" x2="0" y2="60" stroke="${colors[0]}" stroke-width="0.5"/>
      <line x1="30" y1="0" x2="30" y2="60" stroke="${colors[1]}" stroke-width="0.3"/>
      <line x1="0" y1="30" x2="60" y2="30" stroke="${colors[1]}" stroke-width="0.3"/>
    </svg>`;
  },

  // Organic - curved flowing lines
  organicPattern(colors) {
    return `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,50 Q25,30 50,50 T100,50" fill="none" stroke="${colors[0]}" stroke-width="0.5"/>
      <path d="M0,70 Q25,50 50,70 T100,70" fill="none" stroke="${colors[1]}" stroke-width="0.5"/>
      <path d="M0,30 Q25,10 50,30 T100,30" fill="none" stroke="${colors[1]}" stroke-width="0.5"/>
    </svg>`;
  },

  // Tribal African - zigzag pattern
  tribalPattern(colors) {
    return `<svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
      <polyline points="0,20 20,40 40,20 60,40 80,20" fill="none" stroke="${colors[0]}" stroke-width="1"/>
      <polyline points="0,60 20,40 40,60 60,40 80,60" fill="none" stroke="${colors[1]}" stroke-width="1"/>
    </svg>`;
  },

  // Batik-inspired - dots and curves
  batikPattern(colors) {
    return `<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="2" fill="${colors[0]}"/>
      <circle cx="10" cy="10" r="1.5" fill="${colors[1]}"/>
      <circle cx="50" cy="10" r="1.5" fill="${colors[1]}"/>
      <circle cx="10" cy="50" r="1.5" fill="${colors[1]}"/>
      <circle cx="50" cy="50" r="1.5" fill="${colors[1]}"/>
      <path d="M15,30 Q30,15 45,30" fill="none" stroke="${colors[0]}" stroke-width="0.5"/>
      <path d="M15,30 Q30,45 45,30" fill="none" stroke="${colors[0]}" stroke-width="0.5"/>
    </svg>`;
  },

  // Wave pattern - ocean inspired
  wavePattern(colors) {
    return `<svg width="100" height="50" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,25 Q12.5,10 25,25 T50,25 T75,25 T100,25" fill="none" stroke="${colors[0]}" stroke-width="0.5"/>
      <path d="M0,35 Q12.5,20 25,35 T50,35 T75,35 T100,35" fill="none" stroke="${colors[1]}" stroke-width="0.5"/>
    </svg>`;
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
  module.exports = AmbientBackground;
}
