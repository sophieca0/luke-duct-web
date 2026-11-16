/* ---- Google Ads conversions ----
   The Google tag (gtag.js) itself is loaded in each page's <head> (see build.js, CONFIG.adsId).
   Labels come from Google Ads (Goals > Conversions). Set id to "" to stop sending conversions. */
var ADS = {
  id: '',   /* Google Ads not running: no conversions sent. Restore 'AW-18563134906' to switch back on. */
  formLabel: 'fWxMCKjOiLUdELrry5NF',   /* "Submit lead form (2)" conversion */
  callLabel: 'l4fMCPbvwrcdELrry5NF'    /* "Website phone click" conversion: calls, SMS and WhatsApp */
};

/* Google Analytics 4: custom events for what visitors click (sent to GA4 only, never to Ads). */
var GA4 = 'G-7BVN9K5DFZ';
function track(name, params) {
  try {
    if (GA4 && typeof window.gtag === 'function') {
      var p = params || {}; p.send_to = GA4;
      window.gtag('event', name, p);
    }
  } catch (err) {}
}

function adsConvert(label) {
  try {
    if (ADS.id && label && typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', { send_to: ADS.id + '/' + label });
    }
  } catch (err) {}
}

/* Every call, SMS or WhatsApp link, including ones added later. The click is only
   recorded: the browser still opens the phone, messages or WhatsApp as normal. */
(function () {
  if (!ADS.id) return;
  var CONTACT_LINKS = 'a[href^="tel:"], a[href^="sms:"], a[href*="wa.me/"], a[href*="api.whatsapp.com/"], a[href^="whatsapp:"]';
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest(CONTACT_LINKS) : null;
    if (a) adsConvert(ADS.callLabel);
  });
})();

(function () {
  var saved = null;
  try { saved = localStorage.getItem('ld-motion'); } catch (e) {}

  document.querySelectorAll('.pg[data-site]').forEach(function (pg) {
    var S = {};
    try { S = JSON.parse(pg.getAttribute('data-site')); } catch (e) {}

    /* ---- pause / play animation (remembered per visitor) ---- */
    var btn = pg.querySelector('.js-motion');
    function setMotion(off) {
      pg.classList.toggle('motion-off', off);
      var label = off ? S.play : S.pause;
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    }
    if (saved === 'off') setMotion(true);
    btn.addEventListener('click', function () {
      var off = !pg.classList.contains('motion-off');
      setMotion(off);
      try { localStorage.setItem('ld-motion', off ? 'off' : 'on'); } catch (e) {}
    });

    /* ---- enquiry forms ---- */
    function notice(form, cls, text, withPhone) {
      var n = form.parentNode.querySelector('.notice');
      n.className = 'notice' + (cls ? ' ' + cls : '');
      n.textContent = text + (withPhone ? ' ' : '');
      if (withPhone) {
        var a = document.createElement('a');
        a.href = S.tel;
        a.textContent = S.phone;
        n.appendChild(a);
        n.appendChild(document.createTextNode('.'));
      }
      n.hidden = false;
    }

    function smsBody(data) {
      var lines = [S.smsHead + ':'];
      Object.keys(S.labels).forEach(function (k) {
        var v = (data.get(k) || '').toString().trim();
        if (v) lines.push(S.labels[k].replace(/\s*\(.*\)$/, '') + ': ' + v);
      });
      return lines.join('\n');
    }

    pg.querySelectorAll('form.js-enquiry').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var data = new FormData(form);
        var get = function (k) { return (data.get(k) || '').toString().trim(); };
        var name = get('name');
        var phone = get('phone');
        var email = get('email');
        var contact = get('contact');           /* hero form: one box for phone or email */
        if (contact) {
          if (contact.indexOf('@') > -1) email = contact; else phone = contact;
          data.delete('contact');
          if (phone) data.set('phone', phone);
          if (email) data.set('email', email);
        }
        var firstContact = form.querySelector('[name=contact],[name=phone]');
        if (!name || (!phone && !email)) {
          notice(form, '', S.required, false);
          (name ? firstContact : form.querySelector('[name=name]')).focus();
          return;
        }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          notice(form, '', S.badEmail, false);
          (form.querySelector('[name=email]') || firstContact).focus();
          return;
        }

        if (!S.key) {
          /* No form service yet: open the SMS app addressed to the business. */
          var sep = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) ? '&' : '?';
          notice(form, 'ok', S.okSms, true);
          window.location.href = S.sms + sep + 'body=' + encodeURIComponent(smsBody(data));
          return;
        }

        var submit = form.querySelector('[type=submit]');
        var oldHtml = submit.innerHTML;
        submit.disabled = true;
        submit.textContent = S.sending;
        data.append('access_key', S.key);
        data.append('subject', S.company + ' website: ' + name + ' (' + (phone || email) + ')');
        data.append('from_name', S.company + ' website');
        fetch('https://api.web3forms.com/submit', { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (r) { return r.json(); })
          .then(function (j) {
            if (!j.success) throw new Error(j.message || 'failed');
            form.reset();
            notice(form, 'ok', S.okSent, false);
            adsConvert(ADS.formLabel);
            track('generate_lead', { form: (form.querySelector('[name=source]') || {}).value || '' });
          })
          .catch(function () { notice(form, '', S.errSend, true); })
          .then(function () { submit.disabled = false; submit.innerHTML = oldHtml; });
      });
    });
  });
})();

