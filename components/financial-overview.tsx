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
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    setIsLoggedIn(!!userId)
    if (userId) {
      fetchFinancialData()
    }
  }, [])

  const fetchFinancialData = async () => {
    const userId = localStorage.getItem('userId')
    if (!userId) return

    try {
      // Fetch total income
      const incomeResponse = await fetch(`/api/financial-overview?userId=${userId}`)
      console.log(incomeResponse)
      const incomeData = await incomeResponse.json()
      console.log(incomeData)
      const totalIncome = Array.isArray(incomeData) && incomeData.length > 0 
        ? incomeData[0].income 
        : 0

      // Fetch expenses by category
      const expensesResponse = await fetch(`/api/expense-categories?userId=${userId}`)
      const expensesData = await expensesResponse.json()
      
      // Calculate total expenses by summing up all categories
      const totalExpenses = expensesData.expenses?.reduce((sum: number, expense: any) => 
        sum + (expense.amount || 0), 0) || 0

      // Calculate savings
      const totalSavings = totalIncome - totalExpenses

      setData({
        totalIncome,
        totalExpenses,
        totalSavings
      })
    } catch (error) {
      console.error("Failed to fetch financial data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // if (!isLoggedIn) {
  //   return (
  //     <section className="py-16 px-4">
  //       <div className="container mx-auto max-w-6xl text-center">
  //         <h2 className="text-3xl font-bold text-foreground mb-4">Financial Overview</h2>
  //         <p className="text-muted-foreground">Please login to view your financial data</p>
  //       </div>
  //     </section>
  //   )
  // }

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
              <div className="text-2xl font-bold text-green-600">
                {loading ? "Loading..." : formatCurrency(isLoggedIn ? data.totalIncome : 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isLoggedIn ? "This month" : "Login to see your actual income"}
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
              <div className="text-2xl font-bold text-red-600">
                {loading ? "Loading..." : formatCurrency(isLoggedIn ? data.totalExpenses : 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isLoggedIn ? "This month" : "Login to see your actual expenses"}
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
              <div className="text-2xl font-bold text-blue-600">
                {loading ? "Loading..." : formatCurrency(isLoggedIn ? data.totalSavings : 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isLoggedIn ? "Available balance" : "Login to see your actual savings"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
