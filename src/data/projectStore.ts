import { useSyncExternalStore } from 'react'
import { projects as defaults, type Project } from './projects'

/**
 * Project store: the defaults live in projects.ts; edits made in /admin are saved
 * in this browser's localStorage and override the defaults. (No server — see README.)
 */
const KEY = 'srikar.projects.v1'
const listeners = new Set<() => void>()
let cache: Project[] | null = null

function read(): Project[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed as Project[]
    }
  } catch {
    /* storage blocked or corrupt → defaults */
  }
  return defaults
}

export const getProjects = (): Project[] => (cache ??= read())

export function saveProjects(next: Project[]) {
  cache = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* ignore quota/blocked */
  }
  listeners.forEach((l) => l())
}

export function resetProjects() {
  cache = defaults
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l())
}

export const isCustomised = () => {
  try {
    return localStorage.getItem(KEY) !== null
  } catch {
    return false
  }
}

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export const useProjects = () => useSyncExternalStore(subscribe, getProjects, () => defaults)