/* ---- photo gallery: filter buttons + lightbox ---- */
(function () {
  document.querySelectorAll('.pg').forEach(function (pg) {
    var all = [].slice.call(pg.querySelectorAll('.tilebtn'));
    var visible = function () { return all.filter(function (t) { return !t.closest('.tile').hidden; }); };

    pg.querySelectorAll('.gf').forEach(function (btn, _, btns) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-f');
        btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        pg.querySelectorAll('.tile').forEach(function (li) {
          li.hidden = f !== 'all' && li.getAttribute('data-cat') !== f;
        });
      });
    });

    var dlg = pg.querySelector('dialog.lb');
    if (!dlg || typeof dlg.showModal !== 'function') return;
    var img = dlg.querySelector('.lbimg');
    var list = [], cur = 0, count = dlg.querySelector('.lbcount'), sx = null, sy = 0;
    function show(i) {
      cur = (i + list.length) % list.length;
      img.src = list[cur].getAttribute('data-full');
      img.alt = list[cur].getAttribute('data-alt');
      if (count) count.textContent = (cur + 1) + ' / ' + list.length;
    }
    all.forEach(function (t) {
      t.addEventListener('click', function () { list = visible(); show(list.indexOf(t)); dlg.showModal(); });
    });
    dlg.querySelector('.lbclose').addEventListener('click', function () { dlg.close(); });
    dlg.querySelector('.lbprev').addEventListener('click', function () { show(cur - 1); });
    dlg.querySelector('.lbnext').addEventListener('click', function () { show(cur + 1); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
    dlg.addEventListener('close', function () { if (list[cur]) list[cur].focus(); });
    // swipe left/right on phones to change photo
    dlg.addEventListener('touchstart', function (e) { if (e.touches.length === 1) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; } }, { passive: true });
    dlg.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(cur + (dx < 0 ? 1 : -1));
    }, { passive: true });
  });
})();

