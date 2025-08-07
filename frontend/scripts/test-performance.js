const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Testing Performance Optimizations...\n')

// Check if required tools are installed
function checkDependencies() {
  console.log('📦 Checking dependencies...')
  
  try {
    execSync('npm list next', { stdio: 'pipe' })
    console.log('✅ Next.js is installed')
  } catch (error) {
    console.log('❌ Next.js not found')
    return false
  }
  
  return true
}

// Check bundle size
function checkBundleSize() {
  console.log('\n📊 Checking bundle size...')
  
  try {
    // Build the project
    console.log('Building project...')
    execSync('npm run build', { stdio: 'pipe' })
    
    // Check if .next directory exists
    if (fs.existsSync('.next')) {
      console.log('✅ Build completed successfully')
      
      // Get build stats
      const buildStats = fs.readFileSync('.next/build-manifest.json', 'utf8')
      const stats = JSON.parse(buildStats)
      
      let totalSize = 0
      let fileCount = 0
      
      // Calculate approximate bundle size
      Object.values(stats.pages).forEach(page => {
        if (page.js) {
          fileCount += page.js.length
        }
        if (page.css) {
          fileCount += page.css.length
        }
      })
      
      console.log(`📁 Total files: ${fileCount}`)
      console.log('✅ Bundle size check completed')
      
    } else {
      console.log('❌ Build failed or .next directory not found')
      return false
    }
  } catch (error) {
    console.log('❌ Bundle size check failed:', error.message)
    return false
  }
  
  return true
}

// Check service worker
function checkServiceWorker() {
  console.log('\n🔧 Checking service worker...')
  
  const swPath = path.join(__dirname, '../public/sw.js')
  
  if (fs.existsSync(swPath)) {
    const swContent = fs.readFileSync(swPath, 'utf8')
    
    // Check for key service worker features
    const checks = [
      { name: 'Cache Strategy', pattern: /caches\.open/, found: false },
      { name: 'Fetch Handler', pattern: /addEventListener\('fetch'/, found: false },
      { name: 'Install Handler', pattern: /addEventListener\('install'/, found: false },
      { name: 'Activate Handler', pattern: /addEventListener\('activate'/, found: false }
    ]
    
    checks.forEach(check => {
      check.found = check.pattern.test(swContent)
      console.log(`${check.found ? '✅' : '❌'} ${check.name}`)
    })
    
    const passedChecks = checks.filter(c => c.found).length
    console.log(`📊 Service Worker Score: ${passedChecks}/${checks.length}`)
    
    return passedChecks === checks.length
  } else {
    console.log('❌ Service worker not found')
    return false
  }
}

// Check Next.js config
function checkNextConfig() {
  console.log('\n⚙️ Checking Next.js configuration...')
  
  const configPath = path.join(__dirname, '../next.config.mjs')
  
  if (fs.existsSync(configPath)) {
    const configContent = fs.readFileSync(configPath, 'utf8')
    
    const checks = [
      { name: 'Image Optimization', pattern: /images:/, found: false },
      { name: 'Compression', pattern: /compress:\s*true/, found: false },
      { name: 'Package Optimization', pattern: /optimizePackageImports/, found: false },
      { name: 'Security Headers', pattern: /headers\(\s*\)/, found: false }
    ]
    
    checks.forEach(check => {
      check.found = check.pattern.test(configContent)
      console.log(`${check.found ? '✅' : '❌'} ${check.name}`)
    })
    
    const passedChecks = checks.filter(c => c.found).length
    console.log(`📊 Config Score: ${passedChecks}/${checks.length}`)
    
    return passedChecks === checks.length
  } else {
    console.log('❌ Next.js config not found')
    return false
  }
}

// Check lazy loading components
function checkLazyLoading() {
  console.log('\n🔄 Checking lazy loading...')
  
  const lazyComponentsPath = path.join(__dirname, '../components/lazy-components.tsx')
  
  if (fs.existsSync(lazyComponentsPath)) {
    const content = fs.readFileSync(lazyComponentsPath, 'utf8')
    
    const checks = [
      { name: 'Dynamic Imports', pattern: /dynamic\(/, found: false },
      { name: 'Loading States', pattern: /loading:\s*\(\)/, found: false },
      { name: 'Suspense Support', pattern: /Suspense/, found: false },
      { name: 'Heavy Components', pattern: /LazyAnimatedGallery|LazyChart|LazyCarousel/, found: false }
    ]
    
    checks.forEach(check => {
      check.found = check.pattern.test(content)
      console.log(`${check.found ? '✅' : '❌'} ${check.name}`)
    })
    
    const passedChecks = checks.filter(c => c.found).length
    console.log(`📊 Lazy Loading Score: ${passedChecks}/${checks.length}`)
    
    return passedChecks >= 3 // At least 3 out of 4
  } else {
    console.log('❌ Lazy components not found')
    return false
  }
}

// Generate performance report
function generateReport(results) {
  console.log('\n📋 Performance Optimization Report')
  console.log('=====================================')
  
  const totalChecks = Object.keys(results).length
  const passedChecks = Object.values(results).filter(Boolean).length
  
  console.log(`\nOverall Score: ${passedChecks}/${totalChecks}`)
  
  if (passedChecks === totalChecks) {
    console.log('🎉 All optimizations are properly configured!')
  } else if (passedChecks >= totalChecks * 0.8) {
    console.log('✅ Most optimizations are configured correctly')
  } else if (passedChecks >= totalChecks * 0.6) {
    console.log('⚠️ Some optimizations need attention')
  } else {
    console.log('❌ Many optimizations are missing')
  }
  
  console.log('\nRecommendations:')
  if (!results.dependencies) {
    console.log('- Install missing dependencies')
  }
  if (!results.bundle) {
    console.log('- Review bundle size and optimize imports')
  }
  if (!results.serviceWorker) {
    console.log('- Implement or fix service worker')
  }
  if (!results.config) {
    console.log('- Update Next.js configuration')
  }
  if (!results.lazyLoading) {
    console.log('- Implement lazy loading for heavy components')
  }
  
  console.log('\nFor detailed analysis, run:')
  console.log('npm run analyze')
  console.log('npm run performance:check')
}

// Main execution
function main() {
  const results = {
    dependencies: checkDependencies(),
    bundle: checkBundleSize(),
    serviceWorker: checkServiceWorker(),
    config: checkNextConfig(),
    lazyLoading: checkLazyLoading()
  }
  
  generateReport(results)
}

// Run the test
if (require.main === module) {
  main()
}

module.exports = { main }
