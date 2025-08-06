// Responsive Components
export { ResponsiveGrid, ResponsiveGridLayouts } from "./responsive-grid"
export { ResponsiveContainer, ResponsiveSection, ResponsiveFlex, ResponsiveLayouts } from "./responsive-container"
export { default as ResponsiveNavigation } from "./responsive-navigation"
export { 
  ResponsiveForm, 
  ResponsiveFormField, 
  ResponsiveInput, 
  ResponsiveTextarea, 
  ResponsiveSelect, 
  ResponsiveButtonGroup, 
  ResponsiveFormSection, 
  ResponsiveFormLayouts 
} from "./responsive-form"
export { 
  ResponsiveModal, 
  ResponsiveModalFooter, 
  ResponsiveModalButton, 
  ResponsiveModalContent, 
  ResponsiveModalLayouts 
} from "./responsive-modal"
export { 
  ResponsiveTable, 
  ResponsiveTableHeader, 
  ResponsiveTableBody, 
  ResponsiveTableRow, 
  ResponsiveTableCell, 
  ResponsiveTableHeaderCell, 
  ResponsiveTableContainer, 
  ResponsiveTableEmpty, 
  ResponsiveTableLayouts 
} from "./responsive-table"

// Responsive Utilities
export const responsiveBreakpoints = {
  xs: "480px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const

export const responsiveSpacing = {
  xs: "0.5rem",
  sm: "1rem",
  md: "1.5rem",
  lg: "2rem",
  xl: "3rem",
  "2xl": "4rem",
} as const

export const responsiveTypography = {
  h1: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl",
  h2: "text-xl sm:text-2xl md:text-3xl lg:text-4xl",
  h3: "text-lg sm:text-xl md:text-2xl lg:text-3xl",
  body: "text-sm sm:text-base md:text-lg",
  small: "text-xs sm:text-sm md:text-base",
} as const

export const responsivePadding = {
  xs: "p-2 sm:p-3",
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-6",
  lg: "p-6 sm:p-8",
  xl: "p-8 sm:p-12",
} as const

export const responsiveMargin = {
  xs: "m-2 sm:m-3",
  sm: "m-3 sm:m-4",
  md: "m-4 sm:m-6",
  lg: "m-6 sm:m-8",
  xl: "m-8 sm:m-12",
} as const

export const responsiveGap = {
  xs: "gap-2 sm:gap-3",
  sm: "gap-3 sm:gap-4",
  md: "gap-4 sm:gap-6",
  lg: "gap-6 sm:gap-8",
  xl: "gap-8 sm:gap-12",
} as const

// Responsive Layout Helpers
export const getResponsiveClass = (baseClass: string, responsiveVariants: Record<string, string>) => {
  return Object.entries(responsiveVariants)
    .map(([breakpoint, variant]) => {
      if (breakpoint === "base") return variant
      return `${breakpoint}:${variant}`
    })
    .join(" ")
}

export const responsiveGridCols = {
  "1": "grid-cols-1",
  "1-2": "grid-cols-1 sm:grid-cols-2",
  "1-2-3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  "1-2-4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  "1-3-6": "grid-cols-1 sm:grid-cols-3 lg:grid-cols-6",
  "2": "grid-cols-2",
  "2-3": "grid-cols-2 lg:grid-cols-3",
  "2-4": "grid-cols-2 lg:grid-cols-4",
  "3": "grid-cols-3",
  "4": "grid-cols-4",
} as const

export const responsiveFlexDirection = {
  "col-row": "flex-col lg:flex-row",
  "col-row-reverse": "flex-col lg:flex-row-reverse",
  "row-col": "flex-row lg:flex-col",
  "row-col-reverse": "flex-row lg:flex-col-reverse",
} as const

export const responsiveTextAlign = {
  "center-left": "text-center sm:text-left",
  "center-right": "text-center sm:text-right",
  "left-center": "text-left sm:text-center",
  "right-center": "text-right sm:text-center",
} as const

// Responsive Visibility Helpers
export const responsiveVisibility = {
  "hidden-mobile": "hidden sm:block",
  "hidden-tablet": "hidden md:block",
  "hidden-desktop": "hidden lg:block",
  "visible-mobile": "block sm:hidden",
  "visible-tablet": "block md:hidden",
  "visible-desktop": "block lg:hidden",
} as const

// Responsive Touch Target Helpers
export const responsiveTouchTarget = {
  small: "min-h-[44px] min-w-[44px]",
  medium: "min-h-[48px] min-w-[48px]",
  large: "min-h-[56px] min-w-[56px]",
} as const

// Responsive Container Helpers
export const responsiveContainer = {
  sm: "max-w-sm mx-auto px-3 sm:px-4",
  md: "max-w-md mx-auto px-3 sm:px-4",
  lg: "max-w-lg mx-auto px-3 sm:px-4",
  xl: "max-w-xl mx-auto px-3 sm:px-4",
  "2xl": "max-w-2xl mx-auto px-3 sm:px-4",
  "3xl": "max-w-3xl mx-auto px-3 sm:px-4",
  "4xl": "max-w-4xl mx-auto px-3 sm:px-4",
  "5xl": "max-w-5xl mx-auto px-3 sm:px-4",
  "6xl": "max-w-6xl mx-auto px-3 sm:px-4",
  "7xl": "max-w-7xl mx-auto px-3 sm:px-4",
  full: "w-full px-3 sm:px-4",
} as const

// Responsive Section Helpers
export const responsiveSection = {
  sm: "py-4 sm:py-6",
  md: "py-6 sm:py-8 lg:py-12",
  lg: "py-8 sm:py-12 lg:py-16",
  xl: "py-12 sm:py-16 lg:py-20",
} as const

// Responsive Card Helpers
export const responsiveCard = {
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-6",
  lg: "p-6 sm:p-8",
  xl: "p-8 sm:p-12",
} as const

// Responsive Button Helpers
export const responsiveButton = {
  "full-auto": "w-full sm:w-auto",
  "full-sm": "w-full sm:w-auto",
  "full-md": "w-full md:w-auto",
  "full-lg": "w-full lg:w-auto",
} as const

// Responsive Image Helpers
export const responsiveImage = {
  square: "aspect-square",
  video: "aspect-video",
  photo: "aspect-[4/3]",
  wide: "aspect-[16/9]",
  tall: "aspect-[3/4]",
} as const

// Responsive Animation Helpers
export const responsiveAnimation = {
  "fade-up": "animate-fade-up",
  "fade-in": "animate-fade-in",
  "slide-up": "animate-slide-up",
  "slide-down": "animate-slide-down",
  "scale-in": "animate-scale-in",
} as const

// Responsive Transition Helpers
export const responsiveTransition = {
  fast: "transition-all duration-200",
  normal: "transition-all duration-300",
  slow: "transition-all duration-500",
} as const

// Responsive Shadow Helpers
export const responsiveShadow = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  "2xl": "shadow-2xl",
} as const

