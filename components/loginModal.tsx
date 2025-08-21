'use client'
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginModalProps {
  onLoginSuccess: (userId: string) => void
}
interface LoginResponse {
  message: string
  user:{
    id:string
  }
}  

export function LoginModal({ onLoginSuccess }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      setError("")

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json() as LoginResponse

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }
      console.log('Login successful:', data.user.id)
      // Store user ID in localStorage
      console.log('Login successful:', username)
      localStorage.setItem('userId', data.user.id)
      localStorage.setItem('username', username)
      onLoginSuccess(data.user.id)
      setOpen(false) // Close the modal
      window.location.reload()
      
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Log In</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login to FinTrack</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}