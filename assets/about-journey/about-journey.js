(function () {
  "use strict";

  const SCENES = [
    { id: "origin", place: "Hyderabad, India", short: "Origin", years: "2006", coordinates: "17.3850° N · 78.4867° E", map: { x: 1360, y: 500 } },
    { id: "hyderabad", place: "Hyderabad, India", short: "Hyderabad", years: "2006—2011", coordinates: "17.3850° N · 78.4867° E", map: { x: 1360, y: 500 } },
    { id: "barcelona", place: "Barcelona, Spain", short: "Barcelona", years: "2011—2012", coordinates: "41.3874° N · 2.1686° E", map: { x: 697, y: 307 } },
    { id: "doha", place: "Doha, Qatar", short: "Doha", years: "2012—2013", coordinates: "25.2854° N · 51.5310° E", map: { x: 1082, y: 430 } },
    { id: "helsinki", place: "Helsinki, Finland", short: "Helsinki", years: "2014—2018", coordinates: "60.1699° N · 24.9384° E", map: { x: 840, y: 154 } },
    { id: "lausanne", place: "Lausanne, Switzerland", short: "Lausanne", years: "2018—2019", coordinates: "46.5197° N · 6.6323° E", map: { x: 780, y: 283 } },
    { id: "cambridge", place: "Cambridge, United States", short: "Cambridge", years: "2019—2021", coordinates: "42.3736° N · 71.1097° W", map: { x: 167, y: 257 } },
    { id: "rutgers", place: "New Brunswick, United States", short: "New Brunswick", years: "2021—present", coordinates: "40.4862° N · 74.4518° W", map: { x: 147, y: 292 } }
  ];

  const transitions = SCENES.length - 1;
  const track = document.getElementById("journeyTrack");
  const sceneEls = [...document.querySelectorAll(".scene")];
  const copyEls = [...document.querySelectorAll(".chapter-copy")];
  const navButtons = [...document.querySelectorAll(".timeline button")];
  const routeMap = document.getElementById("routeMap");
  const routeDrawing = document.getElementById("routeDrawing");
  const routeHistory = document.getElementById("routeHistory");
  const routeNodes = document.getElementById("routeNodes");
  const flightUnderlay = document.getElementById("flightUnderlay");
  const flightTrail = document.getElementById("flightTrail");
  const flightPlane = document.getElementById("flightPlane");
  const flightReadout = document.getElementById("flightReadout");
  const flightFrom = document.getElementById("flightFrom");
  const flightTo = document.getElementById("flightTo");
  const flightYear = document.getElementById("flightYear");
  const progressBar = document.getElementById("progressBar");
  const timelineProgress = document.getElementById("timelineProgress");
  const chapterNumber = document.getElementById("chapterNumber");
  const chapterPlace = document.getElementById("chapterPlace");
  const coordinates = document.getElementById("coordinates");
  const scrollCue = document.getElementById("scrollCue");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const journey = document.getElementById("journey");

  let ticking = false;
  let activeIndex = -1;
  let maxScroll = 1;

  const clamp = value => Math.max(0, Math.min(1, value));
  const smoothstep = (start, end, value) => {
    const x = clamp((value - start) / (end - start));
    return x * x * (3 - 2 * x);
  };

  function routeD(a, b) {
    const distance = Math.hypot(b.x - a.x, b.y - a.y);
    const controlX = (a.x + b.x) / 2;
    const arcHeight = Math.min(150, Math.max(12, distance * .16));
    const controlY = (a.y + b.y) / 2 - arcHeight;
    return `M ${a.x} ${a.y} Q ${controlX} ${controlY} ${b.x} ${b.y}`;
  }

  function mapOrigin(scene) {
    const matrix = routeDrawing.getScreenCTM();
    if (!matrix) return "50% 50%";
    const point = routeDrawing.createSVGPoint();
    point.x = scene.map.x;
    point.y = scene.map.y;
    const screenPoint = point.matrixTransform(matrix);
    return `${(screenPoint.x / innerWidth * 100).toFixed(2)}% ${(screenPoint.y / innerHeight * 100).toFixed(2)}%`;
  }

  function buildRoute() {
    routeHistory.innerHTML = SCENES.slice(1, -1).map((scene, index) => {
      const next = SCENES[index + 2];
      return `<path data-leg="${index + 1}" d="${routeD(scene.map, next.map)}"></path>`;
    }).join("");

    routeNodes.innerHTML = SCENES.slice(1).map((scene, index) => {
      const anchor = scene.map.x > 1260 ? "end" : "start";
      const labelX = scene.map.x + (anchor === "end" ? -14 : 14);
      const labelY = scene.map.y - 15;
      return `<g class="route-map__node" data-node="${index + 1}" transform="translate(${scene.map.x} ${scene.map.y})">
        <circle r="8"></circle><circle r="3"></circle>
        <text x="${labelX - scene.map.x}" y="${labelY - scene.map.y}" text-anchor="${anchor}">${scene.short}</text>
      </g>`;
    }).join("");
  }

  function layout() {
    track.style.height = `${100 + transitions * (reducedMotion ? 105 : 280)}vh`;
    maxScroll = Math.max(1, track.offsetHeight - innerHeight);
    primeVideos(activeIndex < 0 ? 0 : activeIndex);
    update();
  }

  function setCopy(index, opacity) {
    const el = copyEls[index];
    if (!el) return;
    const visible = opacity > .02;
    el.style.opacity = opacity.toFixed(3);
    el.style.transform = el.classList.contains("chapter-copy--right")
      ? `translate3d(0, calc(-50% + ${(1 - opacity) * 24}px), 0)`
      : `translate3d(0, calc(-50% + ${(1 - opacity) * 24}px), 0)`;
    if (innerWidth <= 820) el.style.transform = `translate3d(0, ${(1 - opacity) * 20}px, 0)`;
    el.setAttribute("aria-hidden", visible ? "false" : "true");
    el.style.pointerEvents = visible && index === SCENES.length - 1 ? "auto" : "none";
  }

  function setActive(index) {
    if (activeIndex === index) return;
    activeIndex = index;
    const scene = SCENES[index];
    navButtons.forEach((button, buttonIndex) => {
      const selected = buttonIndex === index;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-current", selected ? "step" : "false");
    });
    chapterNumber.textContent = `${String(index).padStart(2, "0")} / 07`;
    chapterPlace.textContent = scene.place;
    coordinates.textContent = scene.coordinates;
    primeVideos(index);
  }

  function setFlight(leg, progress) {
    const from = SCENES[leg];
    const to = SCENES[leg + 1];
    const d = routeD(from.map, to.map);
    flightUnderlay.setAttribute("d", d);
    flightTrail.setAttribute("d", d);
    flightTrail.style.strokeDashoffset = String(1 - progress);
    flightFrom.textContent = from.short;
    flightTo.textContent = to.short;
    flightYear.textContent = to.years.split("—")[0];

    const length = flightTrail.getTotalLength();
    const point = flightTrail.getPointAtLength(length * progress);
    const tangentStart = flightTrail.getPointAtLength(length * Math.max(0, progress - .012));
    const tangentEnd = flightTrail.getPointAtLength(length * Math.min(1, progress + .012));
    const angle = Math.atan2(tangentEnd.y - tangentStart.y, tangentEnd.x - tangentStart.x) * 180 / Math.PI;
    flightPlane.setAttribute("transform", `translate(${point.x} ${point.y}) rotate(${angle})`);

    routeHistory.querySelectorAll("path").forEach(path => {
      path.style.opacity = Number(path.dataset.leg) < leg ? "1" : "0";
    });
    routeNodes.querySelectorAll("g").forEach(node => {
      const nodeIndex = Number(node.dataset.node);
      node.classList.toggle("is-passed", nodeIndex <= leg);
      node.classList.toggle("is-active", nodeIndex === leg || nodeIndex === leg + 1);
    });
  }

  function seekVideos(floatPosition) {
    sceneEls.forEach((scene, index) => {
      const video = scene.querySelector("video");
      if (!video || !scene.classList.contains("has-video") || !Number.isFinite(video.duration)) return;
      const fullySeekable = video.seekable.length > 0
        && video.seekable.end(video.seekable.length - 1) >= video.duration - .1;
      if (!fullySeekable) return;
      const sceneProgress = clamp((floatPosition - (index - .30)) / .88);
      const target = sceneProgress * Math.max(0, video.duration - 1 / 24);
      if (!video.seeking && Math.abs(video.currentTime - target) > .035) {
        try {
          if (typeof video.fastSeek === "function") video.fastSeek(target);
          else video.currentTime = target;
        } catch (_error) { /* Metadata or the requested byte range will retry on the next scroll frame. */ }
      }
    });
  }

  function syncFallbackPlayback() {
    sceneEls.forEach((scene, index) => {
      const video = scene.querySelector("video");
      if (!video || !scene.classList.contains("has-video") || !Number.isFinite(video.duration)) return;
      const fullySeekable = video.seekable.length > 0
        && video.seekable.end(video.seekable.length - 1) >= video.duration - .1;
      const shouldPlay = !fullySeekable && index === activeIndex;
      if (shouldPlay && video.paused) video.play().catch(() => {});
      else if (!shouldPlay && !video.paused) video.pause();
    });
  }

  function render() {
    ticking = false;
    const pageProgress = clamp(scrollY / maxScroll);
    const position = pageProgress * transitions;
    const leg = Math.min(transitions - 1, Math.floor(position));
    const local = leg === transitions - 1 && pageProgress === 1 ? 1 : position - leg;

    sceneEls.forEach(scene => {
      scene.style.opacity = "0";
      scene.style.removeProperty("--scene-origin");
      scene.style.removeProperty("--scene-blur");
      scene.style.removeProperty("--scene-clip");
    });
    copyEls.forEach((_, index) => setCopy(index, 0));
    routeMap.style.opacity = "0";
    flightReadout.style.opacity = "0";

    if (leg === 0) {
      const originOpacity = 1 - smoothstep(.26, .76, local);
      const cityOpacity = smoothstep(.48, .95, local);
      sceneEls[0].style.opacity = originOpacity.toFixed(3);
      sceneEls[1].style.opacity = cityOpacity.toFixed(3);
      sceneEls[0].style.setProperty("--scene-scale", String(1.02 + local * .15));
      sceneEls[1].style.setProperty("--scene-scale", String(1.1 - cityOpacity * .075));
      setCopy(0, 1 - smoothstep(.12, .43, local));
      setCopy(1, smoothstep(.73, .96, local));
      setActive(local < .58 ? 0 : 1);
    } else {
      const outgoing = 1 - smoothstep(.36, .58, local);
      const mapOpacity = smoothstep(.31, .48, local) * (1 - smoothstep(.72, .86, local));
      const incoming = smoothstep(.70, .94, local);
      sceneEls[leg].style.opacity = outgoing.toFixed(3);
      sceneEls[leg + 1].style.opacity = incoming.toFixed(3);
      routeMap.style.opacity = mapOpacity.toFixed(3);
      sceneEls[leg].style.setProperty("--scene-scale", String(1.025 + local * .045));
      sceneEls[leg + 1].style.setProperty("--scene-scale", String(1.1 - incoming * .075));
      if (leg > 0) {
        const pullback = smoothstep(.31, .58, local);
        const origin = mapOrigin(SCENES[leg]);
        sceneEls[leg].style.setProperty("--scene-origin", origin);
        sceneEls[leg].style.setProperty("--scene-scale", String(1.025 - pullback * .06));
        sceneEls[leg].style.setProperty("--scene-blur", `${(pullback * 2.2).toFixed(2)}px`);
        sceneEls[leg].style.setProperty("--scene-clip", `circle(${(150 - pullback * 148.2).toFixed(2)}% at ${origin})`);
      }
      setCopy(leg, 1 - smoothstep(.16, .34, local));
      setCopy(leg + 1, smoothstep(.82, .97, local));
      const flightProgress = smoothstep(.43, .78, local);
      setFlight(leg, flightProgress);
      const readoutOpacity = smoothstep(.40, .52, local) * (1 - smoothstep(.72, .84, local));
      flightReadout.style.opacity = readoutOpacity.toFixed(3);
      flightReadout.style.transform = `translate(-50%, ${(1 - readoutOpacity) * 18}px)`;
      flightReadout.querySelector("b").style.width = `${flightProgress * 100}%`;
      setActive(local < .58 ? leg : leg + 1);
    }

    seekVideos(position);
    syncFallbackPlayback();
    progressBar.style.transform = `scaleX(${pageProgress})`;
    if (innerWidth <= 820) timelineProgress.style.transform = `scaleX(${pageProgress})`;
    else timelineProgress.style.transform = `scaleY(${pageProgress})`;
    scrollCue.style.opacity = String(1 - smoothstep(.01, .07, pageProgress));
  }

  function update() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(render);
  }

  function scrollToScene(index) {
    const top = (index / transitions) * maxScroll;
    scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
  }

  function prepareVideo(video) {
    if (!video || video.dataset.prepared === "true") return;
    video.dataset.prepared = "true";
    video.preload = "auto";
    video.addEventListener("loadeddata", () => {
      video.parentElement.classList.add("has-video");
      update();
    }, { once: true });
    video.src = video.dataset.src;
    video.load();
  }

  function primeVideos(index) {
    if (journey.dataset.videos !== "true") return;
    const videos = [...document.querySelectorAll(".scene video[data-src][data-ready='true']")];
    if (innerWidth > 820) {
      videos.forEach(prepareVideo);
      return;
    }
    [index, index + 1].forEach(sceneIndex => prepareVideo(sceneEls[sceneIndex]?.querySelector("video")));
  }

  buildRoute();
  navButtons.forEach(button => button.addEventListener("click", () => scrollToScene(Number(button.dataset.index))));
  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", layout, { passive: true });
  addEventListener("keydown", event => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    scrollBy({ top: (event.key === "ArrowDown" ? 1 : -1) * innerHeight * .32, behavior: reducedMotion ? "auto" : "smooth" });
  });

  layout();
  primeVideos(0);
})();
