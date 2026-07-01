(function () {
  function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;');
  }

  function ensureLightbox() {
    var lb = document.getElementById('image-lightbox');
    if (lb) return lb;

    lb = document.createElement('div');
    lb.id = 'image-lightbox';
    lb.className = 'image-lightbox';
    lb.style.display = 'none';
    lb.innerHTML =
      '<button type="button" class="image-lightbox__close" aria-label="Close">&times;</button>' +
      '<img class="image-lightbox__img" src="" alt="">';
    document.body.appendChild(lb);

    function close() {
      lb.style.display = 'none';
      lb.querySelector('.image-lightbox__img').src = '';
    }

    lb.querySelector('.image-lightbox__close').addEventListener('click', close);
    lb.addEventListener('click', function (e) {
      if (e.target === lb) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    return lb;
  }

  function openLightbox(src, alt) {
    var lb = ensureLightbox();
    var img = lb.querySelector('.image-lightbox__img');
    img.src = src;
    img.alt = alt || '';
    lb.style.display = 'flex';
  }

  function wireLightbox(mount) {
    mount.querySelectorAll('img').forEach(function (img) {
      img.addEventListener('click', function () {
        openLightbox(img.src, img.alt);
      });
    });
  }

  function renderCarousel(mount, items) {
    if (items.length === 0) return;

    var dotsHtml = items.map(function (_, i) {
      return '<button class="news-card__dot' + (i === 0 ? ' active' : '') + '" data-index="' + i + '" aria-label="Show story ' + (i + 1) + '"></button>';
    }).join('');

    mount.innerHTML = items.map(function (item, index) {
      var tag = item.tag ? '<span class="news-card__tag text-label">' + item.tag + '</span>' : '';
      var isPublication = item.tag === 'Publication' && item.link;
      var readMoreHref = isPublication ? item.link : ('/news/#news-' + item.id);
      var readMoreAttrs = isPublication ? ' target="_blank" rel="noopener"' : '';
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
            '<a class="link-arrow" href="' + readMoreHref + '"' + readMoreAttrs + '>Read more &rarr;</a>' +
          '</div>' +
        '</div>';
    }).join('');

    wireLightbox(mount);

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
      var isPublication = item.tag === 'Publication' && item.link;
      var href = isPublication ? item.link : ('/news/#news-' + item.id);
      var attrs = isPublication ? ' target="_blank" rel="noopener"' : '';
      return '' +
        '<li><a href="' + href + '"' + attrs + '>' +
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
        items.forEach(function (item, i) { item.id = i; });

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

  var MONTH_ABBR = { Jan: 'Jan', Feb: 'Feb', Mar: 'Mar', Apr: 'Apr', May: 'May', Jun: 'Jun', June: 'Jun', Jul: 'Jul', July: 'Jul', Aug: 'Aug', Sep: 'Sep', Oct: 'Oct', Nov: 'Nov', Dec: 'Dec' };

  function parseNewsDate(str) {
    var parts = str.split(' ');
    var monthRaw = parts[0];
    var year = parts[parts.length - 1];
    return { year: year, month: MONTH_ABBR[monthRaw] || monthRaw };
  }

  function groupByYearAndMonth(items) {
    var years = [];
    var yearMap = {};
    items.forEach(function (item) {
      var d = parseNewsDate(item.date);
      item._year = d.year;
      item._month = d.month;
      if (!yearMap[d.year]) {
        yearMap[d.year] = { year: d.year, months: [], monthMap: {}, firstId: item.id };
        years.push(yearMap[d.year]);
      }
      var y = yearMap[d.year];
      if (!y.monthMap[d.month]) {
        y.monthMap[d.month] = { month: d.month, firstId: item.id };
        y.months.push(y.monthMap[d.month]);
      }
    });
    return years;
  }

  function renderTimeline(timelineMount, items) {
    var years = groupByYearAndMonth(items);
    if (years.length === 0) return;

    timelineMount.innerHTML = years.map(function (y) {
      return '' +
        '<li class="news-timeline__year" data-year="' + y.year + '">' +
          '<button class="news-timeline__year-btn" type="button" data-jump="' + y.firstId + '">' + y.year + '</button>' +
          '<div class="news-timeline__months-wrap">' +
            '<ol class="news-timeline__months">' +
              y.months.map(function (m) {
                return '' +
                  '<li class="news-timeline__month" data-month="' + m.month + '">' +
                    '<button class="news-timeline__month-btn" type="button" data-jump="' + m.firstId + '">' + m.month + '</button>' +
                  '</li>';
              }).join('') +
            '</ol>' +
          '</div>' +
        '</li>';
    }).join('');

    function setActive(year, month) {
      timelineMount.querySelectorAll('.news-timeline__year').forEach(function (el) {
        el.classList.toggle('is-active', el.getAttribute('data-year') === year);
      });
      timelineMount.querySelectorAll('.news-timeline__month').forEach(function (el) {
        el.classList.toggle('is-active', el.getAttribute('data-month') === month);
      });
    }

    timelineMount.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-jump]');
      if (!btn) return;
      var target = document.getElementById('news-' + btn.getAttribute('data-jump'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    var feedItems = Array.prototype.slice.call(document.querySelectorAll('.news-feed__item'));
    if (feedItems.length === 0) return;

    var current = null;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          if (id !== current) {
            current = id;
            var item = items[Number(id.replace('news-', ''))];
            setActive(item._year, item._month);
          }
        }
      });
    }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });
    feedItems.forEach(function (item) { observer.observe(item); });

    setActive(years[0].year, years[0].months[0].month);
  }

  function renderNewsList() {
    var mount = document.getElementById('news-feed');
    if (!mount) return;

    var timelineMount = document.getElementById('news-timeline-list');

    fetch('/data/news.json')
      .then(function (res) { return res.json(); })
      .then(function (items) {
        items.forEach(function (item, index) { item.id = index; });

        mount.innerHTML = items.map(function (item) {
          return '' +
            '<li class="news-feed__item" id="news-' + item.id + '">' +
              '<div class="news-feed__media"><img src="' + item.image + '" alt="' + escapeAttr(item.title) + '"></div>' +
              '<div class="news-feed__body">' +
                '<span class="news-feed__date text-muted">' + item.date + '</span>' +
                '<h2>' + item.title + '</h2>' +
                '<div class="news-feed__content">' + item.body + '</div>' +
              '</div>' +
            '</li>';
        }).join('');

        wireLightbox(mount);

        if (timelineMount) {
          renderTimeline(timelineMount, items);
        }

        if (window.location.hash) {
          var target = document.getElementById(window.location.hash.slice(1));
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      })
      .catch(function (err) {
        console.error('Failed to load news:', err);
      });
  }

  renderFeaturedNews();
  renderNewsList();
})();
