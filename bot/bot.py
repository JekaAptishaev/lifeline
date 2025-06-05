import logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import Message
import os
import requests
from datetime import datetime, timedelta

# Настройка логгирования
logging.basicConfig(level=logging.INFO)

# Инициализация бота
API_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')  # Установите в .env или в env
BACKEND_URL = os.getenv('BACKEND_URL', 'http://localhost:8080/api')

bot = Bot(token=API_TOKEN)
dp = Dispatcher()

# Приветственное сообщение
@dp.message(Command("start"))
async def send_welcome(message: Message):
    await message.answer(
        "Привет! Я Lifeline Bot.\n"
        "Я помогу тебе не забыть о дедлайнах и важных событиях!\n"
        "Используй /tasks — чтобы посмотреть задачи\n"
        "/events — чтобы узнать о событиях ВУЗа"
    )

# Показать задачи пользователя
@dp.message(Command("tasks"))
async def show_tasks(message: Message):
    user_id = message.from_user.id
    response = requests.get(f"{BACKEND_URL}/tasks?telegram_id={user_id}")

    if response.status_code == 200:
        tasks = response.json()
        if not tasks:
            await message.answer("У тебя нет активных задач.")
            return

        msg = "📅 Твои задачи:\n"
        for task in tasks:
            due_date = datetime.fromisoformat(task['due_date']).strftime('%d.%m %H:%M')
            msg += f"• {task['title']} — до {due_date}\n"

        await message.answer(msg)
    else:
        await message.answer("Ошибка при загрузке задач.")

# Показать события ВУЗа
@dp.message(Command("events"))
async def show_events(message: Message):
    user_id = message.from_user.id
    response = requests.get(f"{BACKEND_URL}/events?telegram_id={user_id}")

    if response.status_code == 200:
        events = response.json()
        if not events:
            await message.answer("Нет запланированных событий.")
            return

        msg = "📌 События ВУЗа:\n"
        for event in events:
            date = datetime.fromisoformat(event['date']).strftime('%d.%m %H:%M')
            msg += f"• {event['name']} — {date} — {event['location']}\n"

        await message.answer(msg)
    else:
        await message.answer("Ошибка при загрузке событий.")

# Рассылка напоминаний
async def send_deadline_reminders(bot: Bot):
    response = requests.get(f"{BACKEND_URL}/tasks/upcoming")
    if response.status_code != 200:
        return

    tasks = response.json()
    for task in tasks:
        user_id = task['user_id']
        message_text = f"⏳ Напоминание!\nЗадача '{task['title']}' должна быть выполнена сегодня!"
        try:
            await bot.send_message(user_id, message_text)
        except Exception as e:
            logging.error(f"Не удалось отправить сообщение пользователю {user_id}: {e}")

# Запуск бота
async def main():
    await dp.start_polling(bot)

if __name__ == '__main__':
    import asyncio
    asyncio.run(main())
