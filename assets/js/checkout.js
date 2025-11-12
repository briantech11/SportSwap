// Datos de provincias y distritos de Panamá (mismo que delivery-form.js)
const provinciasDistritos = {
  'panama': [
    'Panamá', 'San Miguelito', 'Tocumen', 'Las Cumbres', 'Pacora', 'Chilibre', 'Chepo', 'Chiman'
  ],
  'colon': [
    'Colón', 'Cristóbal', 'Chagres', 'Donoso', 'Portobelo', 'Santa Isabel'
  ],
  'darien': [
    'La Palma', 'Chepigana', 'Pinogana', 'Santa Fe'
  ],
  'cocle': [
    'Penonomé', 'Aguadulce', 'Antón', 'La Pintada', 'Natá', 'Olá'
  ],
  'veraguas': [
    'Santiago', 'Atalaya', 'Calobre', 'Cañazas', 'La Mesa', 'Las Palmas', 'Montijo', 'Río de Jesús', 'San Francisco', 'Santa Fe', 'Sona'
  ],
  'los-santos': [
    'Las Tablas', 'Guararé', 'Los Santos', 'Macaracas', 'Pedasí', 'Pocrí', 'Tonosí'
  ],
  'herrera': [
    'Chitré', 'Las Minas', 'Los Pozos', 'Ocú', 'Parita', 'Pesé', 'Santa María'
  ],
  'chiriqui': [
    'David', 'Alanje', 'Barú', 'Boquerón', 'Boquete', 'Bugaba', 'Dolega', 'Gualaca', 'Remedios', 'Renacimiento', 'San Félix', 'San Lorenzo', 'Tierras Altas', 'Tolé'
  ],
  'bocas-del-toro': [
    'Bocas del Toro', 'Almirante', 'Changuinola', 'Chiriquí Grande'
  ],
  'panama-oeste': [
    'La Chorrera', 'Arraiján', 'Capira', 'Chame', 'San Carlos'
  ]
};

// Clave del carrito
var CART_KEY = 'sportswap_cart_v1';

// Función para mostrar errores
function setError(fieldName, msg) {
  var span = document.querySelector('.error[data-for="' + fieldName + '"]');
  if (span) span.textContent = msg;
}

// Función para limpiar errores
function clearError(fieldName) {
  setError(fieldName, '');
}

// Función para formatear moneda
function formatCurrency(value) {
  try {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value);
  } catch (_) {
    return '$' + value.toFixed(2);
  }
}

// Función para obtener el carrito
function getCart() {
  try {
    var raw = localStorage.getItem(CART_KEY);
    var cart = JSON.parse(raw);
    if (!Array.isArray(cart)) return [];
    return cart.filter(function (it) {
      return it && typeof it.id === 'string' && typeof it.name === 'string' && typeof it.price === 'number' && typeof it.qty === 'number' && it.qty > 0;
    });
  } catch (_) {
    return [];
  }
}

// Función para calcular el costo de envío
function calculateShipping(province) {
  var shippingRates = {
    'panama': 3.00,
    'panama-oeste': 4.50,
    'colon': 4.50,
    'darien': 6.00,
    'cocle': 6.00,
    'veraguas': 6.00,
    'los-santos': 6.00,
    'herrera': 6.00,
    'chiriqui': 6.00,
    'bocas-del-toro': 6.00
  };
  return shippingRates[province] || 6.00;
}

// Cargar distritos según la provincia seleccionada
function loadDistricts(province) {
  var districtSelect = document.getElementById('checkoutDistrict');
  if (!districtSelect) return;
  
  districtSelect.innerHTML = '<option value="">Selecciona un distrito</option>';
  
  if (!province || !provinciasDistritos[province]) {
    districtSelect.disabled = true;
    return;
  }
  
  districtSelect.disabled = false;
  var districts = provinciasDistritos[province];
  
  districts.forEach(function(district) {
    var option = document.createElement('option');
    option.value = district.toLowerCase().replace(/\s+/g, '-');
    option.textContent = district;
    districtSelect.appendChild(option);
  });
}

// Validar número de teléfono (8 dígitos)
function validatePhone(phone) {
  var phoneRegex = /^[0-9]{8}$/;
  return phoneRegex.test(phone);
}

