# Quick Reference Guide - Code Splitting & Lazy Loading

## 🚀 Quick Start

### Import Lazy Components
```typescript
import { 
  LazyQuizForm, 
  LazyStatsGrid, 
  LazyExploreContent 
} from '@/components/lazy-components'
```

### Wrap in Suspense
```typescript
<Suspense fallback={<LoadingSkeleton />}>
  <LazyQuizForm onGenerate={handleGenerate} />
</Suspense>
```

### Preload Routes
```typescript
import { useRoutePreloader } from '@/lib/route-preloader'

const { prefetchRoute } = useRoutePreloader()
prefetchRoute('/dashboard', { priority: PreloadPriority.HIGH })
```

## 📦 Available Lazy Components

### Animations
- `LazyAnimatedGallery`
- `LazyLottieAnimation`
- `LazyMotionDiv`
- `LazyAnimatePresence`

### Charts
- `LazyChart`
- `LazyChartContainer`
- `LazyBarChart`
- `LazyLineChart`
- `LazyPieChart`
- `LazyRadarChart`

### UI Components
- `LazyCarousel`
- `LazyDrawer`
- `LazySheet`
- `LazyCalendar`
- `LazyCommand`
- `LazyContextMenu`
- `LazyHoverCard`
- `LazyMenubar`
- `LazyNavigationMenu`
- `LazyResizable`

### Dashboard
- `LazyStatsGrid`
- `LazyQuizSection`
- `LazyMotivationSection`
- `LazyQuizCard`
- `LazyStatsCard`
- `LazyChartCard`
- `LazyQuizForm`
- `LazyProfileEditForm`
- `LazyLibraryQuizCard`
- `LazyHistoryItem`
- `LazyHistoryPerformance`
- `LazyHistoryAchievements`

### Quiz
- `LazyQuizPracticeHeader`
- `LazyQuizPracticeQuestion`
- `LazyQuizPracticeActions`
- `LazyQuizRatingModal`
- `LazyQuizResultSummary`
- `LazyQuizResultReview`
- `LazyQuizResultHeader`
- `LazyQuizResultFooter`

### Explore
- `LazyExploreContent`
- `LazyExploreHeader`

### Profile
- `LazyUserProfileStats`
- `LazyProfileAbout`
- `LazyProfileSecurity`
- `LazyProfileSidebar`

### Settings
- `LazySettingsContent`
- `LazyAccountInfo`
- `LazyPasswordForm`
- `LazyDangerZone`
- `LazySecurityLog`

### Auth
- `LazyLoginForm`
- `LazyRegisterForm`

### Home
- `LazyHomeTrendingQuizzes`
- `LazyHomeFeatures`
- `LazyHomeQuickActions`

## 🔧 Route Preloading Functions

### Basic Usage
```typescript
import { useRoutePreloader, PreloadPriority } from '@/lib/route-preloader'

const { prefetchRoute, prefetchRoutes } = useRoutePreloader()

// Single route
prefetchRoute('/dashboard')

// Multiple routes with priority
prefetchRoutes([
  { href: '/dashboard', options: { priority: PreloadPriority.HIGH } },
  { href: '/explore', options: { priority: PreloadPriority.MEDIUM } }
])
```

### Pre-built Functions
```typescript
import { 
  preloadAuthenticatedRoutes,
  preloadDashboardRoutes,
  preloadExploreRoutes 
} from '@/lib/route-preloader'

// Auth-aware preloading
preloadAuthenticatedRoutes(router, isAuthenticated)

// Dashboard routes
preloadDashboardRoutes(router)

// Explore routes
preloadExploreRoutes(router)
```

### Hover/Focus Preloading
```typescript
const { prefetchOnHover, cancelPrefetch } = useRoutePreloader()

<Link 
  href="/dashboard"
  onMouseEnter={() => prefetchOnHover('/dashboard', 100)}
  onMouseLeave={cancelPrefetch}
>
  Dashboard
</Link>
```

## 📦 Component Preloading Functions

### Route-based Preloading
```typescript
import { preloadComponentsForRoute } from '@/lib/component-preloader'

// Preload components for specific route
await preloadComponentsForRoute('/dashboard/create')
```

### Smart Preloading
```typescript
import { smartPreload } from '@/lib/component-preloader'

// Preload likely next routes based on current location
smartPreload('/dashboard')
```

