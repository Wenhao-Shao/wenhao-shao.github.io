(function () {
  function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;');
  }

  function renderCarousel(mount, items) {
    if (items.length === 0) return;

    var dotsHtml = items.map(function (_, i) {
      return '<button class="news-card__dot' + (i === 0 ? ' active' : '') + '" data-index="' + i + '" aria-label="Show story ' + (i + 1) + '"></button>';
    }).join('');

    mount.innerHTML = items.map(function (item, index) {
      var tag = item.tag ? '<span class="news-card__tag text-label">' + item.tag + '</span>' : '';
      return '' +
        '<div class="news-card' + (index === 0 ? ' active' : '') + '" data-index="' + index + '">' +
          '<div class="news-card__media">' +
            '<img src="' + item.image + '" alt="' + escapeAttr(item.title) + '">' +
            '<div class="news-card__dots">' + dotsHtml + '</div>' +
          '</div>' +
          '<div class="news-card__body">' +
            tag +
            '<h3 class="news-card__title">' + item.title + '</h3>' +
            '<p class="news-card__excerpt text-muted">' + (item.excerpt || '') + '</p>' +
            '<a class="link-arrow" href="' + item.link + '" target="_blank" rel="noopener">Read more &rarr;</a>' +
          '</div>' +
        '</div>';
    }).join('');

    if (items.length < 2) return;

    var current = 0;
    var cards = mount.querySelectorAll('.news-card');
    var timer;

    function updateDots(index) {
      var dots = mount.querySelectorAll('.news-card__dot');
      dots.forEach(function (dot) {
        dot.classList.toggle('active', Number(dot.getAttribute('data-index')) === index);
      });
    }

    function show(index) {
      cards[current].classList.remove('active');
      current = index;
      cards[current].classList.add('active');
      updateDots(current);
    }

    function next() {
      show((current + 1) % items.length);
    }

    function start() {
      timer = setInterval(next, 5000);
    }

    function stop() {
      clearInterval(timer);
    }

    mount.querySelectorAll('.news-card__dot').forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-index')));
        stop();
        start();
      });
    });

    mount.addEventListener('mouseenter', stop);
    mount.addEventListener('mouseleave', start);
    mount.addEventListener('focusin', stop);
    mount.addEventListener('focusout', start);
    mount.addEventListener('touchstart', function () { stop(); start(); }, { passive: true });

    start();
  }

  function renderMoreList(mount, items) {
    mount.innerHTML = items.map(function (item) {
      return '' +
        '<li><a href="/news/">' +
          '<span class="news-list__date text-muted">' + item.date + '</span>' +
          '<span class="news-list__title">' + item.title + '</span>' +
        '</a></li>';
    }).join('');
  }

  function renderFeaturedNews() {
    var featuredMount = document.getElementById('news-featured');
    var moreMount = document.getElementById('news-more-list');
    if (!featuredMount && !moreMount) return;

    fetch('/data/news.json')
      .then(function (res) { return res.json(); })
      .then(function (items) {
        if (featuredMount) {
          renderCarousel(featuredMount, items.filter(function (n) { return n.featured === 'large'; }));
        }
        if (moreMount) {
          renderMoreList(moreMount, items.filter(function (n) { return n.featured === 'small'; }));
        }
      })
      .catch(function (err) {
        console.error('Failed to load news:', err);
      });
  }

  function renderNewsList() {
    var mount = document.getElementById('news-feed');
    if (!mount) return;

    fetch('/data/news.json')
      .then(function (res) { return res.json(); })
      .then(function (items) {
        mount.innerHTML = items.map(function (item) {
          return '' +
            '<li class="news-feed__item">' +
              '<div class="news-feed__media"><img src="' + item.image + '" alt="' + escapeAttr(item.title) + '"></div>' +
              '<div class="news-feed__body">' +
                '<span class="news-feed__date text-muted">' + item.date + '</span>' +
                '<h2>' + item.title + '</h2>' +
                '<div class="news-feed__content">' + item.body + '</div>' +
              '</div>' +
            '</li>';
        }).join('');
      })
      .catch(function (err) {
        console.error('Failed to load news:', err);
      });
  }

  renderFeaturedNews();
  renderNewsList();
})();