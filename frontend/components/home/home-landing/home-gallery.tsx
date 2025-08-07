"use client"

import { Section } from "@/components/section"
import { AnimatedGallery } from "@/components/animated-gallery"

export function HomeGallery() {
  return (
    <Section className="py-16 sm:py-20 lg:py-24 bg-muted/50 rounded-3xl mx-auto max-w-7xl">
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-center animate-fade-up animate-delay-400 -mt-12 sm:-mt-16 lg:-mt-20">
          <AnimatedGallery className="max-w-4xl" />
        </div>
      </div>
    </Section>
  )
} 