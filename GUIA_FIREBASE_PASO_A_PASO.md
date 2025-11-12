# Guía Paso a Paso: Agregar Dominios en Firebase Console

## 📋 Pasos Detallados

### 1. Acceder a Firebase Console
- Abre tu navegador y ve a: https://console.firebase.google.com/
- Inicia sesión con tu cuenta de Google (la misma que usaste para crear el proyecto)

### 2. Seleccionar el Proyecto
- En la lista de proyectos, busca y haz clic en: **briannntech11**

### 3. Ir a Authentication
- En el menú lateral izquierdo, busca y haz clic en: **Authentication** (Autenticación)
- Si es la primera vez, haz clic en **Get started** (Comenzar)

### 4. Acceder a Settings (Configuración)
- Una vez en Authentication, verás varias pestañas en la parte superior
- Haz clic en la pestaña **Settings** (⚙️ Configuración)
- Es la última pestaña del menú

### 5. Encontrar Authorized Domains (Dominios Autorizados)
- Desplázate hacia abajo en la página de Settings
- Busca la sección llamada **Authorized domains** (Dominios autorizados)
- Verás una lista de dominios que actualmente están autorizados

### 6. Agregar los Dominios
- Haz clic en el botón **Add domain** (Agregar dominio)
- Aparecerá un campo de texto
- Ingresa: `127.0.0.1` (sin comillas, sin puerto)
- Haz clic en **Add** (Agregar)
- Repite el proceso para agregar: `localhost`

### 7. Verificar los Dominios Agregados
- Deberías ver una lista similar a esta:
  ```
  briannntech11.firebaseapp.com (por defecto)
  127.0.0.1 (recién agregado)
  localhost (recién agregado)
  ```

### 8. Esperar y Probar
- Espera 1-2 minutos para que los cambios se apliquen
- Vuelve a tu aplicación y recarga la página (F5)
- Intenta iniciar sesión con Google nuevamente

## ⚠️ Notas Importantes

1. **NO incluyas el puerto**: Solo agrega `127.0.0.1` y `localhost`, NO `127.0.0.1:5500`
2. **Los cambios pueden tardar**: A veces toma hasta 5 minutos para que los cambios se reflejen
3. **Recarga la página**: Después de agregar los dominios, recarga completamente tu aplicación
4. **Verifica que estés en el proyecto correcto**: Asegúrate de estar en el proyecto `briannntech11`

## 🔍 Ubicación Visual en Firebase Console

```
Firebase Console
├── Proyecto: briannntech11
├── Authentication (menú lateral)
│   ├── Users
│   ├── Sign-in method
│   └── Settings ⬅️ (aquí)
│       └── Authorized domains ⬅️ (busca esta sección)
│           └── Add domain ⬅️ (botón para agregar)
```

## ❓ ¿Todavía no funciona?

Si después de seguir estos pasos el error persiste:

1. **Verifica que los dominios estén guardados**: Vuelve a Settings y confirma que `127.0.0.1` y `localhost` aparecen en la lista
2. **Espera más tiempo**: A veces puede tardar hasta 10 minutos
3. **Limpia la caché del navegador**: Presiona Ctrl+Shift+Delete y limpia la caché
4. **Verifica que estés usando el proyecto correcto**: Confirma que tu código Firebase está conectado al proyecto `briannntech11`

## 📸 Capturas de Pantalla (Referencia)

- El botón "Add domain" está en la parte inferior de la lista de dominios autorizados
- Los dominios se muestran en una lista con un botón de eliminar (🗑️) a la derecha de cada uno
- Una vez agregados, los nuevos dominios aparecen inmediatamente en la lista

