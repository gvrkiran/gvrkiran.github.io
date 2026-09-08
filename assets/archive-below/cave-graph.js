(function () {
  "use strict";

  const ERAS = [
    { id: "depth-01", name: "Publications from 2024–2027", years: [2027, 2026, 2025, 2024] },
    { id: "depth-02", name: "Publications from 2020–2023", years: [2023, 2022, 2021, 2020] },
    { id: "depth-03", name: "Publications from 2016–2019", years: [2019, 2018, 2017, 2016] },
    { id: "depth-04", name: "Publications from 2012–2015", years: [2015, 2014, 2013, 2012] },
    { id: "depth-05", name: "Publications from 2010–2011", years: [2011, 2010] }
  ];

  const YEAR_ACCENTS = {
    2027: "#d4b5ff", 2026: "#78e3b5", 2025: "#f28bc2", 2024: "#ffb45a",
    2023: "#8fcfff", 2022: "#70d6d0", 2021: "#a5a1ff", 2020: "#ff7d68",
    2019: "#5fd7ed", 2018: "#b8e66c", 2017: "#ff9568", 2016: "#bf8cff",
    2015: "#f4e5bb", 2014: "#efc063", 2013: "#6eb9ff", 2012: "#d7a8ff",
    2011: "#8ed0a0", 2010: "#f09a6b"
  };

  const YEARS = {};
  ERAS.forEach((era, eraIndex) => era.years.forEach(year => {
    YEARS[year] = {
      name: `Publications from ${year}`,
      accent: YEAR_ACCENTS[year],
      era: eraIndex,
      branch: `year-${year}-branch`,
      gallery: `year-${year}-gallery`
    };
  }));

  const CLIPS = { approach: "assets/archive-below/video/archive-approach-scrub.mp4" };
  ERAS.forEach((era, index) => {
    CLIPS[`trunk-${index}`] = `assets/archive-below/video/graph/trunk-${era.id}-scrub.mp4`;
    era.years.forEach(year => {
      CLIPS[`year-${year}-branch`] = `assets/archive-below/video/graph/year-${year}-branch-scrub.mp4`;
      CLIPS[`year-${year}-gallery`] = `assets/archive-below/video/graph/year-${year}-gallery-scrub.mp4`;
    });
  });
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const papersByYear = Object.fromEntries(Object.keys(YEARS).map(value => {
    const year = Number(value);
    return [year, (window.PUBLICATIONS || []).filter(paper => Number(paper.year) === year)];
  }));

  const $ = id => document.getElementById(id);
  const game = $("game");
  const poster = $("worldPoster");
  const videosRoot = $("worldVideos");
  const landing = $("landing");
  const enterButton = $("enterButton");
  const fork = $("fork");
  const forkTitle = $("forkTitle");
  const forkHint = $("forkHint");
  const eraDepthLabel = $("eraDepthLabel");
  const mainPathButton = $("mainPathButton");
  const yearConstellation = $("yearConstellation");
  const yearPosition = $("yearPosition");
  const selectedYearLabel = $("selectedYearLabel");
  const selectedYearName = $("selectedYearName");
  const selectedYearCount = $("selectedYearCount");
  const travel = $("travel");
  const pathNav = $("pathNav");
  const pathStatus = $("pathStatus");
  const pathEra = $("pathEra");
  const pathYear = $("pathYear");
  const pathDepth = $("pathDepth");
  const pathReturnButton = $("pathReturnButton");
  const pathReturnLabel = $("pathReturnLabel");
  const chamber = $("chamber");
  const artifactView = $("artifactView");
  const artifactRegions = $("artifactRegions");
  const signalMap = $("signalMap");
  const loading = $("loading");
  const loadingText = $("loadingText");
  const locationText = $("locationText");
  const routeText = $("routeText");
  const controlHint = $("controlHint");
  const journeyProgress = $("journeyProgress");
  const travelProgress = $("travelProgress");
  const travelKicker = $("travelKicker");
  const travelTitle = $("travelTitle");
  const chamberKicker = $("chamberKicker");
  const chamberTitle = $("chamberTitle");
  const scanner = $("scanner");
  const scannerText = $("scannerText");
  const artifactTitle = $("artifactTitle");
  const artifactIndex = $("artifactIndex");
  const artifactVenue = $("artifactVenue");
  const artifactAuthors = $("artifactAuthors");
  const artifactLink = $("artifactLink");

  game.dataset.graph = "true";
  game.dataset.runtimeVersion = "notes-10";

  const media = new Map();
  const loadedKeys = new Set();
  const heldKeys = new Set();
  const MAX_RETAINED_MEDIA = 8;
  const selections = [2024, 2023, 2019, 2015, 2011];
  let regions = window.ARCHIVE_REGIONS || {};
  let activeKey = null;
  let activeVideo = null;
  let activeYear = null;
  let currentEra = -1;
  let desiredTime = 0;
  let pendingDelta = 0;
  let navigationRunning = false;
  let transitioning = false;
  let entryPromise = null;
  let seekRaf = 0;
  let seekWaitVideo = null;
  let settleTimer = 0;
  let previousFocus = null;
  let scannerTimer = 0;
  let lastSignal = "";
  let nearestArtifact = 0;
  let currentTracks = [];
  let visibleArtifacts = [];
  let regionsReady = Promise.resolve();
  let pointerY = null;
  let pointerId = null;
  let pointerStartX = null;
  let pointerStartY = null;
  let pointerCurrentX = null;
  let pointerCurrentY = null;
  let preloadTimer = 0;
  let hubWheel = 0;
  let lastHubMove = 0;
  let manualInputReady = true;
  let inputArmTimer = 0;
  let entryMotionRequested = false;

  const once = (target, event) => new Promise(resolve => target.addEventListener(event, resolve, { once: true }));
  const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
  const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));
  const frameEnd = video => Math.max(0, video.duration - (1 / 24));
  const roman = value => ["I", "II", "III", "IV", "V"][value] || String(value + 1);
  const setMode = mode => { game.dataset.mode = mode; };
  const setJourney = progress => { journeyProgress.style.width = `${clamp(progress, 0, 1) * 100}%`; };
  const setTravelProgress = progress => { travelProgress.style.width = `${clamp(progress, 0, 1) * 100}%`; };

  function armInputAfterQuiet(milliseconds = 650) {
    clearTimeout(inputArmTimer);
    inputArmTimer = setTimeout(() => { manualInputReady = true; }, milliseconds);
  }

  function latchNavigationInput() {
    manualInputReady = false;
    clearTimeout(settleTimer);
    settleTimer = 0;
    pendingDelta = 0;
    hubWheel = 0;
    heldKeys.clear();
    pointerId = null;
    pointerY = null;
    pointerStartX = pointerStartY = pointerCurrentX = pointerCurrentY = null;
    armInputAfterQuiet(650);
  }

  function releaseNavigationInput() {
    clearTimeout(inputArmTimer);
    manualInputReady = true;
  }

  function holdInputUntilQuiet() {
    if (manualInputReady) return false;
    armInputAfterQuiet(650);
    return true;
  }

  function paperHref(paper) {
    const links = paper.links || [];
    const preferred = links.find(link => /paper|preprint/i.test(link.label || "")) || links[0];
    return preferred ? preferred.href : "publications-field-guide.html";
  }

  function escapeHTML(value) {
    return String(value || "").replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[character]));
  }

  function setLoading(message, visible, error = false) {
    loadingText.textContent = message;
    loading.hidden = !visible;
    loading.classList.toggle("is-visible", visible);
    loading.classList.toggle("is-error", error);
  }

  async function loadClip(key, announce = false) {
    if (media.has(key)) {
      if (announce && !loadedKeys.has(key)) setLoading("Opening the connected passage", true);
      try {
        return await media.get(key);
      } finally {
        if (announce) setLoading("Route ready", false);
      }
    }
    const promise = (async () => {
      if (announce) setLoading("Opening the connected passage", true);
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      // Speculative clips only need metadata and their first decodable frame.
      // Random-access range requests fetch the rest when the visitor enters.
      video.preload = "metadata";
      video.disablePictureInPicture = true;
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.src = CLIPS[key];
      videosRoot.appendChild(video);
      if (video.readyState < 1) {
        await Promise.race([
          once(video, "loadedmetadata"),
          new Promise((resolve, reject) => video.addEventListener("error", () => reject(new Error(`Unable to load ${CLIPS[key]}`)), { once: true })),
          wait(10000).then(() => { throw new Error(`Timed out loading ${CLIPS[key]}`); })
        ]);
      }
      if (video.readyState < 2) await Promise.race([once(video, "loadeddata"), wait(2500)]);
      loadedKeys.add(key);
      return video;
    })();
    media.set(key, promise);
    try {
      return await promise;
    } catch (error) {
      media.delete(key);
      throw error;
    } finally {
      if (announce) setLoading("Route ready", false);
    }
  }

  function preload(key) { if (CLIPS[key]) loadClip(key).catch(() => {}); }

  function releaseMedia(key, promise) {
    media.delete(key);
    loadedKeys.delete(key);
    Promise.resolve(promise).then(video => {
      if (video === activeVideo) return;
      video.pause();
      video.removeAttribute("src");
      video.load();
      video.remove();
    }).catch(() => {});
  }

  function pruneMedia() {
    while (media.size > MAX_RETAINED_MEDIA) {
      const candidate = [...media.entries()].find(([key]) => key !== activeKey);
      if (!candidate) return;
      releaseMedia(candidate[0], candidate[1]);
    }
  }

  function waitForDecodedFrame(video, milliseconds = 160) {
    if (typeof video.requestVideoFrameCallback !== "function") return wait(40);
    return new Promise(resolve => {
      let finished = false;
      const done = () => {
        if (finished) return;
        finished = true;
        resolve();
      };
      video.requestVideoFrameCallback(done);
      setTimeout(done, milliseconds);
    });
  }

  async function seekExact(video, time) {
    const target = clamp(time, 0, frameEnd(video));
    if (!video.seeking && Math.abs(video.currentTime - target) <= 0.022) return;
    // Exact confirmation is reserved for scene boundaries. One corrective
    // seek is enough; repeating decoder callbacks made ordinary scrolling
    // wait hundreds of milliseconds between visible updates.
    const complete = once(video, "seeked");
    video.currentTime = target;
    await Promise.race([complete, wait(320)]);
    if (!video.seeking && Math.abs(video.currentTime - target) > 0.06) {
      const correction = once(video, "seeked");
      video.currentTime = target;
      await Promise.race([correction, wait(220)]);
    }
    await waitForDecodedFrame(video);
  }

  async function commitActiveFrame(time) {
    if (!activeVideo) return;
    clearTimeout(settleTimer);
    settleTimer = 0;
    if (seekRaf) cancelAnimationFrame(seekRaf);
    seekRaf = 0;
    seekWaitVideo = null;
    desiredTime = clamp(time, 0, frameEnd(activeVideo));
    await seekExact(activeVideo, desiredTime);
  }

  async function showClip(key, time, announce = false) {
    const next = await loadClip(key, announce);
    next.pause();
    clearTimeout(settleTimer);
    settleTimer = 0;
    await seekExact(next, time);
    const previous = activeVideo;
    if (seekRaf) cancelAnimationFrame(seekRaf);
    seekRaf = 0;
    seekWaitVideo = null;
    activeVideo = next;
    activeKey = key;
    desiredTime = clamp(time, 0, frameEnd(next));
    next.classList.add("is-active");
    poster.style.opacity = "0";
    if (previous && previous !== next) {
      previous.classList.add("is-seam-outgoing");
      await wait(110);
      previous.classList.remove("is-active", "is-dimmed", "is-seam-outgoing");
      previous.pause();
    }
    pruneMedia();
    return next;
  }

  function paintDesiredFrame() {
    seekRaf = 0;
    if (!activeVideo) return;
    const video = activeVideo;
    const target = clamp(desiredTime, 0, frameEnd(video));
    if (video.seeking) {
      if (seekWaitVideo !== video) {
        seekWaitVideo = video;
        video.addEventListener("seeked", () => {
          if (seekWaitVideo === video) seekWaitVideo = null;
          if (activeVideo === video) requestFrame(desiredTime);
        }, { once: true });
      }
      return;
    }
    if (Math.abs(video.currentTime - target) > 0.018) video.currentTime = target;
  }

  function requestFrame(time) {
    if (!activeVideo) return;
    desiredTime = clamp(time, 0, frameEnd(activeVideo));
    if (!seekRaf) {
      // Apply the first seek synchronously.  The animation-frame pass then
      // coalesces any additional wheel or key events that arrive meanwhile.
      // This avoids a stale requestAnimationFrame from the outgoing clip
      // pinning a newly entered gallery to its first frame.
      if (Math.abs(activeVideo.currentTime - desiredTime) > 0.018) {
        try { activeVideo.currentTime = desiredTime; } catch (_error) { /* metadata retry on RAF */ }
      }
      seekRaf = requestAnimationFrame(paintDesiredFrame);
    }
    scheduleFrameSettlement();
  }

  function scheduleFrameSettlement(milliseconds = 130) {
    clearTimeout(settleTimer);
    const video = activeVideo;
    const key = activeKey;
    const target = desiredTime;
    settleTimer = setTimeout(async () => {
      settleTimer = 0;
      if (activeVideo !== video || activeKey !== key || Math.abs(desiredTime - target) > .001) return;
      if (video.seeking) await Promise.race([once(video, "seeked"), wait(180)]);
      if (activeVideo !== video || activeKey !== key || Math.abs(desiredTime - target) > .001) return;
      if (Math.abs(video.currentTime - target) > .04) {
        try { video.currentTime = target; } catch (_error) { /* next input retries */ }
      }
    }, milliseconds);
  }

  function spinePosition(key, progress) {
    const segment = key === "approach" ? 0 : Number(key.split("-")[1]) + 1;
    return (segment + clamp(progress, 0, 1)) / (ERAS.length + 1);
  }

  function updateSpine(progress) {
    const position = spinePosition(activeKey, progress);
    setJourney(position * .62);
    if (activeKey === "approach") {
      routeText.textContent = "Surface / Main descent";
      locationText.textContent = progress > .78 ? "The deeper route is opening" : "Archive vein / manual descent";
    } else {
      const index = Number(activeKey.split("-")[1]);
      routeText.textContent = `Main descent / Depth ${roman(index)}`;
      locationText.textContent = `${ERAS[index].name} ahead`;
      if (progress > .72 && index < ERAS.length - 1) preload(`trunk-${index + 1}`);
    }
    controlHint.textContent = "Scroll or ↓ deeper · ↑ retraces the same path";
  }

  function updateYearSelection(year, focus = false) {
    if (!YEARS[year] || YEARS[year].era !== currentEra) return;
    selections[currentEra] = year;
    const era = ERAS[currentEra];
    const index = era.years.indexOf(year);
    yearConstellation.querySelectorAll(".portal").forEach(portal => {
      const selected = Number(portal.dataset.year) === year;
      portal.classList.toggle("is-selected", selected);
      portal.setAttribute("aria-current", selected ? "true" : "false");
      portal.setAttribute("tabindex", selected ? "0" : "-1");
    });
    const papers = papersByYear[year] || [];
    yearPosition.textContent = `${String(index + 1).padStart(2, "0")} / ${String(era.years.length).padStart(2, "0")} · DEPTH ${roman(currentEra)}`;
    selectedYearLabel.textContent = String(year);
    selectedYearName.textContent = YEARS[year].name;
    selectedYearCount.textContent = `${papers.length} publication${papers.length === 1 ? "" : "s"}`;
    game.style.setProperty("--accent", YEARS[year].accent);
    routeText.textContent = `Browse by year / ${year} selected`;
    locationText.textContent = era.name;
    if (focus) yearConstellation.querySelector(`.portal[data-year="${year}"]`)?.focus({ preventScroll: true });
    clearTimeout(preloadTimer);
    preloadTimer = setTimeout(() => preload(YEARS[year].branch), 180);
  }

  function selectRelativeYear(direction, focus = false) {
    if (currentEra < 0) return;
    const years = ERAS[currentEra].years;
    const current = years.indexOf(selections[currentEra]);
    updateYearSelection(years[(current + direction + years.length) % years.length], focus);
  }

  function renderHub(index) {
    const era = ERAS[index];
    forkTitle.textContent = era.name;
    forkHint.innerHTML = "<kbd>←</kbd> <kbd>→</kbd> choose a year · <kbd>Enter</kbd> opens it · scroll / <kbd>↓</kbd> explores earlier years · <kbd>↑</kbd> goes back";
    const publicationCount = era.years.reduce((total, year) => total + (papersByYear[year]?.length || 0), 0);
    eraDepthLabel.textContent = `${era.years.at(-1)}–${era.years[0]} · ${publicationCount} publications`;
    yearConstellation.dataset.count = String(era.years.length);
    yearConstellation.innerHTML = era.years.map(year => {
      const config = YEARS[year];
      const count = papersByYear[year]?.length || 0;
      return `<button class="portal" data-year="${year}" type="button" style="--portal:${config.accent}" aria-label="Enter ${year}: ${config.name}, ${count} publications">
        <span class="portal__ring" aria-hidden="true"><i></i><b></b></span>
        <span class="portal__card"><small>${count} publication${count === 1 ? "" : "s"}</small><strong>${year}</strong><em>${config.name}</em></span>
      </button>`;
    }).join("");
    yearConstellation.querySelectorAll(".portal").forEach(portal => portal.addEventListener("click", () => {
      const year = Number(portal.dataset.year);
      updateYearSelection(year);
      enterYear(year);
    }));
    const last = index === ERAS.length - 1;
    mainPathButton.classList.toggle("is-origin", last);
    mainPathButton.disabled = last;
    mainPathButton.querySelector("span").textContent = last ? "All publication years explored" : "Explore earlier publications";
    mainPathButton.querySelector("i").textContent = last ? "◆" : "↓";
    updateYearSelection(selections[index]);
  }

  async function activateHub(index) {
    currentEra = index;
    activeYear = null;
    delete game.dataset.year;
    document.body.removeAttribute("data-year");
    fork.hidden = false;
    chamber.hidden = true;
    travel.hidden = true;
    hidePathNav();
    setMode("hub");
    latchNavigationInput();
    renderHub(index);
    setJourney(((index + 2) / (ERAS.length + 1)) * .62);
    locationText.textContent = ERAS[index].name;
    controlHint.textContent = "Choose a year · scroll again for earlier publications";
    if (index < ERAS.length - 1) preload(`trunk-${index + 1}`);
  }

  async function leaveHub(direction) {
    if (transitioning || currentEra < 0) return;
    if (direction > 0 && currentEra >= ERAS.length - 1) return;
    transitioning = true;
    latchNavigationInput();
    fork.hidden = true;
    setMode("spine");
    try {
      if (direction > 0) {
        await showClip(`trunk-${currentEra + 1}`, 0, true);
        updateSpine(0);
        transitioning = false;
        releaseNavigationInput();
        navigateBy(.36);
      } else {
        const trunk = await loadClip(`trunk-${currentEra}`, true);
        await showClip(`trunk-${currentEra}`, frameEnd(trunk));
        updateSpine(1);
        transitioning = false;
        releaseNavigationInput();
        navigateBy(-.36);
      }
    } catch (error) {
      transitioning = false;
      fork.hidden = false;
      setMode("hub");
      displayLoadError("The next connected passage could not be opened", error);
    }
  }

  function updatePathNav(progress, zone) {
    if (!activeYear) return;
    pathNav.hidden = false;
    pathEra.textContent = `Depth ${roman(currentEra)}`;
    pathYear.textContent = `${activeYear} ${zone}`;
    pathDepth.style.width = `${clamp(progress, 0, 1) * 100}%`;
    if (!pathNav.classList.contains("is-returning")) {
      pathStatus.textContent = "Exploring selected year";
      pathReturnLabel.textContent = "Back to year selection";
      pathReturnButton.disabled = false;
    }
  }

  function setPathReturning(stage) {
    pathNav.hidden = false;
    pathNav.classList.add("is-returning");
    pathStatus.textContent = "Returning to year selection";
    pathReturnLabel.textContent = stage;
    pathReturnButton.disabled = true;
  }

  function hidePathNav() {
    pathNav.hidden = true;
    pathNav.classList.remove("is-returning");
    pathReturnButton.disabled = false;
  }

  function updateBranch(progress) {
    if (!activeYear) return;
    const mainDepth = ((currentEra + 2) / (ERAS.length + 1)) * .62;
    setJourney(mainDepth + progress * .17);
    setTravelProgress(progress);
    updatePathNav(progress * .5, "passage");
    routeText.textContent = `Depth ${roman(currentEra)} / ${activeYear} / ${YEARS[activeYear].name}`;
    locationText.textContent = `Publications from ${activeYear}`;
    controlHint.textContent = "Scroll or ↓ to continue · ↑ goes back";
  }

  function regionData(year) {
    const tracked = regions.years?.[String(year)];
    if (tracked?.tracks?.length) return tracked;
    const papers = papersByYear[year] || [];
    return {
      anchors: papers.map((_, index) => (index + 1) / (papers.length + 1)),
      tracks: []
    };
  }

  function interpolateValues(before, after, amount) {
    return before.map((value, index) => value + (after[index] - value) * amount);
  }

  function interpolateGeometry(track, progress) {
    const keyframes = track.keyframes;
    if (keyframes.length === 1 || progress <= keyframes[0].progress) return keyframes[0];
    if (progress >= keyframes[keyframes.length - 1].progress) return keyframes[keyframes.length - 1];
    let upper = 1;
    while (upper < keyframes.length && keyframes[upper].progress < progress) upper += 1;
    const before = keyframes[upper - 1];
    const after = keyframes[upper];
    const amount = clamp((progress - before.progress) / Math.max(.00001, after.progress - before.progress), 0, 1);
    return {
      polygon: before.polygon.map((point, index) => interpolateValues(point, after.polygon[index] || point, amount)),
      bbox: interpolateValues(before.bbox, after.bbox, amount)
    };
  }

  function mergePublicationTracks(tracks, papers, year) {
    const grouped = new Map();
    tracks.filter(track => papers[track.paper]).forEach(track => {
      if (!grouped.has(track.paper)) grouped.set(track.paper, []);
      grouped.get(track.paper).push(track);
    });
    return [...grouped.entries()].sort((a, b) => a[0] - b[0]).flatMap(([paper, fragments]) => {
      const ordered = fragments.sort((a, b) => a.start - b.start);
      // The 2027 film changes object typology mid-shot. Preserve genuinely
      // separated lens/monolith fragments so an outline cannot glide across
      // empty cave between two unrelated pieces of geometry.
      const clusters = year === 2027
        ? ordered.reduce((result, fragment) => {
            const latest = result[result.length - 1];
            const latestEnd = latest ? Math.max(...latest.map(item => item.end)) : -1;
            if (!latest || fragment.start > latestEnd + .13) result.push([fragment]);
            else latest.push(fragment);
            return result;
          }, [])
        : [ordered];
      return clusters.map((cluster, clusterIndex) => {
        const byProgress = new Map();
        cluster.forEach(fragment => fragment.keyframes.forEach(keyframe => {
          const key = Number(keyframe.progress).toFixed(6);
          const previous = byProgress.get(key);
          if (!previous || (keyframe.confidence || 0) > (previous.confidence || 0)) byProgress.set(key, keyframe);
        }));
        return {
          id: `paper-${paper}-${clusterIndex}`,
          paper,
          start: Math.min(...cluster.map(fragment => fragment.start)),
          end: Math.max(...cluster.map(fragment => fragment.end)),
          anchor: cluster.reduce((sum, fragment) => sum + fragment.anchor, 0) / cluster.length,
          keyframes: [...byProgress.values()].sort((a, b) => a.progress - b.progress)
        };
      });
    });
  }

  function intersectsVisibleFilm(bbox) {
    const filmAspect = 1344 / 768;
    const viewportAspect = innerWidth / Math.max(innerHeight, 1);
    let left = 0, right = 1344, top = 0, bottom = 768;
    if (viewportAspect < filmAspect) {
      const width = 768 * viewportAspect;
      left = (1344 - width) / 2;
      right = left + width;
    } else {
      const height = 1344 / viewportAspect;
      top = (768 - height) / 2;
      bottom = top + height;
    }
    const margin = 18;
    const overlapWidth = Math.max(0, Math.min(bbox[2], right + margin) - Math.max(bbox[0], left - margin));
    const overlapHeight = Math.max(0, Math.min(bbox[3], bottom + margin) - Math.max(bbox[1], top - margin));
    return overlapWidth > 0 && overlapHeight > 0;
  }

  function renderRegions(year) {
    const papers = papersByYear[year] || [];
    const data = regionData(year);
    // A detector may lose an object for several sampled frames and recover it as
    // a new fragment. Render one continuous target per publication and bridge
    // those gaps so a visible stone never stops being clickable mid-scroll.
    currentTracks = mergePublicationTracks(data.tracks, papers, Number(year));
    artifactRegions.innerHTML = currentTracks.map(track => {
      const index = track.paper;
      const paper = papers[index];
      const number = String(index + 1).padStart(2, "0");
      return `<g class="artifact-target" role="button" tabindex="-1" data-track="${track.id}" data-index="${index}" aria-label="Open publication ${number}: ${escapeHTML(paper.title)}">
        <title>${escapeHTML(paper.title)}</title><rect class="artifact-target__hit"></rect><polygon class="artifact-target__wash"></polygon><polygon class="artifact-target__outline"></polygon>
        <g class="artifact-target__seal"><circle r="20"></circle><circle r="12"></circle><text y="3">${number}</text></g></g>`;
    }).join("");
    signalMap.innerHTML = papers.map((paper, index) => {
      const anchor = data.anchors?.[index] ?? (index + 1) / (papers.length + 1);
      return `<button class="signal-map__dot" type="button" data-index="${index}" data-anchor="${anchor}" aria-label="Move to publication ${index + 1}: ${escapeHTML(paper.title)}"></button>`;
    }).join("");
    artifactRegions.querySelectorAll(".artifact-target").forEach(target => {
      target.addEventListener("pointerenter", () => {
        const paper = papers[Number(target.dataset.index)];
        if (paper) { scannerText.textContent = paper.title; scanner.classList.add("is-visible"); }
      });
      target.addEventListener("pointerleave", () => scanner.classList.remove("is-visible"));
    });
  }

  function positionTarget(target, track, progress) {
    // The offline detector samples the film rather than every decoded frame.
    // A temporal guard band prevents real stones from flickering off between
    // samples or while their last visible edge is still inside the viewport.
    const start = Math.max(0, track.start - .055);
    const end = Math.min(1, track.end + .12);
    if (progress < start || progress > end) {
      target.classList.remove("is-visible");
      target.setAttribute("tabindex", "-1");
      return null;
    }
    const geometry = interpolateGeometry(track, progress);
    const bbox = geometry.bbox;
    const width = Math.max(1, bbox[2] - bbox[0]);
    const height = Math.max(1, bbox[3] - bbox[1]);
    const padX = Math.max(11, (62 - width) / 2);
    const padY = Math.max(11, (62 - height) / 2);
    const centerX = (bbox[0] + bbox[2]) / 2;
    const centerY = (bbox[1] + bbox[3]) / 2;
    const points = geometry.polygon.map(point => `${point[0].toFixed(1)},${point[1].toFixed(1)}`).join(" ");
    const hit = target.querySelector(".artifact-target__hit");
    hit.setAttribute("x", (bbox[0] - padX).toFixed(1));
    hit.setAttribute("y", (bbox[1] - padY).toFixed(1));
    hit.setAttribute("width", (width + padX * 2).toFixed(1));
    hit.setAttribute("height", (height + padY * 2).toFixed(1));
    target.querySelector(".artifact-target__wash").setAttribute("points", points);
    target.querySelector(".artifact-target__outline").setAttribute("points", points);
    target.querySelector(".artifact-target__seal").setAttribute("transform", `translate(${centerX.toFixed(1)} ${centerY.toFixed(1)})`);
    const visible = intersectsVisibleFilm(bbox);
    target.classList.toggle("is-visible", visible);
    target.setAttribute("tabindex", visible ? "0" : "-1");
    if (!visible) return null;
    const edge = Math.min((progress - start) / .035, (end - progress) / .035, 1);
    target.style.setProperty("--visibility", clamp(edge, .5, 1).toFixed(3));
    return { target, track, index: Number(target.dataset.index), centerX, centerY, bbox };
  }

  function updateExploration(progress) {
    const clamped = clamp(progress, 0, 1);
    chamber.classList.toggle("is-exploring", clamped > .035);
    const targets = [...artifactRegions.querySelectorAll(".artifact-target")];
    visibleArtifacts = targets.map((target, index) => positionTarget(target, currentTracks[index], clamped)).filter(Boolean);
    let nearest = null;
    let distance = Infinity;
    visibleArtifacts.forEach(item => {
      const candidate = Math.hypot(item.centerX - 672, item.centerY - 384);
      if (candidate < distance) { distance = candidate; nearest = item; }
    });
    if (nearest) nearestArtifact = nearest.index;
    else {
      let anchorDistance = Infinity;
      signalMap.querySelectorAll(".signal-map__dot").forEach(dot => {
        const candidate = Math.abs(clamped - Number(dot.dataset.anchor));
        if (candidate < anchorDistance) { anchorDistance = candidate; nearestArtifact = Number(dot.dataset.index); }
      });
    }
    const shown = new Set(visibleArtifacts.map(item => item.index));
    signalMap.querySelectorAll(".signal-map__dot").forEach((dot, index) => {
      const anchor = Number(dot.dataset.anchor);
      dot.classList.toggle("is-passed", clamped >= anchor);
      dot.classList.toggle("is-visible", shown.has(index));
      dot.classList.toggle("is-near", index === nearestArtifact && shown.has(index));
    });
    const mainDepth = ((currentEra + 2) / (ERAS.length + 1)) * .62;
    setJourney(mainDepth + .17 + clamped * .21);
    const signature = [...shown].sort((a, b) => a - b).join("-");
    if (signature && signature !== lastSignal) {
      lastSignal = signature;
      scannerText.textContent = `${shown.size} publication${shown.size === 1 ? "" : "s"} visible · click any outline`;
      scanner.classList.add("is-visible");
      clearTimeout(scannerTimer);
      scannerTimer = setTimeout(() => scanner.classList.remove("is-visible"), 1200);
    }
  }

  function updateGallery(progress) {
    if (!activeYear) return;
    const clamped = clamp(progress, 0, 1);
    updateExploration(clamped);
    updatePathNav(.5 + clamped * .5, "gallery");
    routeText.textContent = `Publications / ${activeYear}`;
    locationText.textContent = YEARS[activeYear].name;
    const firstTarget = Math.min(...currentTracks.map(track => Math.max(0, track.start - .055)), 1);
    if (!visibleArtifacts.length && clamped < firstTarget) {
      const count = papersByYear[activeYear]?.length || 0;
      controlHint.textContent = `${count} publications ahead · continue forward or use the timeline`;
    } else {
      controlHint.textContent = `${visibleArtifacts.length || "No"} publication${visibleArtifacts.length === 1 ? "" : "s"} visible · click any outline`;
    }
  }

  async function showChamber(year) {
    await regionsReady;
    renderRegions(year);
    setMode("chamber");
    travel.hidden = true;
    chamber.hidden = false;
    chamberKicker.textContent = `${papersByYear[year].length} publications`;
    chamberTitle.textContent = `${year} publications`;
    updateGallery(desiredTime / frameEnd(activeVideo));
  }

  function hideChamberForRoute() {
    chamber.hidden = true;
    scanner.classList.remove("is-visible");
    travel.hidden = false;
    setMode("route");
  }

  async function beginDescent() {
    if (entryPromise) return entryPromise;
    entryPromise = (async () => {
      enterButton.disabled = true;
      enterButton.querySelector("span").textContent = "Opening the descent";
      try {
        await showClip("approach", 0, true);
        landing.classList.add("is-leaving");
        await wait(360);
        landing.hidden = true;
        setMode("spine");
        updateSpine(0);
        preload("trunk-0");
        releaseNavigationInput();
      } catch (error) {
        displayLoadError("The descent could not be opened", error);
        enterButton.disabled = false;
        enterButton.querySelector("span").textContent = "Try again";
        entryPromise = null;
      }
    })();
    return entryPromise;
  }

  async function enterYear(year) {
    if (transitioning || !YEARS[year] || YEARS[year].era !== currentEra) return;
    transitioning = true;
    latchNavigationInput();
    activeYear = year;
    game.dataset.year = String(year);
    document.body.dataset.year = String(year);
    game.style.setProperty("--accent", YEARS[year].accent);
    fork.hidden = true;
    chamber.hidden = true;
    travel.hidden = false;
    travelKicker.textContent = "Opening publications from";
    travelTitle.textContent = String(year);
    setTravelProgress(0);
    lastSignal = "";
    updatePathNav(0, "passage");
    try {
      await showClip(YEARS[year].branch, 0, true);
      setMode("route");
      updateBranch(0);
      preload(YEARS[year].gallery);
      releaseNavigationInput();
    } catch (error) {
      displayLoadError(`The ${year} passage could not be opened`, error);
      const trunk = await loadClip(`trunk-${currentEra}`);
      await showClip(`trunk-${currentEra}`, frameEnd(trunk));
      await activateHub(currentEra);
    } finally {
      transitioning = false;
    }
  }

  async function moveSpine(delta, depth) {
    const end = frameEnd(activeVideo);
    const target = desiredTime + delta;
    if (target >= end) {
      const remainder = target - end;
      await commitActiveFrame(end);
      updateSpine(1);
      if (activeKey === "approach") {
        await showClip("trunk-0", 0, true);
        updateSpine(0);
        if (remainder > 0) await moveDelta(remainder, depth + 1);
      } else {
        const index = Number(activeKey.split("-")[1]);
        await activateHub(index);
      }
      return;
    }
    if (target < 0) {
      const remainder = target;
      await commitActiveFrame(0);
      if (activeKey === "approach") {
        requestFrame(0);
        updateSpine(0);
      } else {
        const index = Number(activeKey.split("-")[1]);
        const previousKey = index === 0 ? "approach" : `trunk-${index - 1}`;
        const previous = await loadClip(previousKey, true);
        await showClip(previousKey, frameEnd(previous));
        updateSpine(1);
        if (index > 0) await activateHub(index - 1);
        else if (remainder < 0) await moveDelta(remainder, depth + 1);
      }
      return;
    }
    requestFrame(target);
    updateSpine(end ? target / end : 0);
  }

  async function moveDelta(delta, depth = 0) {
    if (!Number.isFinite(delta) || Math.abs(delta) < .001 || depth > 8 || transitioning) return;
    const mode = game.dataset.mode;
    if (["landing", "artifact", "hub"].includes(mode) || !activeVideo) return;
    if (mode === "spine") return moveSpine(delta, depth);
    if (!activeYear) return;
    const config = YEARS[activeYear];
    const end = frameEnd(activeVideo);
    const target = desiredTime + delta;

    if (activeKey === config.branch) {
      if (target >= end) {
        const remainder = target - end;
        await commitActiveFrame(end);
        updateBranch(1);
        transitioning = true;
        try {
          await showClip(config.gallery, 0, true);
          await showChamber(activeYear);
        } finally { transitioning = false; }
        // Branch and gallery are one continuous route, not a choice boundary.
        // Preserve the tail of the gesture instead of pinning the gallery to
        // its first frame and forcing a second scroll.
        if (remainder > .001) await moveDelta(remainder, depth + 1);
      } else if (target < 0) {
        await commitActiveFrame(0);
        transitioning = true;
        latchNavigationInput();
        try {
          const trunk = await loadClip(`trunk-${currentEra}`, true);
          await showClip(`trunk-${currentEra}`, frameEnd(trunk));
          await activateHub(currentEra);
        } finally { transitioning = false; }
      } else {
        requestFrame(target);
        updateBranch(end ? target / end : 0);
      }
      return;
    }

    if (activeKey === config.gallery) {
      if (target < 0) {
        const remainder = target;
        await commitActiveFrame(0);
        hideChamberForRoute();
        transitioning = true;
        try {
          const branch = await loadClip(config.branch, true);
          await showClip(config.branch, frameEnd(branch));
          updateBranch(1);
        } finally { transitioning = false; }
        if (remainder < -.001) await moveDelta(remainder, depth + 1);
      } else {
        const next = clamp(target, 0, end);
        requestFrame(next);
        updateGallery(end ? next / end : 0);
      }
    }
  }

  function navigateBy(delta) {
    if (game.dataset.mode === "artifact") return;
    pendingDelta += delta;
    if (navigationRunning) return;
    navigationRunning = true;
    (async () => {
      while (Math.abs(pendingDelta) >= .001) {
        const amount = pendingDelta;
        pendingDelta = 0;
        await moveDelta(amount);
      }
      navigationRunning = false;
    })().catch(error => {
      navigationRunning = false;
      displayLoadError("The route stopped responding", error);
    });
  }

  async function moveToArtifact(index) {
    if (transitioning || game.dataset.mode !== "chamber" || !activeVideo) return;
    const dot = signalMap.querySelector(`[data-index="${index}"]`);
    if (!dot) return;
    transitioning = true;
    const start = desiredTime;
    const target = Number(dot.dataset.anchor) * frameEnd(activeVideo);
    const began = performance.now();
    const duration = reduceMotion ? 1 : Math.min(850, 380 + Math.abs(target - start) * 55);
    await new Promise(resolve => {
      const animate = now => {
        const linear = Math.min(1, (now - began) / duration);
        const eased = .5 - Math.cos(linear * Math.PI) / 2;
        const current = start + (target - start) * eased;
        requestFrame(current);
        updateGallery(current / frameEnd(activeVideo));
        if (linear < 1) requestAnimationFrame(animate); else resolve();
      };
      requestAnimationFrame(animate);
    });
    transitioning = false;
    artifactRegions.querySelector(`[data-index="${index}"].is-visible`)?.focus({ preventScroll: true });
  }

  function inspectArtifact(index) {
    if (!activeYear || game.dataset.mode !== "chamber") return;
    const papers = papersByYear[activeYear] || [];
    const paper = papers[index];
    if (!paper) return;
    previousFocus = document.activeElement;
    artifactIndex.textContent = `Publication ${String(index + 1).padStart(2, "0")} / ${String(papers.length).padStart(2, "0")} · ${activeYear}`;
    artifactTitle.textContent = paper.title;
    artifactVenue.textContent = paper.venue || "Research publication";
    artifactAuthors.textContent = (paper.authors || []).join(" · ");
    artifactLink.href = paperHref(paper);
    artifactView.hidden = false;
    artifactView.setAttribute("aria-hidden", "false");
    activeVideo.classList.add("is-dimmed");
    setMode("artifact");
    $("artifactClose").focus({ preventScroll: true });
  }

  function closeArtifact() {
    artifactView.setAttribute("aria-hidden", "true");
    artifactView.hidden = true;
    activeVideo?.classList.remove("is-dimmed");
    setMode("chamber");
    previousFocus?.focus({ preventScroll: true });
  }

  async function animateCurrentTo(target, milliseconds, updater) {
    const video = activeVideo;
    const start = desiredTime;
    const began = performance.now();
    await new Promise(resolve => {
      const animate = now => {
        const linear = Math.min(1, (now - began) / milliseconds);
        const eased = linear * linear * (3 - 2 * linear);
        const current = start + (target - start) * eased;
        requestFrame(current);
        updater?.(current / frameEnd(video));
        if (linear < 1) requestAnimationFrame(animate); else resolve();
      };
      requestAnimationFrame(animate);
    });
    await seekExact(video, target);
    desiredTime = target;
  }

  async function returnToHub() {
    if (transitioning || !activeYear || !activeVideo) return;
    transitioning = true;
    latchNavigationInput();
    pendingDelta = 0;
    heldKeys.clear();
    const year = activeYear;
    const config = YEARS[year];
    hideChamberForRoute();
    setPathReturning(activeKey === config.gallery ? "Leaving this year…" : "Returning…");
    travelKicker.textContent = "Back to year selection";
    travelTitle.textContent = String(year);
    try {
      if (activeKey === config.gallery) {
        await animateCurrentTo(0, reduceMotion ? 1 : 720, updateGallery);
        const branch = await loadClip(config.branch, true);
        await showClip(config.branch, frameEnd(branch));
      }
      setPathReturning("Returning to year selection…");
      await animateCurrentTo(0, reduceMotion ? 1 : 1150, updateBranch);
      const trunk = await loadClip(`trunk-${currentEra}`, true);
      await showClip(`trunk-${currentEra}`, frameEnd(trunk));
      await activateHub(currentEra);
    } catch (error) {
      pathNav.classList.remove("is-returning");
      pathReturnButton.disabled = false;
      displayLoadError("The return route could not be opened", error);
    } finally { transitioning = false; }
  }

  function displayLoadError(message, error) {
    setLoading(message, true, true);
    console.error(error);
  }

  enterButton.addEventListener("click", beginDescent);
  mainPathButton.addEventListener("click", () => leaveHub(1));
  $("returnButton").addEventListener("click", returnToHub);
  pathReturnButton.addEventListener("click", returnToHub);
  $("artifactClose").addEventListener("click", closeArtifact);
  $("fullscreenButton").addEventListener("click", async () => {
    if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen();
  });

  artifactRegions.addEventListener("click", event => {
    const target = event.target.closest(".artifact-target");
    if (!target) return;
    inspectArtifact(Number(target.dataset.index));
  });
  artifactRegions.addEventListener("keydown", event => {
    if (!["Enter", " "].includes(event.key)) return;
    const target = event.target.closest(".artifact-target");
    if (target) { event.preventDefault(); inspectArtifact(Number(target.dataset.index)); }
  });
  signalMap.addEventListener("click", event => {
    const dot = event.target.closest(".signal-map__dot");
    if (dot) moveToArtifact(Number(dot.dataset.index));
  });

  addEventListener("wheel", event => {
    if (game.dataset.mode === "artifact") return;
    event.preventDefault();
    if (holdInputUntilQuiet()) return;
    const vertical = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
    const horizontal = event.deltaX * (event.deltaMode === 1 ? 16 : 1);
    if (game.dataset.mode === "hub") {
      if (Math.abs(horizontal) > Math.abs(vertical) * .75) {
        if (Math.abs(horizontal) > 12) selectRelativeYear(horizontal > 0 ? 1 : -1);
        return;
      }
      hubWheel += vertical;
      const now = performance.now();
      if (Math.abs(hubWheel) >= 72 && now - lastHubMove > 360) {
        const direction = hubWheel > 0 ? 1 : -1;
        hubWheel = 0;
        lastHubMove = now;
        leaveHub(direction);
      }
      return;
    }
    const amount = clamp(vertical * .0065, -1.5, 1.5);
    if (game.dataset.mode === "landing") {
      if (amount > 0 && !entryMotionRequested) {
        entryMotionRequested = true;
        latchNavigationInput();
        beginDescent().then(() => navigateBy(Math.max(.42, amount)));
      }
    } else navigateBy(amount);
  }, { passive: false });

  addEventListener("keydown", event => {
    if (event.key === "Tab" && game.dataset.mode === "artifact") {
      const focusable = [$("artifactClose"), artifactLink];
      if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable[1].focus(); }
      else if (!event.shiftKey && document.activeElement === focusable[1]) { event.preventDefault(); focusable[0].focus(); }
    }
    if (event.key === "Enter" && game.dataset.mode === "landing") beginDescent();
    if (!manualInputReady && ["KeyW", "KeyS", "ArrowUp", "ArrowDown"].includes(event.code)) {
      event.preventDefault();
      return;
    }
    if (game.dataset.mode === "hub") {
      if (["ArrowLeft", "KeyA"].includes(event.code)) { event.preventDefault(); selectRelativeYear(-1, true); }
      else if (["ArrowRight", "KeyD"].includes(event.code)) { event.preventDefault(); selectRelativeYear(1, true); }
      else if (event.key === "Enter") { event.preventDefault(); enterYear(selections[currentEra]); }
      else if (["ArrowDown", "KeyW"].includes(event.code)) { event.preventDefault(); leaveHub(1); }
      else if (["ArrowUp", "KeyS", "Escape"].includes(event.code)) { event.preventDefault(); leaveHub(-1); }
      else if (/^Digit[1-4]$/.test(event.code)) {
        const year = ERAS[currentEra].years[Number(event.code.slice(-1)) - 1];
        if (year) { event.preventDefault(); updateYearSelection(year, true); }
      }
      return;
    }
    if (game.dataset.mode === "chamber" && /^Digit[1-9]$/.test(event.code)) moveToArtifact(Number(event.code.slice(-1)) - 1);
    if (["KeyW", "KeyS", "ArrowUp", "ArrowDown"].includes(event.code) && game.dataset.mode !== "artifact") {
      event.preventDefault();
      heldKeys.add(event.code);
      if (!event.repeat) {
        const direction = ["KeyW", "ArrowDown"].includes(event.code) ? 1 : -1;
        if (game.dataset.mode === "landing" && direction > 0 && !entryMotionRequested) {
          entryMotionRequested = true;
          latchNavigationInput();
          beginDescent().then(() => navigateBy(.36));
        }
        else navigateBy(direction * .36);
      }
    }
    if (game.dataset.mode === "chamber" && event.code === "KeyE") {
      if (visibleArtifacts.some(item => item.index === nearestArtifact)) inspectArtifact(nearestArtifact); else moveToArtifact(nearestArtifact);
    }
    if (event.key === "Escape" && game.dataset.mode === "artifact") closeArtifact();
    else if (event.key === "Escape" && ["chamber", "route"].includes(game.dataset.mode)) returnToHub();
    if (event.key.toLowerCase() === "f" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) $("fullscreenButton").click();
  });

  addEventListener("keyup", event => heldKeys.delete(event.code));
  addEventListener("blur", () => heldKeys.clear());
  let lastKeyFrame = performance.now();
  function keyboardLoop(now) {
    const elapsed = Math.min(.05, (now - lastKeyFrame) / 1000);
    lastKeyFrame = now;
    const forward = heldKeys.has("KeyW") || heldKeys.has("ArrowDown");
    const backward = heldKeys.has("KeyS") || heldKeys.has("ArrowUp");
    if (forward !== backward && !transitioning && manualInputReady) navigateBy((forward ? 1 : -1) * elapsed * 2.9);
    requestAnimationFrame(keyboardLoop);
  }
  requestAnimationFrame(keyboardLoop);

  game.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse" || event.target.closest("button, a, .artifact-target")) return;
    if (!["spine", "hub", "route", "chamber"].includes(game.dataset.mode)) return;
    pointerId = event.pointerId;
    pointerY = event.clientY;
    pointerStartX = pointerCurrentX = event.clientX;
    pointerStartY = pointerCurrentY = event.clientY;
    game.setPointerCapture?.(pointerId);
  });
  game.addEventListener("pointermove", event => {
    if (pointerId !== event.pointerId || pointerY === null) return;
    if (holdInputUntilQuiet()) return;
    pointerCurrentX = event.clientX;
    pointerCurrentY = event.clientY;
    if (game.dataset.mode === "hub") return;
    const delta = (pointerY - event.clientY) * .018;
    pointerY = event.clientY;
    navigateBy(clamp(delta, -.8, .8));
  });
  const releasePointer = event => {
    if (event.pointerId !== pointerId) return;
    if (game.dataset.mode === "hub" && pointerStartX !== null && pointerStartY !== null) {
      const dx = (pointerCurrentX ?? event.clientX) - pointerStartX;
      const dy = (pointerCurrentY ?? event.clientY) - pointerStartY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 42) selectRelativeYear(dx < 0 ? 1 : -1);
      else if (Math.abs(dy) > 52) leaveHub(dy < 0 ? 1 : -1);
    }
    pointerId = null;
    pointerY = null;
    pointerStartX = pointerStartY = pointerCurrentX = pointerCurrentY = null;
  };
  game.addEventListener("pointerup", releasePointer);
  game.addEventListener("pointercancel", releasePointer);

  addEventListener("pointermove", event => {
    if (!["landing", "hub", "chamber"].includes(game.dataset.mode)) return;
    game.style.setProperty("--look-x", `${((event.clientX / innerWidth) - .5) * -10}px`);
    game.style.setProperty("--look-y", `${((event.clientY / innerHeight) - .5) * -7}px`);
  }, { passive: true });

  regionsReady = window.ARCHIVE_REGIONS
    ? Promise.resolve()
    : fetch("assets/archive-below/segmentation/artifact-regions-graph.json?v=notes-10", { cache: "no-store" })
      .then(response => response.ok ? response.json() : Promise.reject(new Error("Segmentation map unavailable")))
      .then(data => { regions = data; })
      .catch(() => { regions = {}; });
  preload("approach");
  setLoading("Mapping the archive", false);

  window.__ARCHIVE_DEBUG__ = {
    get state() {
      return {
        mode: game.dataset.mode, key: activeKey, era: currentEra, year: activeYear, desiredTime,
        currentTime: activeVideo?.currentTime ?? null, duration: activeVideo?.duration ?? null,
        tracks: artifactRegions.querySelectorAll(".artifact-target").length,
        visibleRegions: visibleArtifacts.length, inputReady: manualInputReady,
        mediaCount: media.size, loaded: [...loadedKeys]
      };
    },
    moveBy: navigateBy,
    enterYear,
    enterHub: activateHub,
    leaveHub
  };
})();