// Responsive Border Radius Helpers
export const responsiveBorderRadius = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
} as const

// Responsive Opacity Helpers
export const responsiveOpacity = {
  0: "opacity-0",
  25: "opacity-25",
  50: "opacity-50",
  75: "opacity-75",
  100: "opacity-100",
} as const

// Responsive Z-Index Helpers
export const responsiveZIndex = {
  0: "z-0",
  10: "z-10",
  20: "z-20",
  30: "z-30",
  40: "z-40",
  50: "z-50",
} as const

// Responsive Position Helpers
export const responsivePosition = {
  static: "static",
  relative: "relative",
  absolute: "absolute",
  fixed: "fixed",
  sticky: "sticky",
} as const

// Responsive Overflow Helpers
export const responsiveOverflow = {
  auto: "overflow-auto",
  hidden: "overflow-hidden",
  visible: "overflow-visible",
  scroll: "overflow-scroll",
} as const

// Responsive Display Helpers
export const responsiveDisplay = {
  block: "block",
  inline: "inline",
  "inline-block": "inline-block",
  flex: "flex",
  "inline-flex": "inline-flex",
  grid: "grid",
  "inline-grid": "inline-grid",
  hidden: "hidden",
} as const

// Responsive Object Fit Helpers
export const responsiveObjectFit = {
  contain: "object-contain",
  cover: "object-cover",
  fill: "object-fill",
  none: "object-none",
  "scale-down": "object-scale-down",
} as const

// Responsive Object Position Helpers
export const responsiveObjectPosition = {
  center: "object-center",
  top: "object-top",
  bottom: "object-bottom",
  left: "object-left",
  right: "object-right",
  "top-left": "object-top-left",
  "top-right": "object-top-right",
  "bottom-left": "object-bottom-left",
  "bottom-right": "object-bottom-right",
} as const

// Responsive Cursor Helpers
export const responsiveCursor = {
  auto: "cursor-auto",
  default: "cursor-default",
  pointer: "cursor-pointer",
  wait: "cursor-wait",
  text: "cursor-text",
  move: "cursor-move",
  "not-allowed": "cursor-not-allowed",
} as const

// Responsive User Select Helpers
export const responsiveUserSelect = {
  none: "select-none",
  text: "select-text",
  all: "select-all",
  auto: "select-auto",
} as const

// Responsive Pointer Events Helpers
export const responsivePointerEvents = {
  none: "pointer-events-none",
  auto: "pointer-events-auto",
} as const

