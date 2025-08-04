import * as React from "react"

const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  large: 1280,
  xlarge: 1536,
} as const

type Breakpoint = keyof typeof BREAKPOINTS
type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'large' | 'xlarge'

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.mobile - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.mobile)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < BREAKPOINTS.mobile)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>('mobile')
  const [deviceType, setDeviceType] = React.useState<DeviceType>('mobile')

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      
      if (width < BREAKPOINTS.mobile) {
        setBreakpoint('mobile')
        setDeviceType('mobile')
      } else if (width < BREAKPOINTS.tablet) {
        setBreakpoint('tablet')
        setDeviceType('tablet')
      } else if (width < BREAKPOINTS.desktop) {
        setBreakpoint('desktop')
        setDeviceType('desktop')
      } else if (width < BREAKPOINTS.large) {
        setBreakpoint('large')
        setDeviceType('large')
      } else {
        setBreakpoint('xlarge')
        setDeviceType('xlarge')
      }
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return { breakpoint, deviceType }
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${BREAKPOINTS.mobile}px) and (max-width: ${BREAKPOINTS.tablet - 1}px)`)
    const onChange = () => {
      setIsTablet(window.innerWidth >= BREAKPOINTS.mobile && window.innerWidth < BREAKPOINTS.tablet)
    }
    mql.addEventListener("change", onChange)
    setIsTablet(window.innerWidth >= BREAKPOINTS.mobile && window.innerWidth < BREAKPOINTS.tablet)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isTablet
}

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${BREAKPOINTS.desktop}px)`)
    const onChange = () => {
      setIsDesktop(window.innerWidth >= BREAKPOINTS.desktop)
    }
    mql.addEventListener("change", onChange)
    setIsDesktop(window.innerWidth >= BREAKPOINTS.desktop)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isDesktop
}

export function useIsLarge() {
  const [isLarge, setIsLarge] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${BREAKPOINTS.large}px)`)
    const onChange = () => {
      setIsLarge(window.innerWidth >= BREAKPOINTS.large)
    }
    mql.addEventListener("change", onChange)
    setIsLarge(window.innerWidth >= BREAKPOINTS.large)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isLarge
}

export function useIsXLarge() {
  const [isXLarge, setIsXLarge] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${BREAKPOINTS.xlarge}px)`)
    const onChange = () => {
      setIsXLarge(window.innerWidth >= BREAKPOINTS.xlarge)
    }
    mql.addEventListener("change", onChange)
    setIsXLarge(window.innerWidth >= BREAKPOINTS.xlarge)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isXLarge
}

export function useResponsive() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isDesktop = useIsDesktop()
  const isLarge = useIsLarge()
  const isXLarge = useIsXLarge()
  const { breakpoint, deviceType } = useBreakpoint()

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLarge,
    isXLarge,
    breakpoint,
    deviceType,
    isTouch: isMobile || isTablet,
    isDesktopOrLarger: isDesktop || isLarge || isXLarge,
  }
}
