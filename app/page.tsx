import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Problem } from "@/components/landing/problem"
import { Solution } from "@/components/landing/solution"
import { Demo } from "@/components/landing/demo"
import { Workflow } from "@/components/landing/workflow"
import { Comparison } from "@/components/landing/comparison"
import { Testimonials } from "@/components/landing/testimonials"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"
import { AnimatedBackground } from "@/components/effects/animated-background"
import { NotificationPopup } from "@/components/effects/notification-popup"

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden relative">
      {/* Global animated background */}
      <AnimatedBackground />
      
      {/* Notification popups */}
      <NotificationPopup />
      
      {/* Page content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Problem />
        <Solution />
        <Demo />
        <Workflow />
        <Comparison />
        <Testimonials />
        <CTA />
        <Footer />
      </div>
    </main>
  )
}
