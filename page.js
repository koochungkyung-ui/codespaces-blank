/* about.html · privacy.html 공용: 언어 선택과 다크모드 (앱과 같은 저장 값 사용) */
(function () {
  var LANGS = ['ko', 'en', 'zh', 'ja'];

  function load(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  function detectLanguage() {
    var saved = load('app-lang');
    if (LANGS.indexOf(saved) >= 0) return saved;
    var nav = (navigator.language || 'ko').toLowerCase();
    if (nav.indexOf('ko') === 0) return 'ko';
    if (nav.indexOf('zh') === 0) return 'zh';
    if (nav.indexOf('ja') === 0) return 'ja';
    return 'en';
  }

  var buttons = document.querySelectorAll('.lang-btn');

  function applyLanguage(lang) {
    var root = document.documentElement;
    root.lang = lang;
    root.setAttribute('data-lang', lang);
    var block = document.querySelector('.lang-block[lang="' + lang + '"]');
    if (block && block.getAttribute('data-title')) document.title = block.getAttribute('data-title');
    for (var i = 0; i < buttons.length; i++) {
      var active = buttons[i].getAttribute('data-lang') === lang;
      buttons[i].classList.toggle('active', active);
      buttons[i].setAttribute('aria-pressed', active ? 'true' : 'false');
    }
  }

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function () {
      var lang = this.getAttribute('data-lang');
      save('app-lang', lang);
      applyLanguage(lang);
    });
  }

  var savedTheme = load('app-theme');
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) document.body.classList.add('dark');

  applyLanguage(detectLanguage());
})();