// Generar número de pedido único
function generateOrderNumber() {
  // Formato: SS + YYYYMMDDHHmmss + 3 caracteres aleatorios
  var now = new Date();
  var year = now.getFullYear();
  var month = String(now.getMonth() + 1).padStart(2, '0');
  var day = String(now.getDate()).padStart(2, '0');
  var hours = String(now.getHours()).padStart(2, '0');
  var minutes = String(now.getMinutes()).padStart(2, '0');
  var seconds = String(now.getSeconds()).padStart(2, '0');
  
  var timestamp = year + month + day + hours + minutes + seconds;
  
  // 3 caracteres aleatorios (letras mayúsculas)
  var randomChars = '';
  for (var i = 0; i < 3; i++) {
    randomChars += String.fromCharCode(65 + Math.floor(Math.random() * 26));
  }
  
  return 'SS' + timestamp + randomChars;
}

// Renderizar resumen del carrito
function renderCartSummary() {
  var cart = getCart();
  var cartItemsContainer = document.getElementById('checkoutCartItems');
  var subtotalEl = document.getElementById('checkoutSubtotal');
  var shippingEl = document.getElementById('checkoutShipping');
  var totalEl = document.getElementById('checkoutTotal');
  
  if (!cartItemsContainer || !subtotalEl || !shippingEl || !totalEl) return;
  
  if (!cart || cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="muted" style="text-align: center;">Tu carrito está vacío</p>';
    subtotalEl.textContent = formatCurrency(0);
    shippingEl.textContent = formatCurrency(0);
    totalEl.textContent = formatCurrency(0);
    return;
  }
  
  var subtotal = 0;
  var itemsHTML = '';
  
  cart.forEach(function(item) {
    var itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    
    itemsHTML += '<div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">';
    itemsHTML += '<div style="flex: 1;">';
    itemsHTML += '<div style="font-weight: 600; margin-bottom: 4px;">' + item.name + '</div>';
    itemsHTML += '<div style="font-size: 12px; opacity: 0.7;">Cantidad: ' + item.qty + ' x ' + formatCurrency(item.price) + '</div>';
    itemsHTML += '</div>';
    itemsHTML += '<div style="font-weight: 600; margin-left: 16px;">' + formatCurrency(itemTotal) + '</div>';
    itemsHTML += '</div>';
  });
  
  cartItemsContainer.innerHTML = itemsHTML;
  
  // Calcular envío (se actualizará cuando se seleccione la provincia)
  var province = document.getElementById('checkoutProvince') ? document.getElementById('checkoutProvince').value : '';
  var shipping = province ? calculateShipping(province) : 0;
  var total = subtotal + shipping;
  
  subtotalEl.textContent = formatCurrency(subtotal);
  shippingEl.textContent = formatCurrency(shipping);
  totalEl.textContent = formatCurrency(total);
}

