# Estágio de Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copia os arquivos de definição de pacotes do monorepo
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/shared/package*.json ./packages/shared/

# Instala todas as dependências (incluindo as de desenvolvimento para o build)
RUN npm ci

# Copia o código fonte de tudo
COPY . .

# Compila o pacote compartilhado e a API
RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=apps/api

# Estágio de Produção
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copia as definições e instala apenas dependências de produção
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/shared/package*.json ./packages/shared/
RUN npm ci --omit=dev

# Copia os arquivos compilados do estágio anterior
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/apps/api/dist ./apps/api/dist

EXPOSE 3001
ENV PORT=3001

# Comando para rodar a API de dentro do workspace
CMD ["npm", "start", "--workspace=apps/api"]