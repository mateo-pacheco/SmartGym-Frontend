# ---------- Etapa de build ----------
FROM node:20-alpine AS build
WORKDIR /app

# Instala dependencias con la lockfile (build reproducible).
COPY package.json package-lock.json ./
RUN npm ci

# Compila la app. No se pasan variables VITE_*: la configuración (API,
# Supabase) se inyecta en tiempo de ejecución desde el contenedor, no en
# el build, para que una misma imagen sirva en cualquier entorno.
COPY . .
RUN npm run build

# ---------- Etapa de servicio ----------
FROM nginx:1.27-alpine

# Plantilla de nginx: el entrypoint oficial reemplaza ${PORT} al arrancar.
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Genera /config.js desde variables de entorno antes de iniciar nginx.
COPY docker/40-app-config.sh /docker-entrypoint.d/40-app-config.sh
RUN chmod +x /docker-entrypoint.d/40-app-config.sh

# App compilada.
COPY --from=build /app/dist /usr/share/nginx/html

# Puerto por defecto; Railway/compose lo sobrescriben con su propio PORT.
ENV PORT=80
EXPOSE 80

# Se usa el ENTRYPOINT/CMD por defecto de la imagen nginx, que procesa las
# plantillas y ejecuta los scripts de /docker-entrypoint.d antes de arrancar.
