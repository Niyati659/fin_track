import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">FinTrack</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </a>
          <a href="/expense-tracking" className="text-muted-foreground hover:text-foreground transition-colors">
            Expense Tracking
          </a>
          <a href="/dashboards" className="text-muted-foreground hover:text-foreground transition-colors">
            Dashboards
          </a>
          <a href="/advisory-hub" className="text-muted-foreground hover:text-foreground transition-colors">
            Advisory Hub
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            Contact Us
          </a>
          <Button>Sign In</Button>
        </div>
      </div>
    </header>
  )
}
