import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import useTelegram from './hooks/useTelegram'

function App() {
  const { tg } = useTelegram()

  React.useEffect(() => {
    if (tg) {
      tg.ready()
    }
  }, [tg])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
