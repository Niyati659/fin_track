"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { BarChart3 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ExpenseData {
  category: string
  amount: number
  displayName: string
}

export default function ExpenseTrackingPage() {
  const [expenseData, setExpenseData] = useState<ExpenseData[]>([])
  const [loading, setLoading] = useState(true)
  const [hasExpenses, setHasExpenses] = useState(false)

  useEffect(() => {
    fetchExpenseData()
  }, [])

  const fetchExpenseData = async () => {
    const userId = localStorage.getItem('userId')
  
    console.log("Fetching expense data..."  )
    try {
       const response = await fetch(`/api/expense-categories?userId=${userId}`)
      console.log("Response status:", response)
      if (response.ok) {
        const data = await response.json()
        setExpenseData(data.expenses || [])
        setHasExpenses(data.expenses && data.expenses.length > 0)
      }
    } catch (error) {
      console.error("Failed to fetch expense data:", error)
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

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl py-16 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Expense Tracking</h1>
          <p className="text-muted-foreground">Loading your expense data...</p>
        </div>
      </div>
    )
  }

  if (!hasExpenses) {
    return (
      <div className="container mx-auto max-w-6xl py-16 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-8">Expense Tracking</h1>
          <Alert className="max-w-md mx-auto">
            <BarChart3 className="h-4 w-4" />
            <AlertTitle>No Expenses Found</AlertTitle>
            <AlertDescription>
              You haven't recorded any expenses yet. Start by adding your first expense to see your spending patterns.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Expense Tracking</h1>
        <p className="text-muted-foreground">Visualize your spending patterns across different categories</p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Expenses by Category
          </CardTitle>
          <CardDescription>Your spending breakdown across different expense categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              amount: {
                label: "Amount",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <XAxis dataKey="displayName" angle={-45} textAnchor="end" height={80} fontSize={12} />
                <YAxis tickFormatter={(value) => `$${value}`} fontSize={12} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value) => [formatCurrency(Number(value)), "Amount"]}
                />
                <Bar dataKey="amount" fill="var(--color-amount)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {expenseData.map((expense) => (
          <Card key={expense.category}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{expense.displayName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(expense.amount)}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