// Responsive Resize Helpers
export const responsiveResize = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  both: "resize",
} as const

// Responsive Scroll Behavior Helpers
export const responsiveScrollBehavior = {
  auto: "scroll-auto",
  smooth: "scroll-smooth",
} as const

// Responsive Scroll Snap Helpers
export const responsiveScrollSnap = {
  none: "snap-none",
  start: "snap-start",
  end: "snap-end",
  center: "snap-center",
  align: "snap-align-none",
} as const

// Responsive Scroll Snap Stop Helpers
export const responsiveScrollSnapStop = {
  normal: "snap-normal",
  always: "snap-always",
} as const

// Responsive Scroll Snap Type Helpers
export const responsiveScrollSnapType = {
  none: "snap-type-none",
  x: "snap-type-x",
  y: "snap-type-y",
  both: "snap-type-both",
  mandatory: "snap-type-both mandatory",
  proximity: "snap-type-both proximity",
} as const

// Responsive Touch Action Helpers
export const responsiveTouchAction = {
  auto: "touch-auto",
  none: "touch-none",
  "pan-x": "touch-pan-x",
  "pan-left": "touch-pan-left",
  "pan-right": "touch-pan-right",
  "pan-y": "touch-pan-y",
  "pan-up": "touch-pan-up",
  "pan-down": "touch-pan-down",
  "pinch-zoom": "touch-pinch-zoom",
  manipulation: "touch-manipulation",
} as const

// Responsive Will Change Helpers
export const responsiveWillChange = {
  auto: "will-change-auto",
  scroll: "will-change-scroll-position",
  contents: "will-change-contents",
  transform: "will-change-transform",
} as const

// Responsive Transform Helpers
export const responsiveTransform = {
  none: "transform-none",
  scale: "scale-100",
  "scale-50": "scale-50",
  "scale-75": "scale-75",
  "scale-90": "scale-90",
  "scale-95": "scale-95",
  "scale-105": "scale-105",
  "scale-110": "scale-110",
  "scale-125": "scale-125",
  "scale-150": "scale-150",
  "scale-x-50": "scale-x-50",
  "scale-x-75": "scale-x-75",
  "scale-x-90": "scale-x-90",
  "scale-x-95": "scale-x-95",
  "scale-x-105": "scale-x-105",
  "scale-x-110": "scale-x-110",
  "scale-x-125": "scale-x-125",
  "scale-x-150": "scale-x-150",
  "scale-y-50": "scale-y-50",
  "scale-y-75": "scale-y-75",
  "scale-y-90": "scale-y-90",
  "scale-y-95": "scale-y-95",
  "scale-y-105": "scale-y-105",
  "scale-y-110": "scale-y-110",
  "scale-y-125": "scale-y-125",
  "scale-y-150": "scale-y-150",
} as const

// Responsive Rotate Helpers
export const responsiveRotate = {
  none: "rotate-0",
  "1": "rotate-1",
  "2": "rotate-2",
  "3": "rotate-3",
  "6": "rotate-6",
  "12": "rotate-12",
  "45": "rotate-45",
  "90": "rotate-90",
  "180": "rotate-180",
  "-1": "-rotate-1",
  "-2": "-rotate-2",
  "-3": "-rotate-3",
  "-6": "-rotate-6",
  "-12": "-rotate-12",
  "-45": "-rotate-45",
  "-90": "-rotate-90",
  "-180": "-rotate-180",
} as const

// Responsive Translate Helpers
export const responsiveTranslate = {
  none: "translate-x-0 translate-y-0",
  "x-1": "translate-x-1",
  "x-2": "translate-x-2",
  "x-3": "translate-x-3",
  "x-4": "translate-x-4",
  "x-5": "translate-x-5",
  "x-6": "translate-x-6",
  "x-8": "translate-x-8",
  "x-10": "translate-x-10",
  "x-12": "translate-x-12",
  "x-16": "translate-x-16",
  "x-20": "translate-x-20",
  "x-24": "translate-x-24",
  "x-32": "translate-x-32",
  "x-40": "translate-x-40",
  "x-48": "translate-x-48",
  "x-56": "translate-x-56",
  "x-64": "translate-x-64",
  "x-px": "translate-x-px",
  "x-0.5": "translate-x-0.5",
  "x-1.5": "translate-x-1.5",
  "x-2.5": "translate-x-2.5",
  "x-3.5": "translate-x-3.5",
  "y-1": "translate-y-1",
  "y-2": "translate-y-2",
  "y-3": "translate-y-3",
  "y-4": "translate-y-4",
  "y-5": "translate-y-5",
  "y-6": "translate-y-6",
  "y-8": "translate-y-8",
  "y-10": "translate-y-10",
  "y-12": "translate-y-12",
  "y-16": "translate-y-16",
  "y-20": "translate-y-20",
  "y-24": "translate-y-24",
  "y-32": "translate-y-32",
  "y-40": "translate-y-40",
  "y-48": "translate-y-48",
  "y-56": "translate-y-56",
  "y-64": "translate-y-64",
  "y-px": "translate-y-px",
  "y-0.5": "translate-y-0.5",
  "y-1.5": "translate-y-1.5",
  "y-2.5": "translate-y-2.5",
  "y-3.5": "translate-y-3.5",
} as const

