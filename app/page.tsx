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

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
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
    </main>
  )
}
