# Базовый образ
FROM python:3.11-slim

# Рабочая директория
WORKDIR /app

# Копируем requirements.txt
COPY bot/requirements.txt .

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем исходники
COPY bot/bot.py .

# Команда запуска
CMD ["python", "bot.py"]
