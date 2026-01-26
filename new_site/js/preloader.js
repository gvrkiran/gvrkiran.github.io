/**
 * Preloader Service
 * Handles preloading of critical assets for smooth personalization
 */

const Preloader = {
  loadedImages: new Set(),
  loadingPromises: new Map(),

  /**
   * Preload an image and return a promise
   */
  loadImage(src) {
    // Return cached promise if already loading/loaded
    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src);
    }

    const promise = new Promise((resolve, reject) => {
      // Already loaded
      if (this.loadedImages.has(src)) {
        resolve(src);
        return;
      }

      const img = new Image();
      img.onload = () => {
        this.loadedImages.add(src);
        resolve(src);
      };
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${src}`));
      };
      img.src = src;
    });

    this.loadingPromises.set(src, promise);
    return promise;
  },

  /**
   * Preload multiple images
   */
  loadImages(sources) {
    return Promise.allSettled(sources.map(src => this.loadImage(src)));
  },

  /**
   * Preload the personalized profile image
   */
  async preloadProfileImage(countryCode) {
    const basePath = './profile-images/';

    // Try country-specific first
    const countryImage = `${basePath}${countryCode.toLowerCase()}.webp`;

    try {
      await this.loadImage(countryImage);
      return countryImage;
    } catch {
      // Fall back to base image
      const baseImage = `${basePath}base.webp`;
      try {
        await this.loadImage(baseImage);
        return baseImage;
      } catch {
        return null;
      }
    }
  },

  /**
   * Preload critical fonts
   */
  preloadFonts() {
    // Use Font Loading API if available
    if ('fonts' in document) {
      return document.fonts.ready;
    }
    return Promise.resolve();
  },

  /**
   * Add preload link to head for critical resources
   */
  addPreloadLink(href, as, type = null) {
    // Check if already exists
    const existing = document.querySelector(`link[rel="preload"][href="${href}"]`);
    if (existing) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  },

  /**
   * Preload critical CSS
   */
  preloadCSS(href) {
    this.addPreloadLink(href, 'style');
  },

  /**
   * Preload critical JS
   */
  preloadJS(href) {
    this.addPreloadLink(href, 'script');
  },

  /**
   * Initialize preloading for personalization
   */
  async initialize(countryCode) {
    const tasks = [];

    // Preload profile image
    if (countryCode) {
      tasks.push(this.preloadProfileImage(countryCode));
    }

    // Preload fonts
    tasks.push(this.preloadFonts());

    // Wait for all critical resources
    await Promise.allSettled(tasks);
  },

  /**
   * Check if an image is already loaded
   */
  isLoaded(src) {
    return this.loadedImages.has(src);
  },

  /**
   * Clear preload cache
   */
  clearCache() {
    this.loadedImages.clear();
    this.loadingPromises.clear();
  }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Preloader;
}
