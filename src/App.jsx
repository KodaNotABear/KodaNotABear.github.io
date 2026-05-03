import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import KonamiCode from './components/KonamiCode'
import ScrollProgress from './components/ScrollProgress'
import KeyboardShortcuts from './components/KeyboardShortcuts'
import MiniGame from './components/MiniGame'
import D20Roller from './components/D20Roller'
import DestinyGhost from './components/DestinyGhost'
import BlackSignalGlitch from './components/BlackSignalGlitch'
import TextAdventure from './components/TextAdventure'
import MobileEasterEggs from './components/MobileEasterEggs'
import Home from './pages/Home'
import About from './pages/About'
import Portfolio from './pages/Portfolio'
import Resume from './pages/Resume'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Contact from './pages/Contact'
import Credits from './pages/Credits'
import Card from './pages/Card'
import NotFound from './pages/NotFound'

// AnimatedRoutes must live inside BrowserRouter so useLocation works
function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/devlog" element={<Blog />} />
        <Route path="/devlog/:id" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/card" element={<Card />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

// Layout hides chrome on the /card route so it shows as a clean standalone page
function Layout() {
  const location = useLocation()
  const isCard = location.pathname === '/card'
  return (
    <>
      {!isCard && <Navbar />}
      <AnimatedRoutes />
      {!isCard && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollProgress />
      <KonamiCode />
      <KeyboardShortcuts />
      <MiniGame />
      <D20Roller />
      <DestinyGhost />
      <BlackSignalGlitch />
      <TextAdventure />
      <MobileEasterEggs />
      <Layout />
    </BrowserRouter>
  )
}
