import React, { useEffect, useState } from 'react'
import TaskList from './TaskList'
import EventList from './EventList'

const API_URL = 'http://localhost:8080/api'

const Dashboard = () => {
  const [tasks, setTasks] = useState([])
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      const tasksRes = await fetch(`${API_URL}/tasks`, { headers })
      const eventsRes = await fetch(`${API_URL}/events`, { headers })

      if (tasksRes.ok && eventsRes.ok) {
        setTasks(await tasksRes.json())
        setEvents(await eventsRes.json())
      }
    }

    fetchData()
  }, [])

  return (
    <div className="dashboard">
      <h1>Добро пожаловать в Lifeline</h1>
      <section>
        <h2>Ваши задачи</h2>
        <TaskList tasks={tasks} setTasks={setTasks} />
      </section>
      <section>
        <h2>События ВУЗа</h2>
        <EventList events={events} setEvents={setEvents} />
      </section>
    </div>
  )
}

export default Dashboard
