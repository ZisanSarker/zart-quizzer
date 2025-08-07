"use client"

import { HomeHero } from "./home-hero"
import { HomeFeatures } from "./home-features"
import { HomeGallery } from "./home-gallery"
import { HomeShareSection } from "./home-share-section"

export function HomeLanding() {
  return (
    <>
      <HomeHero />
      <HomeFeatures />
      <HomeGallery />
      <HomeShareSection />
    </>
  )
} 