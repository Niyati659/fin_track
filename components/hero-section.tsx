'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  const scrollToFinancialOverview = () => {
    const element = document.getElementById('financial-overview')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          Take Control of Your
          <span className="text-primary block">Financial Future</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Track expenses, manage savings, and get AI-powered insights
        </p>
        <Button 
          size="lg" 
          className="text-lg px-8"
          onClick={scrollToFinancialOverview}
        >
          Start Tracking Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  )
}