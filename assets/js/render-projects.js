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

  function renderDetail(titleEl, bodyEl, projects) {
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
    bodyEl.innerHTML = project.body;
    document.title = project.title + ' — W. Shao Laboratory';
  }

  var gridCurrent = document.getElementById('project-grid-current');
  var gridPrevious = document.getElementById('project-grid-previous');
  var titleEl = document.getElementById('project-title');
  var bodyEl = document.getElementById('project-body');

  if (!gridCurrent && !gridPrevious && !(titleEl && bodyEl)) return;

  fetch('/data/projects.json')
    .then(function (res) { return res.json(); })
    .then(function (projects) {
      if (gridCurrent || gridPrevious) renderGrid(gridCurrent, gridPrevious, projects);
      if (titleEl && bodyEl) renderDetail(titleEl, bodyEl, projects);
    })
    .catch(function (err) {
      console.error('Failed to load projects:', err);
    });
})();
