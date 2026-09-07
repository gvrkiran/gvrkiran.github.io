(function () {
  'use strict';

  const sections = [
    {
      id: 'about', label: 'About', index: '01 / 05', scale: 'SCALE 10⁻⁶', status: 'SIGNAL STABLE',
      body: 'Assistant Professor at Rutgers studying computational social science, misinformation, AI, and information ecosystems, with a focus on the Global South.',
      tags: ['Computational social science', 'Global South', 'AI'],
      cards: [
        ['POSITION', 'Rutgers University', 'Assistant Professor working at the intersection of computational social science and information ecosystems.'],
        ['FOCUS', 'How information moves', 'Research on misinformation, platforms, AI, and their consequences, especially across the Global South.']
      ]
    },
    {
      id: 'projects', label: 'Projects', index: '02 / 05', scale: 'SCALE 10⁻²', status: 'CASCADE DETECTED',
      body: 'Current projects on AI use and impact, encrypted platforms such as WhatsApp, data donation, polarization, and multimodal media.',
      tags: ['AI use', 'WhatsApp', 'Data donation', 'Multimodal media'],
      cards: [
        ['CURRENT', 'AI use and impact', 'How people adopt AI and how it reshapes work, education, information, and everyday life.'],
        ['PLATFORMS', 'Encrypted networks', 'Measuring information flows on WhatsApp while preserving the privacy and safety of participants.'],
        ['METHODS', 'Data donation', 'Building methods that let people contribute their own platform data to public-interest research.'],
        ['MEDIA', 'Multimodal systems', 'Studying images, video, audio, and text together to understand contemporary media ecosystems.']
      ]
    },
    {
      id: 'publications', label: 'Publications', index: '03 / 05', scale: 'SCALE 10³', status: 'EVIDENCE UNDER LOAD',
      body: 'Publications on data donation, encrypted platforms, misinformation, political polarization, AI use and impact, and multimodal methods.',
      tags: ['Data donation', 'Encrypted platforms', 'Misinformation', 'AI'],
      cards: [
        ['EVIDENCE', 'Data donation', 'Methods and empirical work using participant-contributed platform data.'],
        ['PLATFORMS', 'Encrypted spaces', 'Research on misinformation and behavior in private and encrypted communication environments.'],
        ['SYSTEMS', 'Polarization and AI', 'Studies of political information, media diets, generative AI, and their social consequences.'],
        ['METHODS', 'Multimodal analysis', 'Computational approaches for studying text, images, audio, and video at scale.']
      ]
    },
    {
      id: 'teaching', label: 'Teaching', index: '04 / 05', scale: 'SCALE 10⁶', status: 'METHODS RECOMBINING',
      body: 'Courses and mentoring in computational social science, data analysis, platform research, and responsible AI.',
      tags: ['Courses', 'Mentoring', 'Methods', 'Responsible AI'],
      cards: [
        ['COURSES', 'Computational social science', 'Courses connecting social questions to careful computational measurement and analysis.'],
        ['MENTORING', 'Research practice', 'Training students to ask useful questions, choose defensible methods, and communicate evidence clearly.']
      ]
    },
    {
      id: 'other', label: 'Other', index: '05 / 05', scale: 'SCALE 10⁹', status: 'SYSTEM VISIBLE',
      body: 'Tools, comics, research and career advice, media coverage, and writing.',
      tags: ['Tools', 'Comics', 'Writing', 'Advice'],
      cards: [
        ['TOOLS', 'Research utilities', 'Public-facing prototypes and utilities developed through research.'],
        ['WRITING', 'Beyond papers', 'Comics, advice, public writing, and other ways of sharing ideas.']
      ]
    }
  ];

  const root = document.getElementById('cascade');
  const video = document.getElementById('cascadeVideo');
  const title = document.getElementById('sectionTitle');
  const eyebrow = document.getElementById('sectionEyebrow');
  const body = document.getElementById('sectionBody');
  const tags = document.getElementById('sectionTags');
  const index = document.getElementById('sectionIndex');
  const scale = document.getElementById('scaleLabel');
  const status = document.getElementById('systemStatus');
  const open = document.getElementById('openSection');
  const nav = Array.from(document.querySelectorAll('[data-step]'));
  const railItems = Array.from(document.querySelectorAll('.cascade__rail li'));
  const peel = document.getElementById('peel');
  const peelTitle = document.getElementById('peelTitle');
  const peelKicker = document.getElementById('peelKicker');
  const peelContent = document.getElementById('peelContent');
  const closePeel = document.getElementById('closePeel');
  const beatTimes = [0.05, 0.9, 2.15, 3.2, 4.45];
  let active = -1;
  let closeTimer = null;
  let videoReady = false;
  let videoObjectUrl = null;
  let pendingVideoTime = beatTimes[0];
  let seekFrame = 0;

  function videoTimeForProgress(progress) {
    const position = progress * (beatTimes.length - 1);
    const left = Math.min(beatTimes.length - 1, Math.floor(position));
    const right = Math.min(beatTimes.length - 1, left + 1);
    const mix = position - left;
    return beatTimes[left] + ((beatTimes[right] - beatTimes[left]) * mix);
  }

  function requestVideoFrame(time) {
    pendingVideoTime = time;
    if (!videoReady || video.seeking || seekFrame) return;

    seekFrame = window.requestAnimationFrame(function () {
      seekFrame = 0;
      if (Math.abs(video.currentTime - pendingVideoTime) > 0.012) {
        video.currentTime = pendingVideoTime;
      }
    });
  }

  function renderSection(next) {
    if (next === active) return;
    active = next;
    const section = sections[next];
    title.textContent = section.label;
    eyebrow.textContent = section.label.toUpperCase();
    body.textContent = section.body;
    index.textContent = section.index;
    scale.textContent = section.scale;
    status.textContent = section.status;
    tags.innerHTML = section.tags.map(function (tag) { return '<span>' + tag + '</span>'; }).join('');
    open.querySelector('span').textContent = 'Open ' + section.label;
    nav.forEach(function (item) { item.classList.toggle('is-active', Number(item.dataset.step) === next); });
    railItems.forEach(function (item, itemIndex) { item.classList.toggle('is-active', itemIndex === next); });
  }

  function update() {
    const max = Math.max(1, root.offsetHeight - window.innerHeight);
    const progress = Math.max(0, Math.min(1, -root.getBoundingClientRect().top / max));
    const fault = Math.max(0, Math.min(1, (progress - .31) / .36));
    root.style.setProperty('--progress', progress.toFixed(4));
    root.style.setProperty('--fault', fault.toFixed(4));
    renderSection(Math.min(4, Math.round(progress * 4)));
    requestVideoFrame(videoTimeForProgress(progress));
  }

  function seekTo(step) {
    const max = root.offsetHeight - window.innerHeight;
    window.scrollTo({ top: root.offsetTop + (step / 4) * max, behavior: 'smooth' });
  }

  nav.forEach(function (item) {
    item.addEventListener('click', function (event) {
      event.preventDefault();
      seekTo(Number(item.dataset.step));
    });
  });

  function openPeel() {
    const section = sections[active];
    window.clearTimeout(closeTimer);
    peelTitle.textContent = section.label;
    peelKicker.textContent = section.index + ' · SELECTED STRATUM';
    peelContent.innerHTML = section.cards.map(function (card) {
      return '<article class="peel__card"><small>' + card[0] + '</small><h2>' + card[1] + '</h2><p>' + card[2] + '</p></article>';
    }).join('');
    peel.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    void peel.offsetWidth;
    peel.classList.add('is-open');
    closePeel.focus();
  }

  function close() {
    peel.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    closeTimer = window.setTimeout(function () { peel.hidden = true; open.focus(); }, 900);
  }

  open.addEventListener('click', openPeel);
  closePeel.addEventListener('click', close);
  peel.querySelector('.peel__backdrop').addEventListener('click', close);
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !peel.hidden) close(); });
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  if (video) {
    video.addEventListener('loadedmetadata', function () {
      video.pause();
      videoReady = true;
      update();
    });
    video.addEventListener('seeked', function () {
      requestVideoFrame(pendingVideoTime);
    });
    video.addEventListener('play', function () { video.pause(); });

    fetch(video.dataset.src)
      .then(function (response) {
        if (!response.ok) throw new Error('Could not load motion sequence');
        return response.blob();
      })
      .then(function (blob) {
        videoObjectUrl = URL.createObjectURL(blob);
        video.src = videoObjectUrl;
        video.load();
      })
      .catch(function () {
        video.src = video.dataset.src;
        video.load();
      });

    window.addEventListener('beforeunload', function () {
      if (videoObjectUrl) URL.revokeObjectURL(videoObjectUrl);
    });
  }
  renderSection(0);
  update();
})();
