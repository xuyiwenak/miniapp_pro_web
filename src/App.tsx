import { useState } from 'react'
import './index.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Courses from './components/Courses'
import Footer from './components/Footer'
import LoginPage from './pages/LoginPage'

function App() {
  const [page, setPage] = useState<'home' | 'login'>('home')

  if (page === 'login') {
    return <LoginPage onBack={() => setPage('home')} />
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar onLoginClick={() => setPage('login')} />
      <Hero />
      <Courses />
      <Footer />
    </div>
  )
}

export default App
