import React, { useState } from 'react'

const API_URL = 'http://localhost:8080/api'

const EventList = ({ events, setEvents }) => {
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')

  const addEvent = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, date, location })
    })

    if (res.ok) {
      const newEvent = await res.json()
      setEvents([...events, newEvent])
    }
  }

  return (
    <div className="event-list">
      <div className="add-event">
        <input
          type="text"
          placeholder="Название события"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Место проведения"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button onClick={addEvent}>Добавить событие</button>
      </div>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            {event.name} — {new Date(event.date).toLocaleString()} — {event.location}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EventList
