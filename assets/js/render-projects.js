(function () {
  'use strict';

  function projectCardHTML(project) {
    return (
      '<a class="project-card" href="/research/project.html?id=' + project.slug + '">' +
        '<img class="project-card__img" src="' + project.image + '" alt="' + project.title + '">' +
        '<div class="project-card__body">' +
          '<h3 class="project-card__title">' + project.title + '</h3>' +
          '<p class="project-card__summary">' + project.summary + '</p>' +
        '</div>' +
      '</a>'
    );
  }

  function renderGrid(grid, projects) {
    var html = '';
    for (var i = 0; i < projects.length; i++) {
      html += projectCardHTML(projects[i]);
    }
    grid.innerHTML = html;
  }

  function renderDetail(titleEl, bodyEl, projects) {
    var id = new URLSearchParams(window.location.search).get('id');
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
      return;
    }

    titleEl.textContent = project.title;
    bodyEl.innerHTML = project.body;
    document.title = project.title + ' — W. Shao Laboratory';
  }

  var grid = document.getElementById('project-grid');
  var titleEl = document.getElementById('project-title');
  var bodyEl = document.getElementById('project-body');

  if (!grid && !(titleEl && bodyEl)) return;

  fetch('/data/projects.json')
    .then(function (res) { return res.json(); })
    .then(function (projects) {
      if (grid) renderGrid(grid, projects);
      if (titleEl && bodyEl) renderDetail(titleEl, bodyEl, projects);
    })
    .catch(function (err) {
      console.error('Failed to load projects:', err);
    });
})();
