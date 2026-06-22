(function () {
  function renderGalleryMosaic() {
    var mount = document.getElementById('gallery-mosaic');
    if (!mount) return;

    fetch('/data/gallery.json')
      .then(function (res) { return res.json(); })
      .then(function (items) {
        mount.innerHTML = items.map(function (item) {
          var external = /^https?:\/\//.test(item.link);
          var attrs = external ? ' target="_blank" rel="noopener"' : '';
          var cols = item.cols || 1;
          var rows = item.rows || 1;
          var style = 'grid-column: span ' + cols + '; grid-row: span ' + rows + '; background-image:url(\'' + item.image + '\')';
          return '' +
            '<a class="tile" href="' + item.link + '" style="' + style + '"' + attrs + '>' +
              '<div class="tile__overlay"><span class="tile__title">' + item.title + '</span></div>' +
            '</a>';
        }).join('');
      })
      .catch(function (err) {
        console.error('Failed to load gallery:', err);
      });
  }

  renderGalleryMosaic();
})();
