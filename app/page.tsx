
import { HeroSection } from "@/components/hero-section"
import { QuickActions } from "@/components/quick-actions"
import { FinancialOverview } from "@/components/financial-overview"
import { FeaturesSection } from "@/components/features-section"


export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <QuickActions />
        <FinancialOverview />
        <FeaturesSection />
      </main>
     
    </div>
  )
}
