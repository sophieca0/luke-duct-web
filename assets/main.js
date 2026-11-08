(function () {
  var S = window.SITE || {};
  var pg = document.querySelector('.pg');

  /* ---- pause / play animation (remembered per visitor) ---- */
  var btn = document.getElementById('motion');
  function setMotion(off) {
    pg.classList.toggle('motion-off', off);
    var label = off ? S.play : S.pause;
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  }
  var saved = null;
  try { saved = localStorage.getItem('ld-motion'); } catch (e) {}
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

  document.querySelectorAll('form.js-enquiry').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get('name') || '').toString().trim();
      var phone = (data.get('phone') || '').toString().trim();
      if (!name || !phone) {
        notice(form, '', S.required, false);
        (name ? form.querySelector('[name=phone]') : form.querySelector('[name=name]')).focus();
        return;
      }

      if (!S.key) {
        /* No form service yet: open the SMS app addressed to the business. */
        var sep = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) ? '&' : '?';
        window.location.href = S.sms + sep + 'body=' + encodeURIComponent(smsBody(data));
        notice(form, 'ok', S.okSms, true);
        return;
      }

      var submit = form.querySelector('[type=submit]');
      var oldHtml = submit.innerHTML;
      submit.disabled = true;
      submit.textContent = S.sending;
      data.append('access_key', S.key);
      data.append('subject', S.company + ' website: ' + name + ' (' + phone + ')');
      data.append('from_name', S.company + ' website');
      fetch('https://api.web3forms.com/submit', { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (!j.success) throw new Error(j.message || 'failed');
          form.reset();
          notice(form, 'ok', S.okSent, false);
        })
        .catch(function () { notice(form, '', S.errSend, true); })
        .then(function () { submit.disabled = false; submit.innerHTML = oldHtml; });
    });
  });
})();
