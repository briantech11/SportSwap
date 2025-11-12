// Función para mostrar errores
function setError(fieldName, msg) {
  var span = document.querySelector('.error[data-for="' + fieldName + '"]');
  if (span) span.textContent = msg;
}

// Función para limpiar errores
function clearError(fieldName) {
  setError(fieldName, '');
}

// Manejar calificación con estrellas
function initRatingStars() {
  var stars = document.querySelectorAll('.rating-star');
  var ratingInput = document.getElementById('feedbackRating');
  var selectedRating = 0;

  stars.forEach(function(star, index) {
    star.addEventListener('click', function() {
      selectedRating = parseInt(this.getAttribute('data-rating'));
      ratingInput.value = selectedRating;
      clearError('feedbackRating');
      updateStars(selectedRating);
    });

    star.addEventListener('mouseenter', function() {
      var hoverRating = parseInt(this.getAttribute('data-rating'));
      updateStars(hoverRating);
    });
  });

  var ratingContainer = document.getElementById('ratingStars');
  if (ratingContainer) {
    ratingContainer.addEventListener('mouseleave', function() {
      updateStars(selectedRating);
    });
  }

  function updateStars(rating) {
    stars.forEach(function(star, index) {
      var starRating = parseInt(star.getAttribute('data-rating'));
      if (starRating <= rating) {
        star.style.opacity = '1';
        star.style.color = '#FFB400';
        star.style.filter = 'drop-shadow(0 0 8px rgba(255, 180, 0, 0.8))';
        star.style.transform = 'scale(1.2)';
      } else {
        star.style.opacity = '0.3';
        star.style.color = '#666';
        star.style.filter = 'none';
        star.style.transform = 'scale(1)';
      }
    });
  }
}

// Autocompletar nombre si el usuario está logueado
function autoFillUserData(user) {
  if (!user) return;

  var nameInput = document.getElementById('feedbackName');

  if (nameInput) {
    if (user.displayName) {
      nameInput.value = user.displayName;
    } else if (user.email) {
      // Usar la parte antes del @ del email como nombre por defecto
      nameInput.value = user.email.split('@')[0];
    }
  }
}

// Validar y limitar caracteres del comentario
function initCommentValidation() {
  var commentTextarea = document.getElementById('feedbackComment');
  if (!commentTextarea) return;

  var maxLength = 500;
  var minLength = 10;
  var charCount = document.getElementById('charCount');

  // Actualizar contador inicial
  if (charCount) {
    charCount.textContent = '0/' + maxLength + ' caracteres';
  }

  commentTextarea.addEventListener('input', function() {
    var currentLength = this.value.length;
    
    // El maxlength ya limita, pero por seguridad verificamos
    if (currentLength > maxLength) {
      this.value = this.value.substring(0, maxLength);
      currentLength = maxLength;
    }

    // Actualizar contador de caracteres
    if (charCount) {
      charCount.textContent = currentLength + '/' + maxLength + ' caracteres';
      
      // Cambiar color cuando se acerca al límite
      if (currentLength > maxLength * 0.9) {
        charCount.classList.add('text-red-400');
        charCount.classList.remove('text-gray-500');
      } else if (currentLength >= minLength) {
        charCount.classList.remove('text-red-400');
        charCount.classList.add('text-green-400');
      } else {
        charCount.classList.remove('text-red-400', 'text-green-400');
        charCount.classList.add('text-gray-500');
      }
    }

    // Validar en tiempo real (solo mostrar error si ya ha escrito algo)
    if (currentLength > 0 && currentLength < minLength) {
      setError('feedbackComment', 'Por favor, escribe al menos 10 caracteres');
    } else {
      clearError('feedbackComment');
    }
  });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  var feedbackForm = document.getElementById('feedbackForm');
  
  // Inicializar calificación con estrellas
  initRatingStars();
  
  // Inicializar validación de comentario
  initCommentValidation();
  
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

  // Manejar envío del formulario
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', function(e) {
      e.preventDefault();

      var name = document.getElementById('feedbackName').value.trim();
      var orderNumber = document.getElementById('feedbackOrder').value.trim();
      var rating = document.getElementById('feedbackRating').value;
      var comment = document.getElementById('feedbackComment').value.trim();
      var submitBtn = feedbackForm.querySelector('button[type="submit"]');

      var isValid = true;

      // Validar calificación
      if (!rating || rating === '') {
        setError('feedbackRating', 'Por favor, selecciona una calificación');
        isValid = false;
      } else {
        clearError('feedbackRating');
      }

      // Validar comentario
      if (!comment) {
        setError('feedbackComment', 'Por favor, escribe tu reseña');
        isValid = false;
      } else if (comment.length < 10) {
        setError('feedbackComment', 'Por favor, escribe al menos 10 caracteres');
        isValid = false;
      } else if (comment.length > 500) {
        setError('feedbackComment', 'El comentario no puede exceder 500 caracteres');
        isValid = false;
      } else {
        clearError('feedbackComment');
      }

      // Si el formulario es válido, procesar el envío
      if (isValid) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        // Simular envío (aquí puedes agregar la lógica para enviar a Firebase o tu backend)
        var feedbackData = {
          name: name || 'Anónimo',
          orderNumber: orderNumber || 'N/A',
          rating: parseInt(rating),
          comment: comment,
          timestamp: new Date().toISOString(),
          userEmail: window.auth && window.auth.currentUser ? window.auth.currentUser.email : null
        };

        console.log('Datos del feedback:', feedbackData);

        // Simular delay de procesamiento
        setTimeout(function() {
          alert('¡Gracias por tu feedback!\n\nTu reseña ha sido enviada exitosamente. Valoramos tu opinión y nos ayuda a mejorar nuestro servicio.');

          // Limpiar formulario
          feedbackForm.reset();
          document.getElementById('feedbackRating').value = '';
          
          // Resetear estrellas
          var stars = document.querySelectorAll('.rating-star');
          stars.forEach(function(star) {
            star.style.opacity = '0.5';
            star.style.color = '';
            star.style.filter = 'none';
            star.style.transform = 'scale(1)';
          });

          // Resetear contador de caracteres
          var charCount = document.getElementById('charCount');
          if (charCount) {
            charCount.textContent = '0/500 caracteres';
            charCount.classList.remove('text-red-400', 'text-green-400');
            charCount.classList.add('text-gray-500');
          }

          // Limpiar errores
          clearError('feedbackRating');
          clearError('feedbackComment');
          clearError('feedbackName');
          clearError('feedbackOrder');

          // Restaurar botón
          submitBtn.disabled = false;
          submitBtn.textContent = 'Enviar Reseña';

          // Opcional: recargar datos del usuario si está logueado
          if (window.auth && window.auth.currentUser) {
            autoFillUserData(window.auth.currentUser);
          }
        }, 1000);
      }
    });
  }
});