// Responsive Skew Helpers
export const responsiveSkew = {
  none: "skew-x-0 skew-y-0",
  "x-1": "skew-x-1",
  "x-2": "skew-x-2",
  "x-3": "skew-x-3",
  "x-6": "skew-x-6",
  "x-12": "skew-x-12",
  "y-1": "skew-y-1",
  "y-2": "skew-y-2",
  "y-3": "skew-y-3",
  "y-6": "skew-y-6",
  "y-12": "skew-y-12",
  "-x-1": "-skew-x-1",
  "-x-2": "-skew-x-2",
  "-x-3": "-skew-x-3",
  "-x-6": "-skew-x-6",
  "-x-12": "-skew-x-12",
  "-y-1": "-skew-y-1",
  "-y-2": "-skew-y-2",
  "-y-3": "-skew-y-3",
  "-y-6": "-skew-y-6",
  "-y-12": "-skew-y-12",
} as const

// Responsive Transform Origin Helpers
export const responsiveTransformOrigin = {
  center: "origin-center",
  top: "origin-top",
  "top-right": "origin-top-right",
  right: "origin-right",
  "bottom-right": "origin-bottom-right",
  bottom: "origin-bottom",
  "bottom-left": "origin-bottom-left",
  left: "origin-left",
  "top-left": "origin-top-left",
} as const

// Responsive Transform Style Helpers
export const responsiveTransformStyle = {
  flat: "transform-gpu",
  "3d": "transform-gpu",
} as const

// Responsive Backface Visibility Helpers
export const responsiveBackfaceVisibility = {
  visible: "backface-visible",
  hidden: "backface-hidden",
} as const

// Responsive Perspective Helpers
export const responsivePerspective = {
  none: "perspective-none",
  "250": "perspective-250",
  "500": "perspective-500",
  "750": "perspective-750",
  "1000": "perspective-1000",
} as const

// Responsive Perspective Origin Helpers
export const responsivePerspectiveOrigin = {
  center: "perspective-origin-center",
  top: "perspective-origin-top",
  "top-right": "perspective-origin-top-right",
  right: "perspective-origin-right",
  "bottom-right": "perspective-origin-bottom-right",
  bottom: "perspective-origin-bottom",
  "bottom-left": "perspective-origin-bottom-left",
  left: "perspective-origin-left",
  "top-left": "perspective-origin-top-left",
} as const

// Responsive Transform Box Helpers
export const responsiveTransformBox = {
  border: "transform-box-border",
  "fill-box": "transform-box-fill-box",
  "view-box": "transform-box-view-box",
} as const

// Responsive Transform Style Helpers
export const responsiveTransformStyle2 = {
  flat: "transform-style-flat",
  "preserve-3d": "transform-style-preserve-3d",
} as const

// Responsive Transform Style Helpers
export const responsiveTransformStyle3 = {
  flat: "transform-style-flat",
  "preserve-3d": "transform-style-preserve-3d",
} as const

// Responsive Transform Style Helpers
export const responsiveTransformStyle4 = {
  flat: "transform-style-flat",
  "preserve-3d": "transform-style-preserve-3d",
} as const

// Responsive Transform Style Helpers
export const responsiveTransformStyle5 = {
  flat: "transform-style-flat",
  "preserve-3d": "transform-style-preserve-3d",
} as const

// Responsive Transform Style Helpers
export const responsiveTransformStyle6 = {
  flat: "transform-style-flat",
  "preserve-3d": "transform-style-preserve-3d",
} as const

// Responsive Transform Style Helpers
export const responsiveTransformStyle7 = {
  flat: "transform-style-flat",
  "preserve-3d": "transform-style-preserve-3d",
} as const

// Responsive Transform Style Helpers
export const responsiveTransformStyle8 = {
  flat: "transform-style-flat",
  "preserve-3d": "transform-style-preserve-3d",
} as const

// Responsive Transform Style Helpers
export const responsiveTransformStyle9 = {
  flat: "transform-style-flat",
  "preserve-3d": "transform-style-preserve-3d",
} as const

// Responsive Transform Style Helpers
export const responsiveTransformStyle10 = {
  flat: "transform-style-flat",
  "preserve-3d": "transform-style-preserve-3d",
} as const 