(function () {
  function featuredCardHTML(pub, isMain) {
    var media = pub.highlightImage
      ? '<img class="pub-highlight__media" src="' + pub.highlightImage + '" alt="' + pub.title + '">'
      : '';
    var tag = pub.journal ? pub.journal + ' &middot; ' + pub.year : String(pub.year);
    var desc = (isMain && pub.highlightDescription)
      ? '<p class="pub-highlight__desc text-muted">' + pub.highlightDescription + '</p>'
      : '';

    return '' +
      '<a class="pub-highlight" href="' + pub.link + '" target="_blank">' +
        media +
        '<div class="pub-highlight__body">' +
          '<span class="pub-highlight__tag text-label text-muted">' + tag + '</span>' +
          '<h3 class="pub-highlight__title">' + pub.title + '</h3>' +
          desc +
        '</div>' +
      '</a>';
  }

  function listItemHTML(pub) {
    var titleEl = pub.link
      ? '<a href="' + pub.link + '" target="_blank">' + pub.title + '</a>'
      : '<span>' + pub.title + '</span>';
    var news = pub.newsHighlight
      ? '<br><span class="pub-news">' + pub.newsHighlight + '</span>'
      : '';

    return '' +
      '<li data-year="' + pub.year + '">' +
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

  fetch('/data/publications.json')
    .then(function (res) { return res.json(); })
    .then(function (pubs) {
      if (featuredMount) {
        var main = pubs.filter(function (p) { return p.featured === 'main'; })[0];
        var secondary = pubs.filter(function (p) { return p.featured === 'secondary'; });

        if (main) {
          var grid = secondary.map(function (p) { return featuredCardHTML(p, false); }).join('');
          featuredMount.innerHTML = '' +
            '<div class="featured-pubs">' +
              '<div class="featured-pubs__main">' + featuredCardHTML(main, true) + '</div>' +
              '<div class="featured-pubs__grid">' + grid + '</div>' +
            '</div>';
        }
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
