import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import LoginPage from './LoginPage'

export default function HomePage() {
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(false)

  if (showLogin) {
    return <LoginPage onBack={() => setShowLogin(false)} onLoginSuccess={() => navigate('/')} />
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar onLoginClick={() => setShowLogin(true)} />
      <Hero />
      <Footer />
    </div>
  )
}
