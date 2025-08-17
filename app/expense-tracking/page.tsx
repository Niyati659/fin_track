"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { BarChart3, TrendingUp } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion } from "framer-motion"

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
    const userId = localStorage.getItem("userId")

    try {
      const response = await fetch(`/api/expense-categories?userId=${userId}`)
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <h1 className="text-4xl font-extrabold text-teal-400 mb-4 drop-shadow-md">
            Expense Tracking
          </h1>
          <p className="text-gray-400 animate-pulse">Loading your expense data...</p>
        </motion.div>
      </div>
    )
  }

  if (!hasExpenses) {
    return (
      <div className="container mx-auto max-w-6xl py-16 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-4xl font-extrabold text-teal-400 mb-8 drop-shadow-md">
            Expense Tracking
          </h1>
          <Alert className="max-w-md mx-auto backdrop-blur-md bg-teal-900/30 border-teal-600/40 shadow-lg">
            <BarChart3 className="h-5 w-5 text-teal-400" />
            <AlertTitle className="text-teal-300">No Expenses Found</AlertTitle>
            <AlertDescription className="text-gray-300">
              You haven&apos;t recorded any expenses yet. Add your first expense to see insights.
            </AlertDescription>
          </Alert>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl py-16 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300 mb-4 drop-shadow-md">
          Expense Tracking
        </h1>
        <p className="text-gray-400">Visualize your spending patterns across categories</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="w-full backdrop-blur-xl bg-white/5 border border-gray-700/30 shadow-2xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-teal-400 font-semibold">
              <TrendingUp className="h-6 w-6" />
              Expenses by Category
            </CardTitle>
            <CardDescription className="text-gray-400">
              Your spending breakdown across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                amount: {
                  label: "Amount",
                  color: "url(#tealSoftGradient)",
                },
              }}
              className="h-[520px]" // ⬅️ enlarged chart height
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <defs>
                    <linearGradient id="tealSoftGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5EEAD4" stopOpacity={0.9} />   {/* light cyan-teal */}
                      <stop offset="100%" stopColor="#0D9488" stopOpacity={0.5} /> {/* faded teal */}
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="displayName"
                    angle={-30}
                    textAnchor="end"
                    height={60}
                    fontSize={13}
                    tick={{ fill: "#9CA3AF" }}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${value}`}
                    fontSize={13}
                    tick={{ fill: "#9CA3AF" }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value) => [formatCurrency(Number(value))]}
                  />
                  <Bar dataKey="amount" fill="url(#tealSoftGradient)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>


      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {expenseData.map((expense, index) => (
          <motion.div
            key={expense.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
          >
           <Card className="relative overflow-hidden rounded-2xl border border-teal-600/20 shadow-md hover:scale-[1.02] transition-transform duration-300">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 to-transparent pointer-events-none" />

              <CardHeader className="relative pb-2">
                <CardTitle className="text-sm font-medium text-teal-400">
                  {expense.displayName}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl font-bold text-teal-400">
                  {formatCurrency(expense.amount)}
                </div>
              </CardContent>
            </Card>

          </motion.div>
        ))}
      </div>
    </div>
  )
}
