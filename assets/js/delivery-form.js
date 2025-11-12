// Datos de provincias y distritos de Panamá
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

// Función para mostrar errores
function setError(fieldName, msg) {
  var span = document.querySelector('.error[data-for="' + fieldName + '"]');
  if (span) span.textContent = msg;
}

// Función para limpiar errores
function clearError(fieldName) {
  setError(fieldName, '');
}

// Cargar distritos según la provincia seleccionada
function loadDistricts(province) {
  var districtSelect = document.getElementById('district');
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

// Autocompletar datos del usuario si está logueado
function autoFillUserData(user) {
  if (!user) return;
  
  var emailInput = document.getElementById('email');
  var usernameInput = document.getElementById('username');
  
  if (emailInput && user.email) {
    emailInput.value = user.email;
  }
  
  if (usernameInput) {
    if (user.displayName) {
      usernameInput.value = user.displayName;
    } else if (user.email) {
      usernameInput.value = user.email.split('@')[0];
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  var deliveryForm = document.getElementById('deliveryForm');
  var provinceSelect = document.getElementById('province');
  var districtSelect = document.getElementById('district');
  var phoneInput = document.getElementById('phone');
  
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
  
  // Cargar número de pedido desde URL o localStorage
  var orderNumberInput = document.getElementById('orderNumber');
  if (orderNumberInput) {
    var urlParams = new URLSearchParams(window.location.search);
    var orderFromUrl = urlParams.get('order');
    var orderFromStorage = localStorage.getItem('lastOrderNumber');
    
    if (orderFromUrl) {
      orderNumberInput.value = orderFromUrl;
    } else if (orderFromStorage) {
      orderNumberInput.value = orderFromStorage;
    }
  }
  
  // Manejar cambio de provincia
  if (provinceSelect) {
    provinceSelect.addEventListener('change', function() {
      var province = this.value;
      loadDistricts(province);
      clearError('province');
      clearError('district');
    });
  }
  
  // Validar teléfono en tiempo real
  if (phoneInput) {
    phoneInput.addEventListener('input', function() {
      var phone = this.value.replace(/\D/g, ''); // Solo números
      this.value = phone; // Actualizar el valor sin caracteres no numéricos
      
      if (phone.length > 0 && !validatePhone(phone)) {
        setError('phone', 'El teléfono debe tener exactamente 8 dígitos');
      } else {
        clearError('phone');
      }
    });
    
    phoneInput.addEventListener('blur', function() {
      var phone = this.value;
      if (phone && !validatePhone(phone)) {
        setError('phone', 'El teléfono debe tener exactamente 8 dígitos');
      }
    });
  }
  
  // Validar formulario antes de enviar
  if (deliveryForm) {
    deliveryForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      var fullName = document.getElementById('fullName').value.trim();
      var email = document.getElementById('email').value.trim();
      var phone = document.getElementById('phone').value.trim();
      var province = document.getElementById('province').value;
      var district = document.getElementById('district').value;
      var orderNumber = document.getElementById('orderNumber').value.trim();
      var paymentMethod = document.getElementById('paymentMethod').value;
      
      var isValid = true;
      
      // Validar nombre completo
      if (!fullName) {
        setError('fullName', 'El nombre completo es requerido');
        isValid = false;
      } else {
        clearError('fullName');
      }
      
      // Validar correo
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        setError('email', 'El correo electrónico es requerido');
        isValid = false;
      } else if (!emailRegex.test(email)) {
        setError('email', 'Ingresa un correo electrónico válido');
        isValid = false;
      } else {
        clearError('email');
      }
      
      // Validar teléfono
      if (!phone) {
        setError('phone', 'El número de teléfono es requerido');
        isValid = false;
      } else if (!validatePhone(phone)) {
        setError('phone', 'El teléfono debe tener exactamente 8 dígitos');
        isValid = false;
      } else {
        clearError('phone');
      }
      
      // Validar provincia
      if (!province) {
        setError('province', 'Selecciona una provincia');
        isValid = false;
      } else {
        clearError('province');
      }
      
      // Validar distrito
      if (!district) {
        setError('district', 'Selecciona un distrito');
        isValid = false;
      } else {
        clearError('district');
      }
      
      // Validar número de pedido
      if (!orderNumber) {
        setError('orderNumber', 'El número de pedido es requerido');
        isValid = false;
      } else {
        clearError('orderNumber');
      }
      
      // Validar método de pago
      if (!paymentMethod) {
        setError('paymentMethod', 'Selecciona un método de pago');
        isValid = false;
      } else {
        clearError('paymentMethod');
      }
      
      // Si el formulario es válido, procesar el envío
      if (isValid) {
        var submitBtn = deliveryForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Procesando...';
        
        // Simular envío (aquí puedes agregar la lógica para enviar a Firebase o tu backend)
        var formData = {
          fullName: fullName,
          username: document.getElementById('username').value.trim(),
          email: email,
          phone: phone,
          province: province,
          district: district,
          orderNumber: orderNumber,
          paymentMethod: paymentMethod,
          timestamp: new Date().toISOString()
        };
        
        console.log('Datos del formulario:', formData);
        
        // Simular delay de procesamiento
        setTimeout(function() {
          alert('¡Delivery apartado exitosamente!\n\nTu pedido ha sido registrado. Te contactaremos pronto para confirmar los detalles del envío.');
          
          // Limpiar formulario
          deliveryForm.reset();
          districtSelect.disabled = true;
          districtSelect.innerHTML = '<option value="">Primero selecciona una provincia</option>';
          
          // Restaurar botón
          submitBtn.disabled = false;
          submitBtn.textContent = 'Apartar Delivery';
          
          // Opcional: redirigir a otra página
          // window.location.href = 'delivery.html';
        }, 1000);
      }
    });
  }
});

