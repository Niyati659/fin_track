'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SignupModalProps {
  onSignupSuccess: (userId: string) => void
}

export function SignupModal({ onSignupSuccess }: SignupModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleSignup = async () => {
    try {
      setIsLoading(true)
      setError("")

      if (!username || !password) {
        throw new Error("Username and password are required")
      }

      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Extract the specific error message from the backend response
        const errorMessage = data.error || data.message || 'Failed to create account'
        
        if (errorMessage.includes("duplicate")) {
          throw new Error("Username already exists. Please choose a different username.")
        } else {
          throw new Error(errorMessage)
        }
      }

      localStorage.setItem('userId', data.user.id)
      localStorage.setItem('username', username)
      onSignupSuccess(data.user.id)
      setOpen(false)
      window.location.reload()
      
    } catch (error: any) {
      console.error("Signup error:", error)
      setError(error.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Sign Up</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create an Account</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter a unique username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
         
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Choose a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/50 p-2 rounded">
              {error}
            </p>
          )}
          <Button
            className="w-full"
            onClick={handleSignup}
            disabled={isLoading || !username || !password}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}