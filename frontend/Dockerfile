FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Запуск Vite с флагом --host для доступа извне
CMD ["npm", "run", "dev", "--", "--host"]