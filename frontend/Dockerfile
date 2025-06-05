# Stage 1: Сборка
FROM node:20 as builder

WORKDIR /app

# Устанавливаем зависимости
COPY frontend/package*.json ./
RUN npm install

# Копируем исходники
COPY frontend/ .

# Собираем проект
RUN npm run build

# Stage 2: Сервер (Nginx)
FROM nginx:alpine

# Удаляем дефолтные файлы
RUN rm -rf /usr/share/nginx/html/*

# Копируем билд
COPY --from=builder /app/dist /usr/share/nginx/html

# Открываем порт
EXPOSE 80

# Запуск Nginx
CMD ["nginx", "-g", "daemon off;"]