/* ---- reveal on scroll: sections and cards rise in as they come into view ---- */
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var sel = '.sec .shead, .tiles .tile, .expect .fc, #system .panel, .dlegend, .tl li, .sec .center, .contact-l, .fcard, .prose';
  var els = [].slice.call(document.querySelectorAll(sel));
  if (!els.length) return;
  document.documentElement.classList.add('js-reveal');
  var groups = new Map();
  els.forEach(function (el) {
    el.classList.add('rv');
    var parent = el.parentElement, i = groups.get(parent) || 0;
    groups.set(parent, i + 1);
    el.style.setProperty('--rd', Math.min(i, 6) * 0.08 + 's');
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  els.forEach(function (el) { io.observe(el); });
  /* safety: never leave anything hidden */
  setTimeout(function () {
    els.forEach(function (el) { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in-view'); });
  }, 2500);
})();

/* ---- chat button: WhatsApp / SMS options ---- */
(function () {
  document.querySelectorAll('.chatfab').forEach(function (fab) {
    var btn = fab.querySelector('.chat-btn'), menu = fab.querySelector('.chat-menu');
    if (!btn || !menu) return;
    function set(open) { menu.hidden = !open; btn.setAttribute('aria-expanded', String(open)); fab.classList.toggle('open', open); }
    btn.addEventListener('click', function (e) { e.stopPropagation(); set(menu.hidden); if (!menu.hidden) { var f = menu.querySelector('a'); if (f) f.focus(); } });
    document.addEventListener('click', function (e) { if (!fab.contains(e.target)) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { set(false); btn.focus(); } });
  });
})();

/* ---- menu: highlight the section currently on screen ---- */
(function () {
  if (!('IntersectionObserver' in window)) return;
  document.querySelectorAll('.pg').forEach(function (pg) {
    var links = [].slice.call(pg.querySelectorAll('.nav a[href^="#"], .nav a[data-spy]'));
    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute('data-spy') || a.getAttribute('href').slice(1);
      var sec = id && pg.querySelector('#' + id);
      if (sec) map[id] = { a: a, sec: sec };
    });
    var ids = Object.keys(map);
    if (!ids.length) return;
    var visible = {};
    function update() {
      var best = null, bestTop = -Infinity;
      ids.forEach(function (id) {
        var top = map[id].sec.getBoundingClientRect().top;
        if (top <= window.innerHeight * 0.35 && top > bestTop) { bestTop = top; best = id; }
      });
      ids.forEach(function (id) {
        var on = id === best;
        map[id].a.classList.toggle('is-active', on);
        if (on) map[id].a.setAttribute('aria-current', 'true'); else map[id].a.removeAttribute('aria-current');
      });
    }
    var io = new IntersectionObserver(function () { update(); }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
    ids.forEach(function (id) { io.observe(map[id].sec); });
    window.addEventListener('scroll', update, { passive: true });
    update();
  });
})();

/* ---- GA4: which buttons, links and photos get used ---- */
(function () {
  if (!GA4) return;
  function where(el) {
    var zones = [['.util', 'contact_bar'], ['.top', 'menu'], ['.hero', 'hero'], ['#work', 'gallery_section'], ['#why', 'why_us'],
      ['#system', 'system'], ['#process', 'process'], ['#contact', 'contact'], ['.foot', 'footer'], ['.chatfab', 'chat'],
      ['.stickybar', 'mobile_bar'], ['.nf-main', 'page_404']];
    for (var i = 0; i < zones.length; i++) if (el.closest(zones[i][0])) return zones[i][1];
    return 'other';
  }
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target : null;
    if (!t) return;
    var el;
    if ((el = t.closest('a[href^="tel:"]'))) return track('contact_click', { method: 'phone', link_location: where(el) });
    if ((el = t.closest('a[href^="sms:"]'))) return track('contact_click', { method: 'sms', link_location: where(el) });
    if ((el = t.closest('a[href*="wa.me/"]'))) return track('contact_click', { method: 'whatsapp', link_location: where(el) });
    if ((el = t.closest('a[href^="mailto:"]'))) return track('contact_click', { method: 'email', link_location: where(el) });
    if ((el = t.closest('.more-link'))) return track('gallery_open', { link_location: 'more_photos_tile' });
    if ((el = t.closest('a[href$="gallery/"], a[href*="gallery/#"]'))) return track('gallery_open', { link_location: where(el) });
    if ((el = t.closest('.tilebtn'))) return track('photo_zoom', { photo: el.getAttribute('data-alt') || '', link_location: where(el) });
    if ((el = t.closest('.lbnext, .lbprev'))) return track('photo_browse', { direction: el.classList.contains('lbnext') ? 'next' : 'previous' });
    if ((el = t.closest('.gf'))) return track('gallery_filter', { filter: el.getAttribute('data-f') || '' });
    if ((el = t.closest('.chat-btn'))) { if (el.getAttribute('aria-expanded') !== 'true') track('chat_open', {}); return; }
    if ((el = t.closest('.lang a'))) return track('language_switch', { to: el.getAttribute('hreflang') || '' });
    if ((el = t.closest('a[href*="#contact"], a.btn-primary'))) return track('call_back_button', { link_location: where(el) });
  }, true);
})();
