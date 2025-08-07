'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          })

          console.log('Service Worker registered successfully:', registration)

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available
                  console.log('New service worker available')
                  
                  // Optionally show update notification
                  if (confirm('A new version is available. Reload to update?')) {
                    window.location.reload()
                  }
                }
              })
            }
          })

          // Handle service worker updates
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('Service Worker controller changed')
          })

        } catch (error) {
          console.error('Service Worker registration failed:', error)
        }
      }

      registerSW()
    }
  }, [])

  return null
}

// Hook for service worker functionality
export const useServiceWorker = () => {
  const sendMessage = async (message: any) => {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(message)
    }
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }

  const subscribeToPushNotifications = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        })
        
        console.log('Push notification subscription:', subscription)
        return subscription
      } catch (error) {
        console.error('Failed to subscribe to push notifications:', error)
        return null
      }
    }
    return null
  }

  const checkForUpdates = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        await registration.update()
      }
    }
  }

  return {
    sendMessage,
    requestNotificationPermission,
    subscribeToPushNotifications,
    checkForUpdates
  }
}