### Hover/Focus Handlers
```typescript
import { preloadOnHover, preloadOnFocus } from '@/lib/component-preloader'

<Link 
  href="/dashboard"
  {...preloadOnHover('/dashboard', 100)}
  {...preloadOnFocus('/dashboard')}
>
  Dashboard
</Link>
```

### Idle Time Preloading
```typescript
import { preloadDuringIdle } from '@/lib/component-preloader'

// Preload during browser idle time
preloadDuringIdle(['/dashboard', '/explore', '/dashboard/create'])
```

## 🎨 Loading Skeletons

### Basic Skeleton
```typescript
<Suspense fallback={
  <div className="h-32 bg-muted rounded animate-pulse" />
}>
  <LazyComponent />
</Suspense>
```

### Grid Skeleton
```typescript
<Suspense fallback={
  <div className="grid grid-cols-3 gap-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="h-32 bg-muted rounded animate-pulse" />
    ))}
  </div>
}>
  <LazyStatsGrid />
</Suspense>
```

### List Skeleton
```typescript
<Suspense fallback={
  <div className="space-y-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="h-24 bg-muted rounded animate-pulse" />
    ))}
  </div>
}>
  <LazyList />
</Suspense>
```

## 🛠️ Utility Functions

### withSuspense HOC
```typescript
import { withSuspense } from '@/components/lazy-components'

const SafeComponent = withSuspense(HeavyComponent, <LoadingSkeleton />)
```

### Preload Critical Components
```typescript
import { preloadCriticalComponents } from '@/components/lazy-components'

useEffect(() => {
  preloadCriticalComponents()
}, [])
```

### Batch Preload
```typescript
import { batchPreload } from '@/components/lazy-components'

batchPreload([
  () => import('@/components/ui/button'),
  () => import('@/components/ui/card'),
  () => import('@/components/ui/dialog')
])
```

## 📊 Performance Scripts

```bash
# Build for production
npm run build

# Analyze optimizations
npm run analyze:optimizations

# Analyze bundle size
npm run build:analyze

# Test bundle size
npm run bundle:size

# Performance check with Lighthouse
npm run performance:check

# Development with Turbo
npm run performance:monitor
```

## 🎯 Best Practices

### 1. Always Use Suspense
```typescript
// ✅ Good
<Suspense fallback={<Skeleton />}>
  <LazyComponent />
</Suspense>

// ❌ Bad
<LazyComponent />
```

### 2. Match Skeleton Dimensions
```typescript
// ✅ Good - Matches actual component size
<Suspense fallback={<div className="h-48 w-full" />}>
  <LazyCard /> {/* Also h-48 */}
</Suspense>

// ❌ Bad - Different sizes cause layout shift
<Suspense fallback={<div className="h-32 w-full" />}>
  <LazyCard /> {/* h-48 */}
</Suspense>
```

### 3. Preload Strategically
```typescript
// ✅ Good - Priority-based
prefetchRoute('/dashboard', { priority: PreloadPriority.HIGH })
prefetchRoute('/settings', { priority: PreloadPriority.LOW, delay: 500 })

// ❌ Bad - Everything at once
routes.forEach(route => prefetchRoute(route))
```

### 4. Use Context-Aware Preloading
```typescript
// ✅ Good
if (isAuthenticated) {
  preloadDashboardRoutes(router)
} else {
  preloadAuthComponents()
}

// ❌ Bad - Preload everything
preloadDashboardRoutes(router)
preloadAuthComponents()
```

## 🐛 Troubleshooting

### Component Not Loading
1. Check Suspense boundary exists
2. Verify import path is correct
3. Check browser console for errors

### Prefetch Not Working
1. Verify route path matches exactly
2. Check router is available
3. Look for console warnings

### Loading State Flickers
1. Increase preload priority
2. Add hover/focus preloading
3. Check Suspense fallback matches size

## 📚 Documentation

- **Full Guide**: `OPTIMIZATION_GUIDE.md`
- **Summary**: `IMPLEMENTATION_SUMMARY.md`
- **This Reference**: `QUICK_REFERENCE.md`

## 🎉 Quick Wins

1. **Fastest Navigation**: Use HIGH priority preloading
2. **Smoothest UX**: Match skeleton sizes exactly
3. **Best Performance**: Preload during idle time
4. **Smart Loading**: Use context-aware strategies
5. **Zero Layout Shift**: Use proper Suspense boundaries

---

**Pro Tip**: Start dev server with `npm run performance:monitor` for the fastest development experience!
