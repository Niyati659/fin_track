"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, PiggyBank } from "lucide-react"

interface FinancialData {
  totalIncome: number
  totalExpenses: number
  totalSavings: number
}

export function FinancialOverview() {
  const [data, setData] = useState<FinancialData>({
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in (you can implement your auth logic here)
    const checkAuthStatus = () => {
      // For demo purposes, we'll simulate checking auth status
      // Replace this with your actual auth check
      const token = localStorage.getItem("authToken")
      setIsLoggedIn(!!token)
    }

    checkAuthStatus()

    // If logged in, fetch financial data
    if (isLoggedIn) {
      fetchFinancialData()
    }
  }, [isLoggedIn])

  const fetchFinancialData = async () => {
    try {
      const response = await fetch("/api/financial-overview")
      if (response.ok) {
        const financialData = await response.json()
        setData(financialData)
      }
    } catch (error) {
      console.error("Failed to fetch financial data:", error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Financial Overview</h2>
          <p className="text-muted-foreground">
            {isLoggedIn ? "Your current financial snapshot" : "Sign in to view your financial data"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Total Income */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(data.totalIncome)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {isLoggedIn ? "This month" : "Login to see your income"}
              </p>
            </CardContent>
          </Card>

          {/* Total Expenses */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(data.totalExpenses)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {isLoggedIn ? "This month" : "Login to see your expenses"}
              </p>
            </CardContent>
          </Card>

          {/* Total Savings */}
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Savings</CardTitle>
              <PiggyBank className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(data.totalSavings)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {isLoggedIn ? "Available balance" : "Login to see your savings"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
