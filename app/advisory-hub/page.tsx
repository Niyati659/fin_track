"use client"

import type React from "react"

import { useState } from "react"
import { TrendingUp, DollarSign, Target, Clock, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// Update the interface to match API response
interface Recommendation {
  stocks: {
    category: string
    recommendations: {
      name: string
      price: string
    }[]
  }
  mutualFunds: {
    category: string
    recommendations: {
      name: string
      nav: string
    }[]
  }
}

export default function AdvisoryHubPage() {
  const [formData, setFormData] = useState({
    risk: "",
    investmentHorizon: "",
    investmentAmount: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [eventId, setEventId] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.risk || !formData.investmentHorizon || !formData.investmentAmount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to get recommendations.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Step 1: Get event ID from POST request
      const postResponse = await fetch("/api/investment-advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!postResponse.ok) {
        throw new Error("Failed to submit investment preferences")
      }

      const { eventId: newEventId } = await postResponse.json()
      setEventId(newEventId)

      // Step 2: Poll for results using the event ID
      let attempts = 0
      const maxAttempts = 10

      const pollForResults = async () => {
        try {
          const getResponse = await fetch(`/api/investment-advisor?eventId=${newEventId}`)

          if (getResponse.ok) {
            const data = await getResponse.json()
            if (data.recommendations) {
              setRecommendations(data.recommendations)
              setIsLoading(false)
              toast({
                title: "Recommendations Ready!",
                description: "Your personalized investment recommendations have been generated.",
              })
              return
            }
          }

          attempts++
          if (attempts < maxAttempts) {
            setTimeout(pollForResults, 2000) // Poll every 2 seconds
          } else {
            throw new Error("Timeout waiting for recommendations")
          }
        } catch (error) {
          console.error("Error polling for results:", error)
          setIsLoading(false)
          toast({
            title: "Error",
            description: "Failed to get recommendations. Please try again.",
            variant: "destructive",
          })
        }
      }

      pollForResults()
    } catch (error) {
      console.error("Error:", error)
      setIsLoading(false)
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({ risk: "", investmentHorizon: "", investmentAmount: "" })
    setEventId(null)
    setRecommendations(null)
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gray-800 rounded-full">
                <TrendingUp className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Advisory Hub</h1>
            <p className="text-xl text-muted-foreground">AI-powered investment recommendations tailored for you</p>
          </div>

          {!recommendations ? (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Investment Preferences
                </CardTitle>
                <CardDescription>
                  Tell us about your investment goals to get personalized recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="risk">Risk Tolerance</Label>
                    <Select value={formData.risk} onValueChange={(value) => setFormData({ ...formData, risk: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your risk tolerance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Conservative">Conservative - Lower risk, stable returns</SelectItem>
                        <SelectItem value="Moderate">Moderate - Balanced risk and returns</SelectItem>
                        <SelectItem value="Aggressive">
                          Aggressive - Higher risk, potential for higher returns
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="horizon">Investment Horizon</Label>
                    <Select
                      value={formData.investmentHorizon}
                      onValueChange={(value) => setFormData({ ...formData, investmentHorizon: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your investment timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Short-term">Short Term - Less than 2 years</SelectItem>
                        <SelectItem value="Medium-term">Medium Term - 2-7 years</SelectItem>
                        <SelectItem value="Long-term">Long Term - More than 7 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Investment Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter your investment amount"
                      value={formData.investmentAmount}
                      onChange={(e) => setFormData({ ...formData, investmentAmount: e.target.value })}
                      min="100"
                      step="100"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Recommendations...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Get Investment Recommendations
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Your Investment Recommendations</h2>
                  <p className="text-muted-foreground">Based on your preferences and risk profile</p>
                </div>
                <Button variant="outline" onClick={resetForm}>
                  New Analysis
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Stock Recommendations
                    </CardTitle>
                    <CardDescription>Category: {recommendations.stocks.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recommendations.stocks.recommendations.map((stock, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 bg-primary rounded-full"></div>
                            <span className="font-medium">{stock.name}</span>
                          </div>
                          <span className="text-muted-foreground">₹{stock.price}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Mutual Fund Recommendations
                    </CardTitle>
                    <CardDescription>Category: {recommendations.mutualFunds.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recommendations.mutualFunds.recommendations.map((fund, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 bg-primary rounded-full"></div>
                            <span className="font-medium">{fund.name}</span>
                          </div>
                          <span className="text-muted-foreground">NAV: ₹{fund.nav}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        AI Generated
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Investment Summary</h3>
                      <p className="text-sm text-muted-foreground">
                        Risk Profile: <span className="font-medium capitalize">{formData.risk}</span> • Timeline:{" "}
                        <span className="font-medium capitalize">{formData.investmentHorizon}</span> • Amount:{" "}
                        <span className="font-medium">
                          ${Number.parseInt(formData.investmentAmount).toLocaleString()}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        These recommendations are generated by AI based on your preferences. Please consult with a
                        financial advisor before making investment decisions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}