const CACHE_NAME = 'zart-quizzer-v2'
const STATIC_CACHE = 'static-v2'
const DYNAMIC_CACHE = 'dynamic-v2'

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/explore',
  '/login',
  '/register',
  '/placeholder-logo.png',
  '/placeholder-user.jpg',
  '/placeholder-logo.svg',
  '/placeholder.svg',
  '/placeholder.jpg',
  '/Error 404.json',
  '/Exams.json',
  '/Hacker Using Laptop.json',
  '/Product Promotion.json',
  '/business-ideas.json'
]

// Install event - cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files')
        return cache.addAll(STATIC_FILES)
      })
      .catch((error) => {
        console.log('Cache install failed:', error)
      })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Handle API requests
  // Never cache API requests to avoid stale authenticated data
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request).catch(async () => {
      // If offline, try best-effort cache match, but don't populate cache
      const cache = await caches.open(DYNAMIC_CACHE)
      const cached = await cache.match(request)
      return (
        cached || new Response(
          JSON.stringify({ error: 'Offline - Please check your connection' }),
          { status: 503, statusText: 'Service Unavailable', headers: { 'Content-Type': 'application/json' } }
        )
      )
    }))
    return
  }

  // Handle static assets
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request))
    return
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    // Do not cache navigations to avoid serving stale authenticated pages
    event.respondWith(
      fetch(request).catch(async () => {
        // Fallback to cached root page if offline
        const cache = await caches.open(STATIC_CACHE)
        return (await cache.match('/')) || Response.error()
      })
    )
    return
  }

  // Default: network first, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone()
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        return caches.match(request)
      })
  )
})

// Handle API requests with caching
// Deprecated: API responses are no longer cached to ensure instant logout correctness
async function handleApiRequest() { /* no-op */ }

// Handle static assets
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const response = await fetch(request)
    if (response.status === 200) {
      const responseClone = response.clone()
      cache.put(request, responseClone)
    }
    return response
  } catch (error) {
    return new Response('Asset not available offline', { status: 404 })
  }
}

// Handle navigation requests
async function handleNavigation() { /* no-op, handled inline above */ }

// Check if request is for a static asset
function isStaticAsset(request) {
  const url = new URL(request.url)
  return (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.gif') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.ttf') ||
    url.pathname.endsWith('.eot')
  )
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Handle any pending offline actions
  console.log('Performing background sync')
}

// Push notifications (if needed)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New quiz available!',
    icon: '/placeholder-logo.png',
    badge: '/placeholder-logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore Quizzes',
        icon: '/placeholder-logo.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/placeholder-logo.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('ZART Quizzer', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/explore')
    )
  } else {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Receive messages from client to clear caches on logout
self.addEventListener('message', (event) => {
  const data = event.data || {}
  if (data.type === 'CLEAR_AUTH_CACHE' || data.type === 'CLEAR_ALL_CACHES') {
    event.waitUntil(
      (async () => {
        try {
          const keys = await caches.keys()
          await Promise.all(
            keys
              .filter((k) => k === DYNAMIC_CACHE || k === STATIC_CACHE || /dynamic|static|zart-quizzer/i.test(k))
              .map((k) => caches.delete(k))
          )
          // Optionally notify clients
          const allClients = await self.clients.matchAll()
          for (const client of allClients) {
            client.postMessage({ type: 'AUTH_CACHE_CLEARED' })
          }
        } catch (e) {
          // ignore
        }
      })()
    )
  }
})
