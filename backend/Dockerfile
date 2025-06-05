# Используем официальный образ Go
FROM golang:1.24.2 as builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем go.mod и go.sum
COPY go.mod .
COPY go.sum .

# Загружаем зависимости
RUN go mod download

# Копируем исходный код
COPY . .

# Собираем бинарник
RUN CGO_ENABLED=0 GOOS=linux go build -o /lifeline-backend

# Финальный образ
FROM gcr.io/distroless/static-debian12

# Копируем бинарник из builder
COPY --from=builder /lifeline-backend /lifeline-backend

# Открываем порт
EXPOSE 8080

# Запускаем приложение
ENTRYPOINT ["/lifeline-backend"]
