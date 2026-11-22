
## Contraseña temporal

El registro ya no pide contraseña: el sistema envía una temporal al correo. En el primer inicio de sesión `LoginPage` redirige a `/cambiar-contrasena` (`CambiarContrasenaPage`) y `App.tsx` bloquea el resto de rutas mientras `debeCambiarContrasena` sea verdadero.
