# Solución: Error Firebase auth/unauthorized-domain

## Problema
El error `auth/unauthorized-domain` ocurre cuando intentas iniciar sesión con Google desde `127.0.0.1:5500` (servidor local) porque Firebase no tiene autorizado ese dominio.

## Solución

### Paso 1: Accede a Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **briannntech11**

### Paso 2: Configura los dominios autorizados
1. En el menú lateral, ve a **Authentication** (Autenticación)
2. Haz clic en la pestaña **Settings** (Configuración)
3. Desplázate hasta la sección **Authorized domains** (Dominios autorizados)
4. Haz clic en **Add domain** (Agregar dominio)
5. Agrega los siguientes dominios uno por uno:
   - `127.0.0.1`
   - `localhost`
   - `127.0.0.1:5500` (si es necesario)

### Paso 3: Verifica la configuración
- Los dominios que deberías ver en la lista son:
  - `briannntech11.firebaseapp.com` (ya incluido por defecto)
  - `127.0.0.1` (agregado)
  - `localhost` (agregado)

### Paso 4: Prueba de nuevo
1. Recarga tu aplicación en el navegador
2. Intenta iniciar sesión con Google nuevamente
3. El error debería desaparecer

## Notas importantes
- Los cambios en Firebase Console pueden tardar unos minutos en aplicarse
- Asegúrate de que el puerto (5500) coincida con el que estás usando en tu servidor local
- Para producción, asegúrate de agregar tu dominio de producción también

## Alternativa: Usar localhost en lugar de 127.0.0.1
Si prefieres, puedes cambiar tu servidor local para usar `localhost` en lugar de `127.0.0.1`. Ambos deberían funcionar si ambos están autorizados en Firebase.

