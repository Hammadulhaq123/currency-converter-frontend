import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Currencies from './pages/Currencies'
import AppLayout from './layout/AppLayout'

function App() {

  return (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path='/login' element={<Login/>} />
    <Route path='/currencies' element={<AppLayout children={<Currencies/>} />} />

  </Routes>
  )
}

export default App
