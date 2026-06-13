import { useState, useCallback } from 'react'

export function useAchievement() {
  const [toast, setToast] = useState(null)

  const unlock = useCallback((title, desc) => {
    setToast({ title, desc, key: Date.now() })
    setTimeout(() => setToast(null), 3500)
  }, [])

  return { toast, unlock }
}
