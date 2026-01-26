/**
 * Weather Effects Controller
 * Renders subtle weather-based visual effects on canvas
 */

const WeatherEffects = {
  canvas: null,
  ctx: null,
  animationId: null,
  particles: [],
  isRunning: false,

  initialize(weather) {
    // Skip if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.createCanvas();
    this.startEffect(weather);

    // Handle window resize
    window.addEventListener('resize', () => this.resize());

    // Pause when tab is hidden to save resources
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });
  },

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'weather-effects';
    this.canvas.className = 'weather-effects-canvas';
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
    this.resize();
  },

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  startEffect(weather) {
    const condition = weather.condition;
    const isDay = weather.is_day;

    this.particles = [];

    switch (condition) {
      case 'rain':
        this.initRain();
        break;
      case 'snow':
        this.initSnow();
        break;
      case 'clear':
        if (!isDay) {
          this.initStars();
        } else {
          this.initSunshine();
        }
        break;
      case 'cloudy':
        if (!isDay) {
          this.initStars(30); // Fewer stars when cloudy
        }
        break;
      default:
        // No effect for unknown conditions
        return;
    }

    this.isRunning = true;
    this.animate();
  },

  // Rain effect
  initRain() {
    const count = Math.floor(window.innerWidth / 12);
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'rain',
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 4 + 6,
        opacity: Math.random() * 0.3 + 0.1
      });
    }
  },

  drawRain() {
    this.particles.forEach(drop => {
      this.ctx.beginPath();
      this.ctx.moveTo(drop.x, drop.y);
      this.ctx.lineTo(drop.x + 0.5, drop.y + drop.length);
      this.ctx.strokeStyle = `rgba(174, 194, 224, ${drop.opacity})`;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();

      // Update position
      drop.y += drop.speed;
      drop.x += 0.5; // Slight wind effect

      // Reset when off screen
      if (drop.y > this.canvas.height) {
        drop.y = -drop.length;
        drop.x = Math.random() * this.canvas.width;
      }
    });
  },

  // Snow effect
  initSnow() {
    const count = Math.floor(window.innerWidth / 15);
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'snow',
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 1.5 + 0.5,
        drift: Math.random() * 1 - 0.5,
        opacity: Math.random() * 0.6 + 0.3,
        wobble: Math.random() * Math.PI * 2
      });
    }
  },

  drawSnow() {
    this.particles.forEach(flake => {
      this.ctx.beginPath();
      this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
      this.ctx.fill();

      // Update position with wobble
      flake.wobble += 0.02;
      flake.y += flake.speed;
      flake.x += flake.drift + Math.sin(flake.wobble) * 0.5;

      // Reset when off screen
      if (flake.y > this.canvas.height + flake.radius) {
        flake.y = -flake.radius;
        flake.x = Math.random() * this.canvas.width;
      }
      if (flake.x > this.canvas.width + flake.radius) {
        flake.x = -flake.radius;
      }
      if (flake.x < -flake.radius) {
        flake.x = this.canvas.width + flake.radius;
      }
    });
  },

  // Stars effect (night)
  initStars(count = 80) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'star',
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height * 0.7, // Keep in upper portion
        radius: Math.random() * 1.5 + 0.5,
        baseOpacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }
  },

  drawStars(time) {
    this.particles.forEach(star => {
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
      const opacity = star.baseOpacity + twinkle * 0.2;

      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, opacity)})`;
      this.ctx.fill();

      // Very slow drift
      star.x += 0.005;
      if (star.x > this.canvas.width) {
        star.x = 0;
      }
    });
  },

  // Sunshine effect (subtle lens flare following mouse)
  initSunshine() {
    this.mouseX = this.canvas.width * 0.8;
    this.mouseY = this.canvas.height * 0.2;

    // Track mouse for subtle interaction
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    this.particles.push({ type: 'sunshine' });
  },

  drawSunshine() {
    // Create subtle warm gradient that follows mouse slightly
    const targetX = this.mouseX * 0.3 + this.canvas.width * 0.5;
    const targetY = this.mouseY * 0.2 + this.canvas.height * 0.1;

    const gradient = this.ctx.createRadialGradient(
      targetX, targetY, 0,
      targetX, targetY, 400
    );
    gradient.addColorStop(0, 'rgba(255, 250, 220, 0.08)');
    gradient.addColorStop(0.5, 'rgba(255, 245, 200, 0.03)');
    gradient.addColorStop(1, 'rgba(255, 240, 180, 0)');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  },

  // Animation loop
  animate(time = 0) {
    if (!this.isRunning || !this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw based on particle types
    const hasRain = this.particles.some(p => p.type === 'rain');
    const hasSnow = this.particles.some(p => p.type === 'snow');
    const hasStars = this.particles.some(p => p.type === 'star');
    const hasSunshine = this.particles.some(p => p.type === 'sunshine');

    if (hasRain) this.drawRain();
    if (hasSnow) this.drawSnow();
    if (hasStars) this.drawStars(time);
    if (hasSunshine) this.drawSunshine();

    this.animationId = requestAnimationFrame((t) => this.animate(t));
  },

  pause() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  },

  resume() {
    if (!this.isRunning && this.particles.length > 0) {
      this.isRunning = true;
      this.animate();
    }
  },

  destroy() {
    this.pause();
    if (this.canvas) {
      this.canvas.remove();
      this.canvas = null;
      this.ctx = null;
    }
    this.particles = [];
  }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WeatherEffects;
}
