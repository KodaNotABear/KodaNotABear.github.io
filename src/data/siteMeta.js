import { posts } from './posts.js'
import { projects } from './projects.js'

export const siteUrl = 'https://akuro.studio'

export const defaultMeta = {
  title: 'Ethan Peterson · AKURO STUDIO',
  description:
    'Game programmer and designer. CS graduate, May 2026. Building games with Unity under AKURO STUDIO.',
}

const staticMeta = {
  '/': defaultMeta,
  '/about': {
    title: 'About Ethan Peterson · AKURO STUDIO',
    description:
      'Learn about Ethan Peterson, a CS graduate and game programmer building Unity games and Minecraft mods under AKURO STUDIO.',
  },
  '/portfolio': {
    title: 'Portfolio · AKURO STUDIO',
    description:
      'Game projects and engineering work from Ethan Peterson, including Unity production work, Minecraft mods, and solo prototypes.',
  },
  '/resume': {
    title: 'Resume · Ethan Peterson',
    description:
      'Resume for Ethan Peterson, game programmer and designer with Unity, C#, Java, WebGL, and live-game production experience.',
  },
  '/devlog': {
    title: 'Devlog · AKURO STUDIO',
    description:
      'Development notes from AKURO STUDIO on Unity, game design, Minecraft mods, and solo game projects.',
  },
  '/contact': {
    title: 'Contact · AKURO STUDIO',
    description:
      'Contact Ethan Peterson about full-time game developer roles, collaborations, Minecraft mods, or AKURO STUDIO projects.',
  },
  '/card': {
    title: 'Ethan Peterson · Contact Card',
    description: 'Digital contact card for Ethan Peterson and AKURO STUDIO.',
  },
  '/credits': {
    title: 'Credits · AKURO STUDIO',
    description: 'Credits for AKURO STUDIO and Ethan Peterson.',
  },
}

export function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/'
  return pathname.replace(/\/+$/, '') || '/'
}

export function getRouteMeta(pathname) {
  const path = normalizePath(pathname)
  if (staticMeta[path]) return { ...staticMeta[path], path }

  const projectMatch = path.match(/^\/portfolio\/([^/]+)$/)
  if (projectMatch) {
    const project = projects.find(p => p.id === projectMatch[1])
    if (project) {
      return {
        title: `${project.title} · AKURO STUDIO`,
        description: project.tagline || project.description,
        path,
      }
    }
  }

  const postMatch = path.match(/^\/devlog\/([^/]+)$/)
  if (postMatch) {
    const post = posts.find(p => p.id === postMatch[1])
    if (post) {
      return {
        title: `${post.title} · Devlog · AKURO STUDIO`,
        description: post.excerpt,
        path,
      }
    }
  }

  return {
    title: 'Page Not Found · AKURO STUDIO',
    description:
      'This AKURO STUDIO page could not be found. Return to the portfolio, devlog, resume, or contact page.',
    path,
  }
}

export function getPrerenderRoutes() {
  return [
    '/',
    ...Object.keys(staticMeta).filter(path => path !== '/'),
    ...projects.map(project => `/portfolio/${project.id}`),
    ...posts.map(post => `/devlog/${post.id}`),
  ]
}
