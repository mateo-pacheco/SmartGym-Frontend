// Configuración en tiempo de ejecución.
// En desarrollo queda vacío: se usan las variables de .env.local vía Vite.
// En producción, el contenedor Docker sobrescribe este archivo al arrancar
// con los valores de las variables de entorno (ver docker/40-app-config.sh).
window.__APP_CONFIG__ = {};
