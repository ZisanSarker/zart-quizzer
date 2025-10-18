'use client'

import { clearAuthCache } from '@/lib/auth'

/**
 * Clear all client-side session artifacts: in-memory, browser caches, SW caches
 */
export async function clearClientSession(): Promise<void> {
  try {
    // 1) Clear in-memory auth cache
    clearAuthCache()

    // 2) Clear any app-specific storages if used in future
    try { localStorage.removeItem('zq:lastRoute') } catch {}
    try { sessionStorage.removeItem('zq:tmp') } catch {}

    // 3) Inform service worker to drop dynamic caches
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration()
      const controller = navigator.serviceWorker.controller
      if (controller) {
        controller.postMessage({ type: 'CLEAR_AUTH_CACHE' })
      } else if (registration?.active) {
        registration.active.postMessage({ type: 'CLEAR_AUTH_CACHE' })
      }
    }

    // 4) Attempt to clear Cache Storage directly (best-effort)
    if (typeof caches !== 'undefined') {
      const keys = await caches.keys()
      await Promise.all(
        keys
          .filter((k) => /dynamic|static|zart-quizzer/i.test(k))
          .map((k) => caches.delete(k))
      )
    }
  } catch {
    // best-effort; ignore failures
  }
}
