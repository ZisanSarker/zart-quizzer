#!/usr/bin/env node

/**
 * Performance Testing Script
 * Tests and validates the performance improvements from code splitting and lazy loading
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(80));
  log(title, 'bold');
  console.log('='.repeat(80));
}

// Read Next.js build stats
function analyzeBuildStats() {
  logSection('📊 Build Stats Analysis');

  const buildManifestPath = path.join(process.cwd(), '.next', 'build-manifest.json');
  
  if (!fs.existsSync(buildManifestPath)) {
    log('❌ Build manifest not found. Please run "npm run build" first.', 'red');
    return;
  }

  const buildManifest = JSON.parse(fs.readFileSync(buildManifestPath, 'utf8'));
  
  log('\n📦 Pages and their chunks:', 'blue');
  Object.entries(buildManifest.pages).forEach(([page, chunks]) => {
    log(`  ${page}: ${chunks.length} chunks`, 'green');
  });

  return buildManifest;
}

// Analyze lazy loaded components
function analyzeLazyComponents() {
  logSection('🔄 Lazy Loading Analysis');

  const lazyComponentsPath = path.join(process.cwd(), 'components', 'lazy-components.tsx');
  
  if (!fs.existsSync(lazyComponentsPath)) {
    log('❌ lazy-components.tsx not found.', 'red');
    return;
  }

  const content = fs.readFileSync(lazyComponentsPath, 'utf8');
  
  // Count dynamic imports
  const dynamicImports = (content.match(/dynamic\(/g) || []).length;
  const lazyExports = (content.match(/export const Lazy/g) || []).length;

  log(`\n✅ Total lazy components: ${lazyExports}`, 'green');
  log(`✅ Dynamic imports: ${dynamicImports}`, 'green');

  // Check for SSR disabled components
  const ssrDisabled = (content.match(/ssr: false/g) || []).length;
  log(`✅ Components with SSR disabled: ${ssrDisabled}`, 'green');

  return { lazyExports, dynamicImports, ssrDisabled };
}

// Analyze Suspense usage
function analyzeSuspenseUsage() {
  logSection('⏸️  Suspense Boundaries Analysis');

  const appDir = path.join(process.cwd(), 'app');
  let suspenseCount = 0;
  let filesWithSuspense = 0;

  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        const suspenseMatches = content.match(/<Suspense/g);
        
        if (suspenseMatches) {
          suspenseCount += suspenseMatches.length;
          filesWithSuspense++;
        }
      }
    });
  }

  scanDirectory(appDir);

  log(`\n✅ Total Suspense boundaries: ${suspenseCount}`, 'green');
  log(`✅ Files using Suspense: ${filesWithSuspense}`, 'green');

  return { suspenseCount, filesWithSuspense };
}

// Analyze route preloading
function analyzeRoutePreloading() {
  logSection('🚀 Route Preloading Analysis');

  const routePreloaderPath = path.join(process.cwd(), 'lib', 'route-preloader.ts');
  
  if (!fs.existsSync(routePreloaderPath)) {
    log('❌ route-preloader.ts not found.', 'red');
    return;
  }

  const content = fs.readFileSync(routePreloaderPath, 'utf8');
  
  // Count preload functions
  const preloadFunctions = (content.match(/export const preload/g) || []).length;
  const preloadHooks = (content.match(/export const use.*Preload/g) || []).length;

  log(`\n✅ Preload functions: ${preloadFunctions}`, 'green');
  log(`✅ Preload hooks: ${preloadHooks}`, 'green');

  return { preloadFunctions, preloadHooks };
}

// Analyze component preloading
function analyzeComponentPreloading() {
  logSection('📦 Component Preloading Analysis');

  const componentPreloaderPath = path.join(process.cwd(), 'lib', 'component-preloader.ts');
  
  if (!fs.existsSync(componentPreloaderPath)) {
    log('❌ component-preloader.ts not found.', 'red');
    return;
  }

  const content = fs.readFileSync(componentPreloaderPath, 'utf8');
  
  // Count preload strategies
  const preloadStrategies = (content.match(/export const \w+Preload/g) || []).length;
  const setupFunctions = (content.match(/export const setup/g) || []).length;

  log(`\n✅ Preload strategies: ${preloadStrategies}`, 'green');
  log(`✅ Setup functions: ${setupFunctions}`, 'green');

  return { preloadStrategies, setupFunctions };
}

// Check Next.js config optimizations
function analyzeNextConfig() {
  logSection('⚙️  Next.js Configuration Analysis');

  const nextConfigPath = path.join(process.cwd(), 'next.config.mjs');
  
  if (!fs.existsSync(nextConfigPath)) {
    log('❌ next.config.mjs not found.', 'red');
    return;
  }

  const content = fs.readFileSync(nextConfigPath, 'utf8');
  
  const optimizations = {
    'optimizePackageImports': content.includes('optimizePackageImports'),
    'webpackBuildWorker': content.includes('webpackBuildWorker'),
    'optimisticClientCache': content.includes('optimisticClientCache'),
    'removeConsole': content.includes('removeConsole'),
    'reactStrictMode': content.includes('reactStrictMode: true'),
    'productionBrowserSourceMaps': content.includes('productionBrowserSourceMaps: false'),
  };

  log('\n📋 Configuration optimizations:', 'blue');
  Object.entries(optimizations).forEach(([key, enabled]) => {
    const status = enabled ? '✅' : '❌';
    const color = enabled ? 'green' : 'red';
    log(`  ${status} ${key}`, color);
  });

  return optimizations;
}

// Generate performance report
function generateReport(data) {
  logSection('📈 Performance Optimization Summary');

  const totalOptimizations = 
    (data.lazy?.lazyExports || 0) +
    (data.suspense?.suspenseCount || 0) +
    (data.route?.preloadFunctions || 0) +
    (data.component?.preloadStrategies || 0);

  log(`\n🎯 Total optimizations implemented: ${totalOptimizations}`, 'bold');

  // Performance score calculation
  const scores = {
    lazyLoading: data.lazy?.lazyExports >= 30 ? 100 : (data.lazy?.lazyExports / 30) * 100,
    suspense: data.suspense?.suspenseCount >= 20 ? 100 : (data.suspense?.suspenseCount / 20) * 100,
    routePreload: data.route?.preloadFunctions >= 5 ? 100 : (data.route?.preloadFunctions / 5) * 100,
    componentPreload: data.component?.preloadStrategies >= 5 ? 100 : (data.component?.preloadStrategies / 5) * 100,
    config: Object.values(data.config || {}).filter(Boolean).length >= 4 ? 100 : 
            (Object.values(data.config || {}).filter(Boolean).length / 6) * 100,
  };

  const overallScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;

  log('\n📊 Performance Scores:', 'blue');
  Object.entries(scores).forEach(([category, score]) => {
    const color = score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red';
    log(`  ${category.padEnd(20)}: ${score.toFixed(1)}%`, color);
  });

  log(`\n🏆 Overall Optimization Score: ${overallScore.toFixed(1)}%`, 
      overallScore >= 80 ? 'green' : overallScore >= 60 ? 'yellow' : 'red');

  // Recommendations
  if (overallScore < 100) {
    log('\n💡 Recommendations:', 'yellow');
    
    if (scores.lazyLoading < 100) {
      log('  • Add more lazy loaded components for heavy UI elements', 'yellow');
    }
    if (scores.suspense < 100) {
      log('  • Increase Suspense boundary usage for better loading states', 'yellow');
    }
    if (scores.routePreload < 100) {
      log('  • Implement more route preloading strategies', 'yellow');
    }
    if (scores.componentPreload < 100) {
      log('  • Add component preloading for frequently accessed routes', 'yellow');
    }
    if (scores.config < 100) {
      log('  • Enable all Next.js configuration optimizations', 'yellow');
    }
  } else {
    log('\n✨ Excellent! All optimizations are in place.', 'green');
  }
}

// Main execution
function main() {
  console.clear();
  log('🚀 ZART Quizzer - Performance Analysis Tool\n', 'bold');

  const data = {
    build: analyzeBuildStats(),
    lazy: analyzeLazyComponents(),
    suspense: analyzeSuspenseUsage(),
    route: analyzeRoutePreloading(),
    component: analyzeComponentPreloading(),
    config: analyzeNextConfig(),
  };

  generateReport(data);

  log('\n' + '='.repeat(80) + '\n');
  log('💡 Tip: Run "npm run build:analyze" for detailed bundle analysis', 'blue');
  log('💡 Tip: See OPTIMIZATION_GUIDE.md for complete documentation\n', 'blue');
}

main();
