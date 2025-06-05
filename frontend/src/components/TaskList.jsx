import React, { useState } from 'react'

const API_URL = 'http://localhost:8080/api'

const TaskList = ({ tasks, setTasks }) => {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')

  const addTask = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, due_date: dueDate })
    })

    if (res.ok) {
      const newTask = await res.json()
      setTasks([...tasks, newTask])
    }
  }

  return (
    <div className="task-list">
      <div className="add-task">
        <input
          type="text"
          placeholder="Название задачи"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button onClick={addTask}>Добавить</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} — {new Date(task.due_date).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TaskList
