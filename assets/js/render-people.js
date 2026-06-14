(function () {
  function personCardHTML(person, featured) {
    var cardClass = featured ? 'person-card person-card--featured' : 'person-card';
    var blurb = (featured && person.blurb)
      ? '<p class="person-card__blurb text-muted">' + person.blurb + '</p>'
      : '';

    return '' +
      '<button type="button" class="' + cardClass + '" data-slug="' + person.slug + '">' +
        '<img class="person-card__photo" src="' + person.photo + '" alt="' + person.name + '">' +
        '<div class="person-card__body">' +
          '<h3>' + person.name + '</h3>' +
          '<p class="person-card__title text-muted">' + person.title + '</p>' +
          blurb +
        '</div>' +
      '</button>';
  }

  function personModalHTML(person) {
    var email = person.email
      ? '<p class="person-modal__email"><strong>Email:</strong> ' + person.email + '</p>'
      : '';

    var actions = '';
    if (person.section === 'pi') {
      var cvBtn = person.cv
        ? '<a class="btn" href="' + person.cv + '" download>Download CV</a>'
        : '';
      actions = '' +
        '<div class="person-modal__actions">' +
          '<button type="button" class="btn btn-primary" id="person-modal-message">Leave a message</button>' +
          cvBtn +
        '</div>';
    }

    return '' +
      '<div class="person-modal__header">' +
        '<img class="person-modal__photo" src="' + person.photo + '" alt="' + person.name + '">' +
        '<div>' +
          '<h2>' + person.name + '</h2>' +
          '<p class="text-muted">' + person.title + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="person-modal__bio">' + person.bio + '</div>' +
      email +
      actions;
  }

  function openModal(person) {
    var modal = document.getElementById('person-modal');
    var body = document.getElementById('person-modal-body');
    if (!modal || !body) return;

    body.innerHTML = personModalHTML(person);
    modal.style.display = 'flex';

    var msgBtn = document.getElementById('person-modal-message');
    if (msgBtn) {
      msgBtn.addEventListener('click', function () {
        modal.style.display = 'none';
        var messageModal = document.getElementById('message-modal');
        if (messageModal) messageModal.style.display = 'flex';
      });
    }
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

      if (pi && pis.length > 0) {
        pi.innerHTML = personCardHTML(pis[0], true);
        wireCards(pi, people);
      }
      if (members) {
        members.innerHTML = memberList.map(function (p) { return personCardHTML(p, false); }).join('');
        wireCards(members, people);
      }
      if (mascots) {
        mascots.innerHTML = mascotList.map(function (p) { return personCardHTML(p, false); }).join('');
        wireCards(mascots, people);
      }
    })
    .catch(function (err) {
      console.error('Failed to load people:', err);
    });
})();
