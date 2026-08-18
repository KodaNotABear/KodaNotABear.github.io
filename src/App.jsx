import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import ScrollToTop from './components/ScrollToTop'
import KeyboardShortcuts from './components/KeyboardShortcuts'
import PageMeta from './components/PageMeta'
import MiniGame from './components/MiniGame'
import BlackSignalGlitch from './components/BlackSignalGlitch'
import TextAdventure from './components/TextAdventure'
import MobileEasterEggs from './components/MobileEasterEggs'
import Home from './pages/Home'
import About from './pages/About'
import Portfolio from './pages/Portfolio'
import Project from './pages/Project'
import Resume from './pages/Resume'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Contact from './pages/Contact'
import Card from './pages/Card'
import Credits from './pages/Credits'
import NotFound from './pages/NotFound'

// Markdown drafting editor, dev server only — the false branch is dead code
// in production builds, so the page and its route never ship.
const Editor = import.meta.env.DEV ? lazy(() => import('./pages/Editor')) : null

// AnimatedRoutes must live inside BrowserRouter so useLocation works
function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:id" element={<Project />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/devlog" element={<Blog />} />
        <Route path="/devlog/:id" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/card" element={<Card />} />
        <Route path="/credits" element={<Credits />} />
        {Editor && (
          <Route path="/editor" element={<Suspense fallback={null}><Editor /></Suspense>} />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

// Layout hides chrome on the /card route so it shows as a clean standalone page
function Layout() {
  const location = useLocation()
  const normalizedPath = location.pathname.replace(/\/+$/, '') || '/'
  const isCard = normalizedPath === '/card'
  return (
    <>
      {!isCard && (
        <>
          <ScrollProgress />
          <KeyboardShortcuts />
          <MiniGame />
          <BlackSignalGlitch />
          <TextAdventure />
          <MobileEasterEggs />
          <Navbar />
        </>
      )}
      <AnimatedRoutes />
      {!isCard && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <PageMeta />
      <ScrollToTop />
      <Layout />
    </BrowserRouter>
  )
}
