(() => {
  'use strict';

  const player = document.querySelector('[data-nexo-player]');
  if (!player) return;
  const videos = Array.from(player.querySelectorAll('video'));
  const base = new URL('../nexo/', document.currentScript.src);
  const clips = ['b2c5be05', '7c12073f', '68846d34'].map(id =>
    new URL(`gemini_generated_video_${id}.mp4`, base).href);
  const fadeMs = 500;
  let active = videos[0];
  let standby = videos[1];
  let index = 0;
  let started = false;
  let switching = false;
  let retryTimer;

  videos.forEach(video => { video.muted = true; video.defaultMuted = true; });

  function prepareNext() {
    // Load only the next clip, after the current one has started rendering.
    standby.preload = 'auto';
    standby.src = clips[(index + 1) % clips.length];
    standby.load();
  }

  function firstFrame(video) {
    // Wait for an actual decoded frame, not just metadata, before covering the old clip.
    return new Promise(resolve => {
      if ('requestVideoFrameCallback' in video) video.requestVideoFrameCallback(resolve);
      else requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
  }

  function retry() {
    clearTimeout(retryTimer);
    retryTimer = setTimeout(() => {
      if (document.hidden) return;
      if (standby.error) standby.load();
      switchClip();
    }, 3000);
  }

  async function switchClip() {
    if (switching || !started || document.hidden) return;
    if (standby.readyState < 2) { retry(); return; }
    switching = true;
    clearTimeout(retryTimer);
    const incoming = standby;
    const outgoing = active;
    try {
      const frame = firstFrame(incoming);
      await incoming.play();
      await frame;
      // Keep the outgoing layer fully opaque under the entire crossfade.
      incoming.style.zIndex = '2';
      outgoing.style.zIndex = '1';
      const fade = incoming.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: fadeMs, easing: 'ease-in-out', fill: 'forwards'
      });
      await fade.finished;
      incoming.style.opacity = '1';
      fade.cancel();
      outgoing.style.opacity = '0';
      outgoing.pause();
      active = incoming;
      standby = outgoing;
      index = (index + 1) % clips.length;
      switching = false;
      prepareNext();
    } catch (error) {
      // Autoplay restrictions or temporary network failures retain the last good frame.
      incoming.pause();
      switching = false;
      retry();
    }
  }

  videos.forEach(video => {
    video.addEventListener('playing', async () => {
      if (started || video !== active) return;
      started = true;
      await firstFrame(video);
      video.style.opacity = '1';
      video.style.zIndex = '1';
      prepareNext();
    });
    video.addEventListener('timeupdate', () => {
      if (video === active && video.duration - video.currentTime <= .7) switchClip();
    });
    video.addEventListener('ended', () => { if (video === active) switchClip(); });
    video.addEventListener('canplay', () => {
      if (video === standby && active.ended) switchClip();
    });
  });

  function resume() {
    if (document.hidden) return;
    if (switching) {
      // Resume a pending first frame if the tab was hidden during a handoff.
      standby.play().catch(() => {});
      return;
    }
    if (active.ended) switchClip();
    else active.play().catch(() => {});
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimeout(retryTimer);
      videos.forEach(video => video.pause());
    } else resume();
  });
  // A normal interaction can resume playback if the browser initially blocks autoplay.
  document.addEventListener('pointerdown', resume, { passive: true });
  document.addEventListener('keydown', resume);
  resume();
})();
