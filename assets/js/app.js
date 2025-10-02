// Year in footer
document.addEventListener('DOMContentLoaded', function () {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Nav active state
  var links = document.querySelectorAll('.nav-link');
  var current = location.pathname.split('/').pop() || 'index.html';
  links.forEach(function (a) {
    var href = a.getAttribute('href');
    if (href && href.indexOf(current) !== -1) {
      a.classList.add('active');
    }
  });

  // Login form validation
  var loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('email');
      var password = document.getElementById('password');
      var ok = true;
      if (email && !email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setError('email', 'Ingresa un email válido');
        ok = false;
      } else {
        setError('email', '');
      }
      if (password && password.value.length < 6) {
        setError('password', 'Mínimo 6 caracteres');
        ok = false;
      } else {
        setError('password', '');
      }
      if (ok) {
        alert('Inicio de sesión simulado. ¡Bienvenido a SportSwap!');
        loginForm.reset();
      }
    });
  }

  // Tracking validation
  var trackForm = document.getElementById('trackForm');
  if (trackForm) {
    trackForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var tracking = document.getElementById('tracking');
      if (tracking && tracking.value.trim().length < 6) {
        setError('tracking', 'Ingresa un código válido');
      } else {
        setError('tracking', '');
        alert('Seguimiento simulado: Tu pedido está en camino ✨');
        trackForm.reset();
      }
    });
  }

  function setError(fieldName, msg) {
    var span = document.querySelector('.error[data-for="' + fieldName + '"]');
    if (span) span.textContent = msg;
  }
});


