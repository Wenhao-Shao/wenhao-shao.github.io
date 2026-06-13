(function () {
  function setActiveLink(link) {
    var href = link.getAttribute('href');
    var path = window.location.pathname;
    if (path === href || (href !== '/' && path.indexOf(href) === 0)) {
      link.classList.add('active');
    }
  }

  function loadNav() {
    var mount = document.getElementById('site-nav');
    if (!mount) return;

    fetch('/assets/partials/nav.html')
      .then(function (res) { return res.text(); })
      .then(function (html) {
        mount.outerHTML = html;
        return fetch('/data/nav.json');
      })
      .then(function (res) { return res.json(); })
      .then(function (links) {
        var list = document.getElementById('site-nav-links');
        if (!list) return;

        links.forEach(function (item) {
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = item.href;
          a.textContent = item.label;
          setActiveLink(a);
          li.appendChild(a);
          list.appendChild(li);
        });

        var themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
          themeToggle.addEventListener('click', window.toggleTheme);
        }

        var navToggle = document.getElementById('nav-toggle');
        if (navToggle) {
          navToggle.addEventListener('click', function () {
            list.classList.toggle('open');
          });
        }
      })
      .catch(function (err) {
        console.error('Failed to load navigation:', err);
      });
  }

  function loadFooter() {
    var mount = document.getElementById('site-footer');
    if (!mount) return;

    fetch('/assets/partials/footer.html')
      .then(function (res) { return res.text(); })
      .then(function (html) {
        mount.outerHTML = html;

        var openBtn = document.getElementById('open-message-modal');
        var closeBtn = document.getElementById('close-message-modal');
        var modal = document.getElementById('message-modal');
        if (!openBtn || !closeBtn || !modal) return;

        openBtn.addEventListener('click', function (e) {
          e.preventDefault();
          modal.style.display = 'flex';
        });
        closeBtn.addEventListener('click', function () {
          modal.style.display = 'none';
        });
        modal.addEventListener('click', function (e) {
          if (e.target === modal) modal.style.display = 'none';
        });
      })
      .catch(function (err) {
        console.error('Failed to load footer:', err);
      });
  }

  loadNav();
  loadFooter();
})();
