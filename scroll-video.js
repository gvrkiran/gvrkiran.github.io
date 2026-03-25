// Scroll-driven video widget — fixed in top-right corner, no border/box.
// Advances frames as user scrolls the page.
//
// Usage: <script src="scroll-video.js" data-frames="frames/publications" data-count="96"></script>

(function(){
  var script = document.currentScript;
  var frameDir = script.getAttribute('data-frames');
  var frameCount = parseInt(script.getAttribute('data-count'), 10) || 96;
  if (!frameDir) return;

  var wrap = document.createElement('div');
  wrap.className = 'video-widget';
  var canvas = document.createElement('canvas');
  canvas.className = 'video-widget-canvas';
  wrap.appendChild(canvas);
  document.body.appendChild(wrap);

  var ctx = canvas.getContext('2d');
  var frames = [];
  var loaded = 0;
  var ready = false;
  var curFrame = -1;

  function framePath(i) {
    return frameDir + '/frame_' + String(i + 1).padStart(4, '0') + '.jpg';
  }

  function sizeCanvas() {
    var rect = wrap.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    curFrame = -1;
  }

  function draw(idx) {
    if (idx === curFrame || !frames[idx]) return;
    curFrame = idx;
    var img = frames[idx];
    if (!img.complete || img.naturalWidth === 0) return;

    var rect = wrap.getBoundingClientRect();
    var cw = rect.width;
    var ch = rect.height;
    var iw = img.naturalWidth, ih = img.naturalHeight;

    // Clear with transparent
    ctx.clearRect(0, 0, cw, ch);

    // Contain-fit
    var scale = Math.min(cw / iw, ch / ih);
    var dw = iw * scale, dh = ih * scale;
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }

  function getProgress() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return 0;
    return Math.max(0, Math.min(1, scrollTop / docHeight));
  }

  function update() {
    if (!ready) return;
    var p = getProgress();
    var fi = Math.min(frameCount - 1, Math.floor(p * frameCount));
    draw(fi);
  }

  for (var i = 0; i < frameCount; i++) {
    (function(idx) {
      var img = new Image();
      img.onload = img.onerror = function() {
        loaded++;
        if (loaded === frameCount) {
          ready = true;
          sizeCanvas();
          draw(0);
        }
      };
      img.src = framePath(idx);
      frames[idx] = img;
    })(i);
  }

  window.addEventListener('scroll', function() {
    requestAnimationFrame(update);
  }, { passive: true });

  window.addEventListener('resize', function() {
    sizeCanvas();
    update();
  });

  document.addEventListener('themeChanged', function() {
    curFrame = -1;
    update();
  });
})();
