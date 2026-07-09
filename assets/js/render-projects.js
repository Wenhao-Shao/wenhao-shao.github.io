(function () {
  'use strict';

  function projectCardHTML(project) {
    var imgTag = project.image
      ? '<img class="project-card__img" src="' + project.image + '" alt="' + project.title + '">'
      : '';
    return (
      '<a class="project-card" href="/research/project.html#' + project.slug + '">' +
        imgTag +
        '<div class="project-card__body">' +
          '<h3 class="project-card__title">' + project.title + '</h3>' +
          '<p class="project-card__summary">' + project.summary + '</p>' +
        '</div>' +
      '</a>'
    );
  }

  function renderGrid(currentGrid, previousGrid, projects) {
    var current = projects.filter(function (p) { return p.status === 'current'; });
    var previous = projects.filter(function (p) { return p.status === 'previous'; });
    if (currentGrid) currentGrid.innerHTML = current.map(projectCardHTML).join('');
    if (previousGrid) previousGrid.innerHTML = previous.map(projectCardHTML).join('');
  }

  function pubRefHTML(pub, index) {
    var titleEl = pub.link
      ? '<u><a href="' + pub.link + '" target="_blank">' + pub.title + '</a></u>'
      : '<span>' + pub.title + '</span>';
    return '<p class="project-pub-ref">[' + (index + 1) + '] ' + titleEl +
      '<br><span class="text-muted">' + pub.authors + '</span>' +
      '<br><span class="text-muted">' + pub.citation + '</span></p>';
  }

  function renderDetail(titleEl, bodyEl, projects, pubMap) {
    var id = window.location.hash.slice(1);
    var project = null;
    for (var i = 0; i < projects.length; i++) {
      if (projects[i].slug === id) {
        project = projects[i];
        break;
      }
    }

    if (!project) {
      titleEl.textContent = 'Project Not Found';
      bodyEl.innerHTML = '<p>Sorry, we could not find that project. <a href="/research/">Return to Research &rarr;</a></p>';
      document.title = 'Project Not Found — W. Shao Laboratory';
      return;
    }

    titleEl.textContent = project.title;

    var html = project.body;

    if (project.publications && project.publications.length > 0) {
      var pubsHTML = '<p><strong>Read more:</strong></p>';
      for (var j = 0; j < project.publications.length; j++) {
        var ref = project.publications[j];
        if (typeof ref === 'string') {
          var pub = pubMap[ref];
          if (pub) {
            pubsHTML += pubRefHTML(pub, j);
          }
        } else if (ref.external) {
          pubsHTML += '<p class="project-pub-ref">[' + (j + 1) + '] ' +
            '<u><a href="' + ref.link + '" target="_blank">' + ref.title + '</a></u>' +
            '<br><span class="text-muted">' + ref.citation + '</span></p>';
        }
      }
      html += pubsHTML;
    }

    bodyEl.innerHTML = html;
    document.title = project.title + ' — W. Shao Laboratory';
  }

  var gridCurrent = document.getElementById('project-grid-current');
  var gridPrevious = document.getElementById('project-grid-previous');
  var titleEl = document.getElementById('project-title');
  var bodyEl = document.getElementById('project-body');

  if (!gridCurrent && !gridPrevious && !(titleEl && bodyEl)) return;

  var projectsPromise = fetch('/data/projects.json').then(function (res) { return res.json(); });
  var pubsPromise = (titleEl && bodyEl)
    ? fetch('/data/publications.json').then(function (res) { return res.json(); })
    : Promise.resolve([]);

  Promise.all([projectsPromise, pubsPromise])
    .then(function (results) {
      var projects = results[0];
      var pubs = results[1];

      var pubMap = {};
      pubs.forEach(function (p) {
        if (p.slug) pubMap[p.slug] = p;
      });

      if (gridCurrent || gridPrevious) renderGrid(gridCurrent, gridPrevious, projects);
      if (titleEl && bodyEl) renderDetail(titleEl, bodyEl, projects, pubMap);
    })
    .catch(function (err) {
      console.error('Failed to load projects:', err);
    });
})();
