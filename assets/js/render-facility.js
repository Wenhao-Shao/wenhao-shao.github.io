(function () {
  function openLightbox(src) {
    var overlay = document.createElement('div');
    overlay.className = 'image-lightbox';
    overlay.innerHTML =
      '<button class="image-lightbox__close" aria-label="Close">&times;</button>' +
      '<img class="image-lightbox__img" src="' + src + '">';
    overlay.addEventListener('click', function (e) {
      if (e.target !== overlay.querySelector('.image-lightbox__img')) {
        overlay.remove();
      }
    });
    document.body.appendChild(overlay);
  }

  function renderFacility() {
    var mount = document.getElementById('facility-mosaic');
    if (!mount) return;

    fetch('/data/facility.json')
      .then(function (res) { return res.json(); })
      .then(function (items) {
        mount.innerHTML = items.map(function (item) {
          var cols = item.cols || 1;
          var rows = item.rows || 1;
          var style = 'grid-column: span ' + cols + '; grid-row: span ' + rows + '; background-image:url(\'' + item.image + '\')';
          return '' +
            '<div class="tile tile--clickable" style="' + style + '" data-full="' + item.image + '">' +
              '<div class="tile__overlay"><span class="tile__title">' + item.title + '</span></div>' +
            '</div>';
        }).join('');

        mount.addEventListener('click', function (e) {
          var tile = e.target.closest('.tile--clickable');
          if (tile) openLightbox(tile.getAttribute('data-full'));
        });
      })
      .catch(function (err) {
        console.error('Failed to load facility data:', err);
      });
  }

  renderFacility();
})();
