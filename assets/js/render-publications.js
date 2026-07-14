(function () {
  function featuredCardHTML(pub) {
    var cols = pub.cols || 1;
    var rows = pub.rows || 1;
    var isMain = cols > 1 || rows > 1;
    var sizeClass = isMain ? ' size-' + cols + 'x' + rows : '';
    var style = 'grid-column: span ' + cols + '; grid-row: span ' + rows;

    var media = pub.highlightImage
      ? '<img class="pub-highlight__media" src="' + pub.highlightImage + '" alt="' + pub.title + '">'
      : '';
    var tag = pub.journal ? pub.journal + ' &middot; ' + pub.year : String(pub.year);
    var desc = (isMain && pub.highlightDescription)
      ? '<p class="pub-highlight__desc text-muted">' + pub.highlightDescription + '</p>'
      : '';

    return '' +
      '<a class="pub-highlight' + sizeClass + '" href="' + pub.link + '" target="_blank" style="' + style + '">' +
        media +
        '<div class="pub-highlight__body">' +
          '<span class="pub-highlight__tag text-label text-muted">' + tag + '</span>' +
          '<h3 class="pub-highlight__title">' + pub.title + '</h3>' +
          desc +
        '</div>' +
      '</a>';
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function mediaRollerHTML(items, pubMap) {
    items = shuffle(items);
    var slides = items.map(function (item, i) {
      var pub = pubMap[item.publication];
      var refLabel = pub ? pub.journal + ' ' + pub.year : '';
      return '' +
        '<a class="media-roller__slide' + (i === 0 ? ' active' : '') + '" href="' + item.link + '" target="_blank">' +
          '<img class="media-roller__img" src="' + item.image + '" alt="">' +
          '<div class="media-roller__body">' +
            '<span class="media-roller__source">' + item.source + '</span>' +
            '<p class="media-roller__headline">' + item.headline + '</p>' +
            (refLabel ? '<p class="media-roller__ref">Re: <span class="pub-journal">' + refLabel + '</span></p>' : '') +
          '</div>' +
        '</a>';
    }).join('');

    return '' +
      '<div class="media-roller" id="media-roller">' +
        '<span class="media-roller__label">In the Media</span>' +
        slides +
        '<div class="media-roller__dots" id="media-dots"></div>' +
      '</div>';
  }

  function initRoller() {
    var roller = document.getElementById('media-roller');
    if (!roller) return;
    var slides = roller.querySelectorAll('.media-roller__slide');
    var dotsContainer = document.getElementById('media-dots');
    if (slides.length < 2) return;

    var current = 0;
    var paused = false;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'media-roller__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); });
      dotsContainer.appendChild(dot);
    });

    var dots = dotsContainer.querySelectorAll('.media-roller__dot');

    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    roller.addEventListener('mouseenter', function () { paused = true; });
    roller.addEventListener('mouseleave', function () { paused = false; });

    setInterval(function () {
      if (!paused) goTo((current + 1) % slides.length);
    }, 4000);
  }

  function listItemHTML(pub) {
    var titleEl = pub.link
      ? '<a href="' + pub.link + '" target="_blank">' + pub.title + '</a>'
      : '<span>' + pub.title + '</span>';
    var news = pub.newsHighlight
      ? '<br><span class="pub-news">' + pub.newsHighlight + '</span>'
      : '';

    var idAttr = pub.slug ? ' id="pub-' + pub.slug + '"' : '';
    return '' +
      '<li data-year="' + pub.year + '"' + idAttr + '>' +
        titleEl + '<br>' +
        '<span class="pub-authors">' + pub.authors + '</span><br>' +
        pub.citation +
        news +
      '</li>';
  }

  var featuredMount = document.getElementById('featured-pubs');
  var listMount = document.getElementById('pub-list');
  var filterSelect = document.getElementById('year-filter');

  if (!featuredMount && !listMount) return;

  var pubsPromise = fetch('/data/publications.json').then(function (r) { return r.json(); });
  var mediaPromise = featuredMount
    ? fetch('/data/media.json').then(function (r) { return r.json(); }).catch(function () { return []; })
    : Promise.resolve([]);

  Promise.all([pubsPromise, mediaPromise])
    .then(function (results) {
      var pubs = results[0];
      var media = results[1];

      var pubMap = {};
      pubs.forEach(function (p) { if (p.slug) pubMap[p.slug] = p; });

      if (featuredMount) {
        var main = pubs.filter(function (p) { return p.featured === 'main'; });
        var secondary = pubs.filter(function (p) { return p.featured === 'secondary'; });
        var featured = main.concat(secondary);

        var cards = featured.map(function (p) { return featuredCardHTML(p); }).join('');
        var roller = media.length > 0 ? mediaRollerHTML(media, pubMap) : '';

        featuredMount.innerHTML = '<div class="featured-grid">' + cards + roller + '</div>';
        initRoller();
      }

      if (listMount) {
        listMount.setAttribute('start', String(pubs.length));
        listMount.innerHTML = pubs.map(listItemHTML).join('');
      }

      if (filterSelect && listMount) {
        var years = [];
        pubs.forEach(function (p) {
          if (years.indexOf(p.year) === -1) years.push(p.year);
        });
        years.sort(function (a, b) { return b - a; });

        years.forEach(function (year) {
          var option = document.createElement('option');
          option.value = String(year);
          option.textContent = String(year);
          filterSelect.appendChild(option);
        });

        filterSelect.addEventListener('change', function () {
          var value = filterSelect.value;
          var items = listMount.querySelectorAll('li');
          items.forEach(function (li) {
            li.style.display = (value === 'all' || li.getAttribute('data-year') === value) ? '' : 'none';
          });
        });
      }
    })
    .catch(function (err) {
      console.error('Failed to load publications:', err);
    });
})();
