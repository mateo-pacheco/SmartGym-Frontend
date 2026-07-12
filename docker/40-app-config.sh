#!/bin/sh
# Genera la configuración de runtime del frontend desde variables de entorno.
# Lo ejecuta el entrypoint de la imagen nginx (carpeta /docker-entrypoint.d)
# antes de arrancar el servidor. Así una misma imagen sirve en cualquier
# entorno: los valores se leen al iniciar el contenedor, no en el build.
set -e

CONFIG_FILE="/usr/share/nginx/html/config.js"

cat > "$CONFIG_FILE" <<EOF
window.__APP_CONFIG__ = {
  VITE_SMARTGYM_API_URL: "${VITE_SMARTGYM_API_URL:-}",
  VITE_SUPABASE_URL: "${VITE_SUPABASE_URL:-}",
  VITE_SUPABASE_ANON_KEY: "${VITE_SUPABASE_ANON_KEY:-}"
};
EOF

echo "[app-config] config.js generado — API=${VITE_SMARTGYM_API_URL:-<sin definir>}"
