//  Slider JS (only needed for filter tabs + arrows; move to your main js file if you prefer)


    (function () {
      var root = document.getElementById('smFeatured');
      if (!root) return;
      var track = root.querySelector('.sm-feat-track');
      var items = [].slice.call(track.querySelectorAll('.sm-feat-item'));
      var empty = root.querySelector('.sm-feat-empty');
      var filters = [].slice.call(root.querySelectorAll('.sm-filter'));
 
      // Filter cards by data-type
      filters.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var f = btn.getAttribute('data-filter'), shown = 0;
          filters.forEach(function (b) { b.classList.toggle('active', b === btn); });
          items.forEach(function (it) {
            var show = f === 'all' || it.getAttribute('data-type') === f;
            it.classList.toggle('d-none', !show);
            if (show) shown++;
          });
          empty.classList.toggle('d-none', shown > 0);
          track.scrollTo({ left: 0 });
          updateArrows(); // list length changed, so re-check arrow state
        });
      });
 
      // Prev / next arrows scroll the track by 80% of its width
      var prev = root.querySelector('.sm-feat-prev');
      var next = root.querySelector('.sm-feat-next');
      function scrollTrack(dir) { track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: 'smooth' }); }
      prev.addEventListener('click', function () { scrollTrack(-1); });
      next.addEventListener('click', function () { scrollTrack(1); });
 
      // Disable an arrow when there is nothing more to scroll in that direction
      function updateArrows() {
        var max = track.scrollWidth - track.clientWidth - 2;
        prev.classList.toggle('is-disabled', track.scrollLeft <= 2);
        next.classList.toggle('is-disabled', track.scrollLeft >= max);
      }
      track.addEventListener('scroll', updateArrows, { passive: true });
      window.addEventListener('resize', updateArrows);
      updateArrows();
    })();


    /* Generic slider arrows: works for every .sm-slider on the page (include once before </body>) */
(function () {
  document.querySelectorAll('.sm-slider').forEach(function (slider) {
    var track = slider.querySelector('.sm-slider-track');
    var prev = slider.querySelector('.sm-slider-prev');
    var next = slider.querySelector('.sm-slider-next');
    if (!track) return;

    // Scroll by 80% of the visible width
    function go(dir) { track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: 'smooth' }); }

    // Dim the arrow when there is nothing more to scroll in that direction
    function update() {
      var max = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.classList.toggle('is-disabled', track.scrollLeft <= 2);
      if (next) next.classList.toggle('is-disabled', track.scrollLeft >= max);
    }

    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
})();



// animation

/* Scroll reveal: simple, professional fade/slide-in for the sections below the hero.
   - No HTML changes needed: targets are picked by selector, so backend-looped items are covered too.
   - Hero section is intentionally NOT in the list.
   - Add this file before </body> (after home.js), or paste inside home.js. */
(function () {
  'use strict';

  if (!('IntersectionObserver' in window)) return;                              // old browsers: show everything
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;    // reduced motion: show everything

  // [selector, variant, stagger?]  variant: '' (up) | left | right | zoom | fade
  var groups = [
    // Explore Categories
    ['.sm-categories .text-center', '', false],
    ['.sm-cat-grid .col', '', true],

    // Featured Finds
    ['.sm-featured .container-fluid > .d-flex', '', false],
    ['.sm-feat-wrap', '', false],

    // Sell / Exchange CTA
    ['.sm-cta', 'zoom', false],

    // How It Works
    ['.sm-how .container-fluid > .d-flex', '', false],
    ['.sm-how .row > .col', '', true],

    // About Solve Monkey
    ['.sm-about .row > .col-lg-6:first-child', 'left', false],
    ['.sm-about .row > .col-lg-6:last-child', 'right', false],

    // I want to buy / sell / exchange
    ['.sm-get .row > .col', '', true],

    // Find Your Next Exchange + Fresh on Solve Monkey
    ['.sm-exch .container-fluid > .d-flex', '', false],
    ['.sm-exch .sm-slider', '', false],
    ['.sm-fresh .container-fluid > .d-flex', '', false],
    ['.sm-fresh .sm-slider', '', false],

    // Footer
    ['.sm-footer .row > div', '', true],
    ['.sm-footer-bottom', 'fade', false]
  ];

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);                       // animate once
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  groups.forEach(function (g) {
    document.querySelectorAll(g[0]).forEach(function (el, i) {
      el.classList.add('sm-reveal');
      if (g[1]) el.classList.add('sm-reveal--' + g[1]);
      if (g[2]) el.style.setProperty('--sm-d', ((i % 4) * 90) + 'ms');   // light stagger, max ~270ms
      io.observe(el);
    });
  });
})();
