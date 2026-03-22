import './index.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Courses from './components/Courses'
import Footer from './components/Footer'

function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <Hero />
      <Courses />
      <Footer />
    </div>
  )
}

export default App
