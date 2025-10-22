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

  // Google Sign-In handler (login.html)
  var googleBtn = document.getElementById('googleSignInBtn');
  if (googleBtn) {
    googleBtn.addEventListener('click', function () {
      if (window.auth && window.signInWithPopup && window.googleProvider) {
        googleBtn.disabled = true;
        googleBtn.textContent = 'Abriendo Google...';
        window.signInWithPopup(window.auth, window.googleProvider)
          .then(function (result) {
            console.log('Ingreso con Google:', result.user);
            alert('¡Bienvenido con Google, ' + (result.user.displayName || 'usuario') + '!');
            window.location.href = 'index.html';
          })
          .catch(function (error) {
            console.error('Error Google Sign-In:', error);
            var msg = 'No se pudo iniciar con Google';
            switch (error.code) {
              case 'auth/popup-closed-by-user':
                msg = 'Ventana cerrada antes de completar el inicio';
                break;
              case 'auth/cancelled-popup-request':
                msg = 'Se canceló la ventana emergente anterior';
                break;
              case 'auth/popup-blocked':
                msg = 'El navegador bloqueó la ventana. Permite popups.';
                break;
              default:
                msg = error.message || msg;
            }
            alert(msg);
          })
          .finally(function () {
            googleBtn.disabled = false;
            googleBtn.textContent = 'Continuar con Google';
          });
      } else {
        alert('Firebase/Google Provider no está configurado.');
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

  // Registro: handler para register.html
  var registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var emailEl = document.getElementById('regEmail');
      var passEl = document.getElementById('regPassword');
      var confirmEl = document.getElementById('regConfirm');
      var submitBtn = registerForm.querySelector('button[type="submit"]');

      var ok = true;
      if (emailEl && !emailEl.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setError('regEmail', 'Ingresa un email válido');
        ok = false;
      } else {
        setError('regEmail', '');
      }

      if (passEl && passEl.value.length < 6) {
        setError('regPassword', 'Mínimo 6 caracteres');
        ok = false;
      } else {
        setError('regPassword', '');
      }

      if (confirmEl && confirmEl.value !== (passEl ? passEl.value : '')) {
        setError('regConfirm', 'Las contraseñas no coinciden');
        ok = false;
      } else {
        setError('regConfirm', '');
      }

      if (!ok) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Creando...';

      if (window.auth && window.createUserWithEmailAndPassword) {
        window.createUserWithEmailAndPassword(window.auth, emailEl.value, passEl.value)
          .then(function(userCredential) {
            console.log('Usuario registrado:', userCredential.user);
            alert('¡Cuenta creada exitosamente! Inicia sesión para continuar.');
            window.location.href = 'login.html';
          })
          .catch(function(error) {
            console.error('Error de registro:', error);
            var errorMessage = 'Error al crear la cuenta';
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
            setError('regPassword', errorMessage);
          })
          .finally(function() {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Crear cuenta';
          });
      } else {
        alert('Firebase no está configurado correctamente');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Crear cuenta';
      }
    });
  }

  function setError(fieldName, msg) {
    var span = document.querySelector('.error[data-for="' + fieldName + '"]');
    if (span) span.textContent = msg;
  }

  // ===== Cart Module =====
  (function initCart() {
    var CART_KEY = 'sportswap_cart_v1';
    var overlay, drawer, badge, toggleBtn;

    function safeParse(json, fallback) {
      try { return JSON.parse(json); } catch (_) { return fallback; }
    }

    function getCart() {
      var raw = localStorage.getItem(CART_KEY);
      var cart = safeParse(raw, []);
      if (!Array.isArray(cart)) return [];
      return cart.filter(function (it) {
        return it && typeof it.id === 'string' && typeof it.name === 'string' && typeof it.price === 'number' && typeof it.qty === 'number' && it.qty > 0;
      });
    }

    function saveCart(cart) {
      try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (_) {}
      updateBadge(cart);
      renderCart(cart);
    }

    function formatCurrency(value) {
      try { return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value); } catch (_) { return '$' + value.toFixed(2); }
    }

    function ensureUI() {
      if (drawer) return;
      overlay = document.createElement('div');
      overlay.className = 'cart-overlay';
      overlay.addEventListener('click', closeDrawer);

      drawer = document.createElement('aside');
      drawer.className = 'cart-drawer';
      drawer.innerHTML = '' +
        '<div class="cart-header">' +
          '<h3>Tu carrito</h3>' +
          '<button class="cart-close" aria-label="Cerrar">×</button>' +
        '</div>' +
        '<div class="cart-items" id="cartItems"></div>' +
        '<div class="cart-footer">' +
          '<div class="cart-total"><span>Total</span><strong id="cartTotal">$0.00</strong></div>' +
          '<div class="cart-actions">' +
            '<button class="btn btn-ghost" id="cartClear">Vaciar</button>' +
            '<button class="btn btn-primary" id="cartCheckout">Comprar</button>' +
          '</div>' +
        '</div>';

      document.body.appendChild(overlay);
      document.body.appendChild(drawer);

      drawer.querySelector('.cart-close').addEventListener('click', closeDrawer);
      var clearBtn = drawer.querySelector('#cartClear');
      if (clearBtn) clearBtn.addEventListener('click', function(){ saveCart([]); });
      var checkoutBtn = drawer.querySelector('#cartCheckout');
      if (checkoutBtn) checkoutBtn.addEventListener('click', function(){ alert('Checkout simulado.'); });

      toggleBtn = document.createElement('button');
      toggleBtn.className = 'cart-toggle';
      toggleBtn.setAttribute('aria-label', 'Abrir carrito');
      toggleBtn.innerHTML = '🛒<span class="cart-badge" id="cartBadge">0</span>';
      toggleBtn.addEventListener('click', toggleDrawer);
      document.body.appendChild(toggleBtn);

      badge = toggleBtn.querySelector('#cartBadge');
    }

    function openDrawer() {
      ensureUI();
      overlay.classList.add('active');
      drawer.classList.add('open');
    }
    function closeDrawer() {
      if (!drawer) return;
      overlay.classList.remove('active');
      drawer.classList.remove('open');
    }
    function toggleDrawer() {
      if (!drawer) return openDrawer();
      if (drawer.classList.contains('open')) closeDrawer(); else openDrawer();
    }

    function updateBadge(cart) {
      ensureUI();
      var count = cart.reduce(function (sum, it) { return sum + (it.qty || 0); }, 0);
      if (badge) badge.textContent = String(count);
    }

    function renderCart(cart) {
      ensureUI();
      var list = drawer.querySelector('#cartItems');
      var totalEl = drawer.querySelector('#cartTotal');
      if (!list || !totalEl) return;
      if (!cart.length) {
        list.innerHTML = '<p class="muted" style="text-align:center;">Tu carrito está vacío</p>';
        totalEl.textContent = formatCurrency(0);
        return;
      }
      list.innerHTML = '';
      var total = 0;
      cart.forEach(function (it) {
        total += it.price * it.qty;
        var row = document.createElement('div');
        row.className = 'cart-row';
        row.innerHTML = '' +
          '<img class="cart-thumb" src="' + (it.image || '') + '" alt="' + it.name + '" />' +
          '<div class="cart-info">' +
            '<div class="cart-name">' + it.name + '</div>' +
            '<div class="cart-price">' + formatCurrency(it.price) + '</div>' +
            '<div class="cart-qty">' +
              '<button class="qty-btn" data-act="dec" data-id="' + it.id + '">−</button>' +
              '<span class="qty-val">' + it.qty + '</span>' +
              '<button class="qty-btn" data-act="inc" data-id="' + it.id + '">+</button>' +
              '<button class="remove-btn" data-act="rm" data-id="' + it.id + '">Quitar</button>' +
            '</div>' +
          '</div>';
        list.appendChild(row);
      });
      totalEl.textContent = formatCurrency(total);

      list.onclick = function (e) {
        var t = e.target;
        if (!t || !t.getAttribute) return;
        var act = t.getAttribute('data-act');
        var id = t.getAttribute('data-id');
        if (!act || !id) return;
        var cart = getCart();
        var idx = cart.findIndex(function (x) { return x.id === id; });
        if (idx === -1) return;
        if (act === 'inc') cart[idx].qty += 1;
        if (act === 'dec') cart[idx].qty = Math.max(1, cart[idx].qty - 1);
        if (act === 'rm') cart.splice(idx, 1);
        saveCart(cart);
      };
    }

    function normalizeId(text) {
      return String(text || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    function extractProductFromCard(card) {
      try {
        var nameEl = card.querySelector('h3');
        var priceEl = card.querySelector('.price');
        var imgEl = card.querySelector('img');
        var name = nameEl ? nameEl.textContent.trim() : 'Producto';
        var priceText = priceEl ? priceEl.textContent.replace(/[^0-9.,]/g, '').replace(',', '.') : '0';
        var price = parseFloat(priceText) || 0;
        var image = imgEl ? imgEl.getAttribute('src') : '';
        var id = normalizeId(name);
        return { id: id, name: name, price: price, image: image };
      } catch (e) {
        return null;
      }
    }

    function addToCart(product) {
      if (!product || !product.id) return;
      var cart = getCart();
      var idx = cart.findIndex(function (x) { return x.id === product.id; });
      if (idx >= 0) {
        cart[idx].qty += 1;
      } else {
        cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });
      }
      saveCart(cart);
      openDrawer();
    }

    function wireAddButtons() {
      var cards = document.querySelectorAll('.card');
      if (!cards || !cards.length) return;
      cards.forEach(function (card) {
        var btn = card.querySelector('button');
        if (!btn) return;
        if (btn.getAttribute('data-cart-wired') === '1') return;
        btn.setAttribute('data-cart-wired', '1');
        btn.addEventListener('click', function () {
          var product = extractProductFromCard(card);
          if (product) addToCart(product);
        });
      });
    }

    ensureUI();
    updateBadge(getCart());
    renderCart(getCart());
    wireAddButtons();

    var observer = new MutationObserver(function () { wireAddButtons(); });
    observer.observe(document.body, { childList: true, subtree: true });
  })();
});


