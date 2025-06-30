# Etapa de construcción
FROM node:22-alpine AS builder

WORKDIR /app

# 1. Copia archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# 2. Instala TODAS las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# 3. Instala SOLO el CLI de Nest globalmente para el build
RUN npm install -g @nestjs/cli

# 4. Genera el cliente de Prisma
RUN npx prisma generate

# 5. Copia el resto de los archivos
COPY . .

# 6. Compila la aplicación
RUN nest build

RUN npm uninstall -g @nestjs/cli

# Etapa de producción
FROM node:22-alpine

WORKDIR /app

# Copia solo lo necesario desde la etapa de builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Variables de entorno
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE $PORT

# Configuración de seguridad
RUN chown -R node:node /app
USER node

# Comando para ejecutar la aplicación
CMD ["sh", "-c", "node dist/src/main"]