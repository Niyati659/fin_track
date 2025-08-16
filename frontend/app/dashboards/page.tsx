"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Bar, BarChart } from "recharts"
import { TrendingUp, Calendar, BarChart3 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface MonthlyExpenseData {
  month: string
  FOOD_GROCERY: number
  EDUCATION: number
  RENTS_BILLS: number
  HEALTHCARE: number
  ENTERTAINMENT: number
  TRAVEL: number
  OTHERS: number
  LOAN_EMI: number
}

interface CategoryComparison {
  category: string
  displayName: string
  month1: number
  month2: number
  month3: number
  trend: "up" | "down" | "stable"
}

export default function DashboardsPage() {
  const [monthlyData, setMonthlyData] = useState<MonthlyExpenseData[]>([])
  const [categoryComparisons, setCategoryComparisons] = useState<CategoryComparison[]>([])
  const [loading, setLoading] = useState(true)
  const [hasData, setHasData] = useState(false)

  useEffect(() => {
    fetchMonthlyExpenseData()
  }, [])

  const fetchMonthlyExpenseData = async () => {
    try {
      const response = await fetch("/api/monthly-expenses")
      if (response.ok) {
        const data = await response.json()
        setMonthlyData(data.monthlyExpenses || [])
        setCategoryComparisons(data.categoryComparisons || [])
        setHasData(data.monthlyExpenses && data.monthlyExpenses.length > 0)
      }
    } catch (error) {
      console.error("Failed to fetch monthly expense data:", error)
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

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-red-500" />
    if (trend === "down") return <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />
    return <div className="h-4 w-4 bg-gray-400 rounded-full" />
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl py-16 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Dashboards</h1>
          <p className="text-muted-foreground">Loading your expense comparison data...</p>
        </div>
      </div>
    )
  }

  if (!hasData) {
    return (
      <div className="container mx-auto max-w-7xl py-16 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-8">Dashboards</h1>
          <Alert className="max-w-md mx-auto">
            <BarChart3 className="h-4 w-4" />
            <AlertTitle>No Data Available</AlertTitle>
            <AlertDescription>
              You need at least 3 months of expense data to view comparisons. Start tracking your expenses to see
              trends.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Dashboards</h1>
        <p className="text-muted-foreground">Compare your expenses across the last 3 months by category</p>
      </div>

      {/* Monthly Trend Chart */}
      <Card className="w-full mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            3-Month Expense Trends
          </CardTitle>
          <CardDescription>Track your spending patterns across different categories over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              FOOD_GROCERY: { label: "Food & Grocery", color: "hsl(var(--chart-1))" },
              EDUCATION: { label: "Education", color: "hsl(var(--chart-2))" },
              RENTS_BILLS: { label: "Rents & Bills", color: "hsl(var(--chart-3))" },
              HEALTHCARE: { label: "Healthcare", color: "hsl(var(--chart-4))" },
              ENTERTAINMENT: { label: "Entertainment", color: "hsl(var(--chart-5))" },
              TRAVEL: { label: "Travel", color: "hsl(var(--chart-6))" },
              OTHERS: { label: "Others", color: "hsl(var(--chart-7))" },
              LOAN_EMI: { label: "Loan-EMI", color: "hsl(var(--chart-8))" },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="month" fontSize={12} />
                <YAxis tickFormatter={(value) => `$${value}`} fontSize={12} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [formatCurrency(Number(value)), name]}
                />
                <Line type="monotone" dataKey="FOOD_GROCERY" stroke="var(--color-FOOD_GROCERY)" strokeWidth={2} />
                <Line type="monotone" dataKey="EDUCATION" stroke="var(--color-EDUCATION)" strokeWidth={2} />
                <Line type="monotone" dataKey="RENTS_BILLS" stroke="var(--color-RENTS_BILLS)" strokeWidth={2} />
                <Line type="monotone" dataKey="HEALTHCARE" stroke="var(--color-HEALTHCARE)" strokeWidth={2} />
                <Line type="monotone" dataKey="ENTERTAINMENT" stroke="var(--color-ENTERTAINMENT)" strokeWidth={2} />
                <Line type="monotone" dataKey="TRAVEL" stroke="var(--color-TRAVEL)" strokeWidth={2} />
                <Line type="monotone" dataKey="OTHERS" stroke="var(--color-OTHERS)" strokeWidth={2} />
                <Line type="monotone" dataKey="LOAN_EMI" stroke="var(--color-LOAN_EMI)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Category Comparison Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categoryComparisons.map((category) => (
          <Card key={category.category}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                {category.displayName}
                {getTrendIcon(category.trend)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Month 1:</span>
                  <span className="font-medium">{formatCurrency(category.month1)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Month 2:</span>
                  <span className="font-medium">{formatCurrency(category.month2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Month 3:</span>
                  <span className="font-medium">{formatCurrency(category.month3)}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    Avg: {formatCurrency((category.month1 + category.month2 + category.month3) / 3)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Comparison Bar Chart */}
      <Card className="w-full mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Category Comparison
          </CardTitle>
          <CardDescription>Side-by-side comparison of expenses across categories for the last 3 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              month1: { label: "Month 1", color: "hsl(var(--chart-1))" },
              month2: { label: "Month 2", color: "hsl(var(--chart-2))" },
              month3: { label: "Month 3", color: "hsl(var(--chart-3))" },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryComparisons} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <XAxis dataKey="displayName" angle={-45} textAnchor="end" height={80} fontSize={12} />
                <YAxis tickFormatter={(value) => `$${value}`} fontSize={12} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [formatCurrency(Number(value)), name]}
                />
                <Bar dataKey="month1" fill="var(--color-month1)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="month2" fill="var(--color-month2)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="month3" fill="var(--color-month3)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