// Autocompletar datos del usuario si está logueado
function autoFillUserData(user) {
  if (!user) return;
  
  var emailInput = document.getElementById('checkoutEmail');
  var nameInput = document.getElementById('checkoutFullName');
  
  if (emailInput && user.email) {
    emailInput.value = user.email;
  }
  
  if (nameInput && user.displayName) {
    nameInput.value = user.displayName;
  } else if (nameInput && user.email) {
    // Usar la parte antes del @ del email como nombre por defecto
    nameInput.value = user.email.split('@')[0];
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  var checkoutForm = document.getElementById('checkoutForm');
  var provinceSelect = document.getElementById('checkoutProvince');
  var districtSelect = document.getElementById('checkoutDistrict');
  var phoneInput = document.getElementById('checkoutPhone');
  var orderModal = document.getElementById('orderConfirmationModal');
  var closeModalBtn = document.getElementById('closeModalBtn');
  
  // Verificar si el carrito tiene items
  var cart = getCart();
  if (!cart || cart.length === 0) {
    alert('Tu carrito está vacío. Agrega productos antes de hacer checkout.');
    window.location.href = 'index.html';
    return;
  }
  
  // Renderizar resumen del carrito
  renderCartSummary();
  
  // Cargar datos del usuario si está logueado
  if (window.auth && window.onAuthStateChanged) {
    window.onAuthStateChanged(window.auth, function(user) {
      if (user) {
        autoFillUserData(user);
        console.log('Usuario logueado:', user.email);
      } else {
        console.log('Usuario no logueado');
      }
    });
  }
  
  // Manejar cambio de provincia
  if (provinceSelect) {
    provinceSelect.addEventListener('change', function() {
      var province = this.value;
      loadDistricts(province);
      clearError('checkoutProvince');
      clearError('checkoutDistrict');
      // Actualizar costo de envío
      renderCartSummary();
    });
  }
  
  // Validar teléfono en tiempo real
  if (phoneInput) {
    phoneInput.addEventListener('input', function() {
      var phone = this.value.replace(/\D/g, '');
      this.value = phone;
      
      if (phone.length > 0 && !validatePhone(phone)) {
        setError('checkoutPhone', 'El teléfono debe tener exactamente 8 dígitos');
      } else {
        clearError('checkoutPhone');
      }
    });
    
    phoneInput.addEventListener('blur', function() {
      var phone = this.value;
      if (phone && !validatePhone(phone)) {
        setError('checkoutPhone', 'El teléfono debe tener exactamente 8 dígitos');
      }
    });
  }
  
  // Cerrar modal
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function() {
      if (orderModal) {
        orderModal.style.display = 'none';
      }
      window.location.href = 'index.html';
    });
  }
  
  // Manejar envío del formulario
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      var fullName = document.getElementById('checkoutFullName').value.trim();
      var email = document.getElementById('checkoutEmail').value.trim();
      var phone = document.getElementById('checkoutPhone').value.trim();
      var province = document.getElementById('checkoutProvince').value;
      var district = document.getElementById('checkoutDistrict').value;
      var address = document.getElementById('checkoutAddress').value.trim();
      var paymentMethod = document.getElementById('checkoutPaymentMethod').value;
      var submitBtn = checkoutForm.querySelector('button[type="submit"]');
      
      var isValid = true;
      
      // Validar nombre completo
      if (!fullName) {
        setError('checkoutFullName', 'El nombre completo es requerido');
        isValid = false;
      } else {
        clearError('checkoutFullName');
      }
      
      // Validar correo
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        setError('checkoutEmail', 'El correo electrónico es requerido');
        isValid = false;
      } else if (!emailRegex.test(email)) {
        setError('checkoutEmail', 'Ingresa un correo electrónico válido');
        isValid = false;
      } else {
        clearError('checkoutEmail');
      }
      
      // Validar teléfono
      if (!phone) {
        setError('checkoutPhone', 'El número de teléfono es requerido');
        isValid = false;
      } else if (!validatePhone(phone)) {
        setError('checkoutPhone', 'El teléfono debe tener exactamente 8 dígitos');
        isValid = false;
      } else {
        clearError('checkoutPhone');
      }
      
      // Validar provincia
      if (!province) {
        setError('checkoutProvince', 'Selecciona una provincia');
        isValid = false;
      } else {
        clearError('checkoutProvince');
      }
      
      // Validar distrito
      if (!district) {
        setError('checkoutDistrict', 'Selecciona un distrito');
        isValid = false;
      } else {
        clearError('checkoutDistrict');
      }
      
      // Validar dirección
      if (!address) {
        setError('checkoutAddress', 'La dirección es requerida');
        isValid = false;
      } else if (address.length < 10) {
        setError('checkoutAddress', 'Por favor, proporciona una dirección más detallada');
        isValid = false;
      } else {
        clearError('checkoutAddress');
      }
      
      // Validar método de pago
      if (!paymentMethod) {
        setError('checkoutPaymentMethod', 'Selecciona un método de pago');
        isValid = false;
      } else {
        clearError('checkoutPaymentMethod');
      }
      
      // Si el formulario es válido, procesar el pedido
      if (isValid) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Procesando...';
        
        var cart = getCart();
        var subtotal = cart.reduce(function(sum, item) {
          return sum + (item.price * item.qty);
        }, 0);
        var shipping = calculateShipping(province);
        var total = subtotal + shipping;
        
        // Generar número de pedido único
        var orderNumber = generateOrderNumber();
        
        // Preparar datos del pedido
        var orderData = {
          orderNumber: orderNumber,
          customer: {
            fullName: fullName,
            email: email,
            phone: phone
          },
          shipping: {
            province: province,
            district: district,
            address: address
          },
          payment: {
            method: paymentMethod
          },
          items: cart,
          subtotal: subtotal,
          shipping: shipping,
          total: total,
          status: 'pending',
          createdAt: window.serverTimestamp ? window.serverTimestamp() : new Date().toISOString(),
          userEmail: window.auth && window.auth.currentUser ? window.auth.currentUser.email : null
        };
        
        console.log('Datos del pedido:', orderData);
        
        // Función para completar el pedido (mostrar modal y limpiar carrito)
        function completeOrder() {
          // Limpiar carrito
          localStorage.removeItem(CART_KEY);
          
          // Guardar pedido en localStorage como respaldo
          try {
            var savedOrders = JSON.parse(localStorage.getItem('sportswap_orders') || '[]');
            savedOrders.push({
              orderNumber: orderNumber,
              data: orderData,
              savedAt: new Date().toISOString()
            });
            // Mantener solo los últimos 10 pedidos en localStorage
            if (savedOrders.length > 10) {
              savedOrders = savedOrders.slice(-10);
            }
            localStorage.setItem('sportswap_orders', JSON.stringify(savedOrders));
          } catch (e) {
            console.warn('No se pudo guardar en localStorage:', e);
          }
          
          // Mostrar modal de confirmación
          var orderNumberDisplay = document.getElementById('orderNumberDisplay');
          if (orderNumberDisplay) {
            orderNumberDisplay.textContent = orderNumber;
          }
          
          // Agregar número de pedido al link de delivery
          var deliveryLink = document.getElementById('deliveryLink');
          if (deliveryLink) {
            deliveryLink.href = 'delivery-form.html?order=' + encodeURIComponent(orderNumber);
          }
          
          // Guardar número de pedido en localStorage para uso posterior
          localStorage.setItem('lastOrderNumber', orderNumber);
          
          // Mostrar modal
          if (orderModal) {
            orderModal.style.display = 'flex';
            // Scroll al top de la página para mostrar el modal
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          
          // Restaurar botón
          submitBtn.disabled = false;
          submitBtn.textContent = 'Completar Pedido';
        }
        
        // PRIMERO: Completar el pedido (mostrar número de pedido al usuario)
        // Esto garantiza que el usuario siempre reciba su número de pedido
        completeOrder();
        
        // DESPUÉS: Intentar guardar en Firestore (en segundo plano, sin bloquear)
        // Si Firestore falla, el pedido ya está guardado en localStorage
        if (window.db && window.collection && window.addDoc) {
          // Preparar datos para Firestore
          var firestoreData = {
            orderNumber: orderNumber,
            customer: orderData.customer,
            shipping: orderData.shipping,
            payment: orderData.payment,
            items: orderData.items,
            subtotal: orderData.subtotal,
            shippingCost: orderData.shipping,
            total: orderData.total,
            status: 'pending',
            userEmail: orderData.userEmail
          };
          
          // Agregar timestamp
          // serverTimestamp es una función especial de Firestore que debe pasarse directamente
          if (window.serverTimestamp) {
            try {
              firestoreData.createdAt = window.serverTimestamp();
            } catch (e) {
              // Si falla, usar fecha local
              firestoreData.createdAt = new Date().toISOString();
            }
          } else {
            firestoreData.createdAt = new Date().toISOString();
          }
          
          // Intentar guardar en Firestore de forma asíncrona
          // No bloqueamos si falla, el pedido ya está completado
          setTimeout(function() {
            try {
              var ordersRef = window.collection(window.db, 'orders');
              window.addDoc(ordersRef, firestoreData)
                .then(function(docRef) {
                  console.log('✅ Pedido guardado en Firestore con ID:', docRef.id);
                  // Actualizar pedido en localStorage con el ID de Firestore
                  try {
                    var savedOrders = JSON.parse(localStorage.getItem('sportswap_orders') || '[]');
                    var lastOrder = savedOrders[savedOrders.length - 1];
                    if (lastOrder && lastOrder.orderNumber === orderNumber) {
                      lastOrder.firestoreId = docRef.id;
                      localStorage.setItem('sportswap_orders', JSON.stringify(savedOrders));
                    }
                  } catch (e) {
                    console.warn('No se pudo actualizar localStorage con ID de Firestore:', e);
                  }
                })
                .catch(function(error) {
                  // Error al guardar en Firestore - pero el pedido ya está completado
                  console.warn('⚠️ Error al guardar en Firestore:', error.code, error.message);
                  console.warn('El pedido está guardado en localStorage como respaldo');
                  console.warn('Número de pedido:', orderNumber);
                });
            } catch (error) {
              // Error al intentar usar Firestore
              console.warn('⚠️ Error al intentar usar Firestore:', error);
              console.warn('El pedido está guardado en localStorage como respaldo');
            }
          }, 100); // Pequeño delay para no bloquear la UI
        } else {
          console.warn('⚠️ Firestore no está disponible');
          console.warn('El pedido está guardado en localStorage como respaldo');
        }
      }
    });
  }
});

