(function () {
  function renderGalleryMosaic() {
    var mount = document.getElementById('gallery-mosaic');
    if (!mount) return;

    fetch('/data/gallery.json')
      .then(function (res) { return res.json(); })
      .then(function (items) {
        var classes = ['t1', 't2', 't3', 't4', 't5'];
        var tiles = items.map(function (item, index) {
          var external = /^https?:\/\//.test(item.link);
          var attrs = external ? ' target="_blank" rel="noopener"' : '';
          return '' +
            '<a class="tile ' + (classes[index] || '') + '" href="' + item.link + '" style="background-image:url(\'' + item.image + '\')"' + attrs + '>' +
              '<div class="tile__overlay"><span class="tile__title">' + item.title + '</span></div>' +
            '</a>';
        });

        mount.innerHTML =
          '<div class="gallery-mosaic__row gallery-mosaic__row--top">' + tiles.slice(0, 2).join('') + '</div>' +
          '<div class="gallery-mosaic__row gallery-mosaic__row--bottom">' + tiles.slice(2, 5).join('') + '</div>';
      })
      .catch(function (err) {
        console.error('Failed to load gallery:', err);
      });
  }

  renderGalleryMosaic();
})();
