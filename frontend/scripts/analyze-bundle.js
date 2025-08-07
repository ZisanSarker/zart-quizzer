const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🔍 Analyzing bundle size...')

// Run Next.js build with bundle analyzer
try {
  // Install @next/bundle-analyzer if not already installed
  console.log('📦 Installing bundle analyzer...')
  execSync('npm install --save-dev @next/bundle-analyzer', { stdio: 'inherit' })
  
  // Create bundle analyzer config
  const bundleAnalyzerConfig = `
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // Your existing Next.js config
})
`
  
  fs.writeFileSync('next.config.analyzer.js', bundleAnalyzerConfig)
  
  // Run build with analyzer
  console.log('🏗️ Building with bundle analyzer...')
  execSync('ANALYZE=true npm run build', { stdio: 'inherit' })
  
  console.log('✅ Bundle analysis complete! Check the generated reports.')
  
} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message)
  process.exit(1)
}

// Clean up
try {
  fs.unlinkSync('next.config.analyzer.js')
} catch (error) {
  // Ignore cleanup errors
}
