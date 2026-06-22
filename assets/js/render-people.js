(function () {
  function personCardHTML(person) {
    return '' +
      '<button type="button" class="person-card" data-slug="' + person.slug + '">' +
        '<img class="person-card__photo" src="' + person.photo + '" alt="' + person.name + '">' +
        '<div class="person-card__body">' +
          '<h3>' + person.name + '</h3>' +
          '<p class="person-card__title text-muted">' + person.title + '</p>' +
        '</div>' +
      '</button>';
  }

  function personModalHTML(person) {
    var email = person.email
      ? '<p class="person-modal__email"><strong>Email:</strong> <a href="mailto:' + person.email + '">' + person.email + '</a></p>'
      : '';

    return '' +
      '<div class="person-modal__header">' +
        '<img class="person-modal__photo" src="' + person.photo + '" alt="' + person.name + '">' +
        '<div>' +
          '<h2>' + person.name + '</h2>' +
          '<p class="text-muted">' + person.title + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="person-modal__bio">' + person.bio + '</div>' +
      email;
  }

  function piBioHTML(pi) {
    var blurb = pi.blurb ? '<p class="text-lead about-pi__blurb">' + pi.blurb + '</p>' : '';
    var cvBtn = pi.cv
      ? '<a class="btn" href="' + pi.cv + '" download>Download CV</a>'
      : '';

    return '' +
      '<div class="about-pi__photo">' +
        '<img src="' + pi.photo + '" alt="' + pi.name + '">' +
      '</div>' +
      '<div class="about-pi__text">' +
        '<h2>' + pi.name + '</h2>' +
        '<p class="text-muted">' + pi.title + '</p>' +
        blurb +
        '<div class="about-pi__bio">' + pi.bio + '</div>' +
        '<p class="about-pi__email"><strong>Email:</strong> <a href="mailto:' + pi.email + '">' + pi.email + '</a></p>' +
        '<div class="about-pi__actions">' +
          '<button type="button" class="btn btn-primary" id="pi-message-btn">Leave a message</button>' +
          cvBtn +
        '</div>' +
      '</div>';
  }

  function openModal(person) {
    var modal = document.getElementById('person-modal');
    var body = document.getElementById('person-modal-body');
    if (!modal || !body) return;

    body.innerHTML = personModalHTML(person);
    modal.style.display = 'flex';
  }

  function wireCards(mount, people) {
    var cards = mount.querySelectorAll('[data-slug]');
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        var slug = card.getAttribute('data-slug');
        var person = people.filter(function (p) { return p.slug === slug; })[0];
        if (person) openModal(person);
      });
    });
  }

  var pi = document.getElementById('about-pi');
  var members = document.getElementById('people-members');
  var mascots = document.getElementById('people-mascots');
  var alumni = document.getElementById('people-alumni');
  var modal = document.getElementById('person-modal');
  var closeBtn = document.getElementById('close-person-modal');

  if (!pi && !members && !mascots) return;

  if (modal && closeBtn) {
    closeBtn.addEventListener('click', function () {
      modal.style.display = 'none';
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  fetch('/data/people.json')
    .then(function (res) { return res.json(); })
    .then(function (people) {
      var pis = people.filter(function (p) { return p.section === 'pi'; });
      var memberList = people.filter(function (p) { return p.section === 'member'; });
      var mascotList = people.filter(function (p) { return p.section === 'mascot'; });
      var alumniList = people.filter(function(p) { return p.section === 'alumni'; });

      if (pi && pis.length > 0) {
        pi.innerHTML = piBioHTML(pis[0]);
        var msgBtn = document.getElementById('pi-message-btn');
        if (msgBtn) {
          msgBtn.addEventListener('click', function () {
            var messageModal = document.getElementById('message-modal');
            if (messageModal) messageModal.style.display = 'flex';
          });
        }
      }
      if (members) {
        members.innerHTML = memberList.map(personCardHTML).join('');
        wireCards(members, people);
      }
      if (mascots) {
        mascots.innerHTML = mascotList.map(personCardHTML).join('');
        wireCards(mascots, people);
      }
      if (alumni) {
        alumni.innerHTML = alumniList.map(personCardHTML).join('');
        wireCards(alumni, people);
      }
    })
    .catch(function (err) {
      console.error('Failed to load people:', err);
    });
})();
