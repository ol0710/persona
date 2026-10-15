(function () {
  var root = document.documentElement;

  /* ---------- тема ---------- */
  var toggle = document.querySelector('.theme-toggle');
  function paintToggle() {
    if (toggle) toggle.setAttribute('aria-pressed', root.dataset.theme === 'dark');
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      paintToggle();
    });
  }
  paintToggle();

  /* ---------- мобильное меню ---------- */
  var nav = document.querySelector('.site-nav');
  var burger = document.querySelector('.burger');
  if (nav && burger) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
  }

  /* ---------- декоративные «жуки» ---------- */
  var bugs = [
    [13, 3, 28, -25, '#e0833b', 0], [18, 93, 24, 40, '#2f7d6d', 1],
    [27, 6, 22, 70, '#7a4a2b', 0], [34, 90, 30, -50, '#e0833b', 1],
    [41, 2, 26, 15, '#2f7d6d', 0], [47, 95, 22, 120, '#7a4a2b', 1],
    [54, 5, 30, -70, '#e0833b', 0], [61, 92, 26, 25, '#2f7d6d', 1],
    [69, 3, 22, 95, '#7a4a2b', 0], [76, 94, 28, -35, '#e0833b', 1],
    [84, 7, 24, 55, '#2f7d6d', 0], [90, 90, 26, -110, '#7a4a2b', 1]
  ];
  var NS = 'http://www.w3.org/2000/svg';
  var holder = document.createElement('div');
  holder.className = 'bugs';
  holder.setAttribute('aria-hidden', 'true');
  var sym = '<svg width="0" height="0" style="position:absolute"><symbol id="bug" viewBox="0 0 60 70">' +
    '<g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M23 15 Q19 7 12 5 M37 15 Q41 7 48 5"/>' +
    '<path d="M15 28 L4 22 M14 42 L2 42 M16 56 L5 64 M45 28 L56 22 M46 42 L58 42 M44 56 L55 64"/>' +
    '<path d="M22 22 Q30 14 38 22 L40 45 Q40 62 30 64 Q20 62 20 45 Z" fill="currentColor" fill-opacity=".25"/>' +
    '<path d="M21 36 H39 M21 48 H39 M30 26 V64"/></g></symbol></svg>';
  holder.innerHTML = sym;
  bugs.forEach(function (b) {
    var s = document.createElementNS(NS, 'svg');
    s.setAttribute('class', 'deco' + (b[5] ? ' deco-extra' : ''));
    s.setAttribute('viewBox', '0 0 60 70');
    s.setAttribute('style', 'top:' + b[0] + '%;left:' + b[1] + '%;width:' + b[2] + 'px;height:' +
      Math.round(b[2] * 7 / 6) + 'px;transform:rotate(' + b[3] + 'deg);color:' + b[4]);
    var u = document.createElementNS(NS, 'use');
    u.setAttribute('href', '#bug');
    s.appendChild(u);
    holder.appendChild(s);
  });
  document.body.insertBefore(holder, document.body.firstChild);

  /* ---------- лупа в hero ---------- */
  var heroText = document.querySelector('.hero-text');
  var lens = document.querySelector('.lens-hit');
  if (heroText && lens) {
    function zoom(on) {
      heroText.classList.toggle('zoomed', on);
      lens.setAttribute('aria-pressed', on);
    }
    lens.addEventListener('pointerenter', function (e) {
      if (e.pointerType === 'mouse') zoom(true);
    });
    lens.addEventListener('pointerleave', function (e) {
      if (e.pointerType === 'mouse') zoom(false);
    });
    lens.addEventListener('click', function (e) {
      // мышь управляется наведением; клик и тап переключают
      if (e.detail === 0 || e.pointerType !== 'mouse') zoom(!heroText.classList.contains('zoomed'));
    });
    lens.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        zoom(!heroText.classList.contains('zoomed'));
      }
    });
  }

  /* ---------- «правда или миф» ---------- */
  var quiz = document.getElementById('quiz');
  if (quiz) {
    var items = Array.prototype.slice.call(quiz.querySelectorAll('.q'));
    var scoreEl = document.querySelector('.score');
    var msgEl = document.querySelector('.score-msg');
    var reset = document.querySelector('.quiz-reset');
    var answered = 0, right = 0;

    function paint() {
      scoreEl.textContent = 'Угадано: ' + right + ' из ' + items.length;
      if (answered === items.length) {
        msgEl.textContent = right === items.length ? 'Тест пройден без единого бага. Ты знаешь обо мне всё!' :
          right >= items.length / 2 ? 'Тест пройден, но есть замечания. Зато теперь знаешь обо мне больше.' :
          'Тест не пройден, но это не критично. Перепройди, я не расскажу.';
        reset.hidden = false;
      } else {
        msgEl.textContent = '';
        reset.hidden = true;
      }
    }

    items.forEach(function (q) {
      q.querySelectorAll('button').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (q.classList.contains('done')) return;
          var guess = btn.dataset.guess === 'true';
          var ok = guess === (q.dataset.answer === 'true');
          q.classList.add('done', ok ? 'right' : 'wrong');
          btn.classList.add('picked');
          answered++; if (ok) right++;
          paint();
        });
      });
    });

    reset.addEventListener('click', function () {
      answered = 0; right = 0;
      items.forEach(function (q) {
        q.classList.remove('done', 'right', 'wrong');
        q.querySelectorAll('button').forEach(function (b) { b.classList.remove('picked'); });
      });
      paint();
      quiz.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    paint();
  }
})();
