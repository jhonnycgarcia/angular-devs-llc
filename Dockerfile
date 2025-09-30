# Etapa 1: Build de la aplicación
FROM node:20-alpine AS builder

# Crear grupo y usuario para el build
RUN addgroup -g 1001 -S nodejs && \
    adduser -S angular -u 1001

# Establecer directorio de trabajo
WORKDIR /app

# Cambiar propietario del directorio de trabajo
RUN chown -R angular:nodejs /app

# Cambiar al usuario no-root
USER angular

# Copiar archivos de configuración de dependencias
COPY --chown=angular:nodejs package*.json ./

# Instalar dependencias
RUN npm install --no-audit --no-fund

# Copiar código fuente
COPY --chown=angular:nodejs . .

# Build de producción
RUN npm run build --prod

# Etapa 2: Servir con nginx
FROM nginx:1.25-alpine AS runner

# Instalar shadow para herramientas de usuario
RUN apk add --no-cache shadow

# Crear grupo y usuario no-root para nginx
RUN addgroup -g 1001 -S nodejs && \
    adduser -S angular -u 1001 -G nodejs

# Copiar archivos de build a nginx
COPY --from=builder --chown=angular:nodejs /app/dist/devs-llc-angular-project/browser /usr/share/nginx/html

# Copiar configuración de nginx personalizada
COPY --chown=angular:nodejs nginx.conf /etc/nginx/nginx.conf

# Cambiar propietario de los directorios de nginx
RUN chown -R angular:nodejs /var/cache/nginx && \
    chown -R angular:nodejs /var/log/nginx && \
    chown -R angular:nodejs /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown angular:nodejs /var/run/nginx.pid

# Cambiar al usuario no-root
USER angular

# Exponer puerto 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
