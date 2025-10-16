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

  // Login form validation and Firebase authentication
  var loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('email');
      var password = document.getElementById('password');
      var submitBtn = loginForm.querySelector('button[type="submit"]');
      
      // Validación básica
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
        // Deshabilitar botón y mostrar loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Entrando...';
        
        // Intentar login con Firebase
        if (window.auth && window.signInWithEmailAndPassword) {
          window.signInWithEmailAndPassword(window.auth, email.value, password.value)
            .then((userCredential) => {
              // Login exitoso
              const user = userCredential.user;
              console.log('Usuario logueado:', user);
              alert('¡Bienvenido a SportSwap!');
              // Redirigir al dashboard o página principal
              window.location.href = 'index.html';
            })
            .catch((error) => {
              // Error en el login
              console.error('Error de login:', error);
              let errorMessage = 'Error al iniciar sesión';
              
              switch (error.code) {
                case 'auth/user-not-found':
                  errorMessage = 'No existe una cuenta con este email';
                  break;
                case 'auth/wrong-password':
                  errorMessage = 'Contraseña incorrecta';
                  break;
                case 'auth/invalid-email':
                  errorMessage = 'Email inválido';
                  break;
                case 'auth/too-many-requests':
                  errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
                  break;
                default:
                  errorMessage = error.message;
              }
              
              setError('password', errorMessage);
            })
            .finally(() => {
              // Rehabilitar botón
              submitBtn.disabled = false;
              submitBtn.textContent = 'Entrar';
            });
        } else {
          // Fallback si Firebase no está disponible
          alert('Firebase no está configurado correctamente');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Entrar';
        }
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

  // Funcionalidad de registro
  var registerLink = document.getElementById('registerLink');
  if (registerLink) {
    registerLink.addEventListener('click', function(e) {
      e.preventDefault();
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;
      
      if (!email || !password) {
        alert('Por favor completa todos los campos para registrarte');
        return;
      }
      
      if (password.length < 6) {
        setError('password', 'La contraseña debe tener al menos 6 caracteres');
        return;
      }
      
      if (window.auth && window.createUserWithEmailAndPassword) {
        window.createUserWithEmailAndPassword(window.auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log('Usuario registrado:', user);
            alert('¡Cuenta creada exitosamente! Ya puedes iniciar sesión.');
            // Limpiar formulario
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            setError('password', '');
          })
          .catch((error) => {
            console.error('Error de registro:', error);
            let errorMessage = 'Error al crear la cuenta';
            
            switch (error.code) {
              case 'auth/email-already-in-use':
                errorMessage = 'Ya existe una cuenta con este email';
                break;
              case 'auth/invalid-email':
                errorMessage = 'Email inválido';
                break;
              case 'auth/weak-password':
                errorMessage = 'La contraseña es muy débil';
                break;
              default:
                errorMessage = error.message;
            }
            
            setError('password', errorMessage);
          });
      } else {
        alert('Firebase no está configurado correctamente');
      }
    });
  }

  function setError(fieldName, msg) {
    var span = document.querySelector('.error[data-for="' + fieldName + '"]');
    if (span) span.textContent = msg;
  }
});


