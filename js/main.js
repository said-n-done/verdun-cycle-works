// Nothing fancy -- just a smooth-scroll nudge for the tune-up link so it
// doesn't feel like a dead jump on mobile Safari.
document.addEventListener('DOMContentLoaded', function () {
  var bookLinks = document.querySelectorAll('a[href="contact.html"]');
  bookLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      window.sessionStorage.setItem('came_from_book', '1');
    });
  });
});
