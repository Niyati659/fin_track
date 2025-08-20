'use client'
import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { LoginModal } from "./loginModal"
import { SignupModal } from "./signupModal"

export function Header() {
  const [userId, setUserId] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    // Check for existing user ID in localStorage on component mount
    const cachedUserId = localStorage.getItem('userId')
    if (cachedUserId) {
      setUserId(cachedUserId)
    }
    const cachedUserName = localStorage.getItem('username')
    if (cachedUserName) {
      setUsername(cachedUserName)
    }
  }, [])

  const handleLoginSuccess = (newUserId: string) => {
    setUserId(newUserId)
  }

  const handleSignupSuccess = (newUserId: string) => {
    setUserId(newUserId)
  }

  const handleLogout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    setUserId(null)
    setUsername(null)
  }  
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
           {userId ? (
            <>
              <span className="text-sm text-muted-foreground">
                Welcome, User {username}
              </span>
              <Button onClick={handleLogout}>
                Log Out
              </Button>
            </>
          ) : (
            <>
              <LoginModal onLoginSuccess={handleLoginSuccess} />
              <SignupModal onSignupSuccess={handleSignupSuccess} />
            </>
          )}
        </div>
      </div>
    </header>
  )
}
