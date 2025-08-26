"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Target, Plus, TrendingUp, DollarSign, Sparkles, Clock, PiggyBank } from "lucide-react"

interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
}

interface SavingsOverview {
  totalSavings: number
  monthlyInvested: number
  remainingToInvest: number
  monthlyTarget: number
}

export default function SavingsGoalsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [overview, setOverview] = useState<SavingsOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)

  // Form states
  const [newGoalName, setNewGoalName] = useState("")
  const [newGoalTarget, setNewGoalTarget] = useState("")
  const [newGoalDeadline, setNewGoalDeadline] = useState("")
  const [newGoalCategory, setNewGoalCategory] = useState("")
  const [addFundAmount, setAddFundAmount] = useState("")

  useEffect(() => {
    fetchSavingsData()
  }, [])

  const fetchSavingsData = async () => {
    try {
      const response = await fetch("/api/savings-goals")
      if (response.ok) {
        const data = await response.json()
        setGoals(data.goals || [])
        setOverview(data.overview || null)
      }
    } catch (error) {
      console.error("Failed to fetch savings data:", error)
    } finally {
      setLoading(false)
    }
  }

  const createNewGoal = async () => {
    try {
      const response = await fetch("/api/savings-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newGoalName,
          targetAmount: Number.parseFloat(newGoalTarget),
          deadline: newGoalDeadline,
          category: newGoalCategory,
        }),
      })

      if (response.ok) {
        await fetchSavingsData()
        setIsCreateDialogOpen(false)
        // Reset form
        setNewGoalName("")
        setNewGoalTarget("")
        setNewGoalDeadline("")
        setNewGoalCategory("")
      }
    } catch (error) {
      console.error("Failed to create goal:", error)
    }
  }

  const addFundsToGoal = async (goalId: string) => {
    try {
      const response = await fetch(`/api/savings-goals/${goalId}/add-funds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number.parseFloat(addFundAmount) }),
      })

      if (response.ok) {
        await fetchSavingsData()
        setSelectedGoal(null)
        setAddFundAmount("")
      }
    } catch (error) {
      console.error("Failed to add funds:", error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getDaysRemaining = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl py-16 px-4">
        <div className="text-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-12">
          <div className="animate-pulse">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: "#343434" }}
            >
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1
              className="text-4xl font-bold mb-4"
              style={{
                background: `linear-gradient(to right,#5A6CFF, #5A6CFF)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Saving Goals
            </h1>
            <p className="text-muted-foreground">Loading your financial dreams...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl py-16 px-4">
      <div className="text-center mb-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-8">
        <div className="inline-flex items-center gap-3 mb-4">
         
          <h1 className="text-4xl font-bold text-white">Saving Goals</h1>
        </div>
        <p className="text-lg text-muted-foreground">Track your progress and achieve your financial dreams</p>
      </div>

      {/* Savings Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              Total Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {overview ? formatCurrency(overview.totalSavings) : "$0.00"}
            </div>
            {!overview && <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">Login to view data</p>}
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {overview ? formatCurrency(overview.monthlyInvested) : "$0.00"}
            </div>
            <p className="text-sm text-blue-600/70 dark:text-blue-400/70 font-medium">
              {overview ? "Invested" : "Login to view data"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300 flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Target className="h-4 w-4 text-white" />
              </div>
              Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {overview ? formatCurrency(overview.remainingToInvest) : "$0.00"}
            </div>
            <p className="text-sm text-orange-600/70 dark:text-orange-400/70 font-medium">
              {overview ? "To reach monthly target" : "Login to view data"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create New Goal Button */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
          Your Goals
        </h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              style={{ background: "#343434" }}
            >
              <Plus className="h-4 w-4" />
              Create New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Create New Savings Goal</DialogTitle>
              <DialogDescription className="text-base">
                Set up a new financial goal to track your progress
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="goalName" className="text-sm font-medium">
                  Goal Name
                </Label>
                <Input
                  id="goalName"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  placeholder="e.g., Emergency Fund, Vacation, New Car"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetAmount" className="text-sm font-medium">
                  Target Amount
                </Label>
                <Input
                  id="targetAmount"
                  type="number"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  placeholder="10000"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-sm font-medium">
                  Target Date
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newGoalDeadline}
                  onChange={(e) => setNewGoalDeadline(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category
                </Label>
                <Input
                  id="category"
                  value={newGoalCategory}
                  onChange={(e) => setNewGoalCategory(e.target.value)}
                  placeholder="e.g., Emergency, Travel, Investment"
                  className="h-11"
                />
              </div>
              <Button onClick={createNewGoal} className="w-full h-11 text-white" style={{ background: "#343434" }}>
                Create Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950/50 dark:to-blue-950/20 rounded-2xl p-12 text-center">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: "#5A6CFF" }}
          >
            <PiggyBank className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-2">No Goals Yet</h3>
          <p className="text-muted-foreground text-lg">
            Create your first savings goal to start tracking your financial progress.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount)
            const daysRemaining = getDaysRemaining(goal.deadline)

            return (
              <Card
                key={goal.id}
                className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden"
              >
                <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20">
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate text-lg font-bold">{goal.name}</span>
                    <span
                      className="text-sm text-white px-3 py-1 rounded-full font-medium"
                      style={{ background: "#343434" }}
                    >
                      {goal.category}
                    </span>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-base">
                    <Clock className="h-4 w-4" />
                    {daysRemaining > 0 ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {daysRemaining} days remaining
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 font-medium">Goal deadline passed</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="font-medium">Progress</span>
                      <span className="font-bold text-lg">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={progress} className="h-3 bg-gray-200 dark:bg-gray-700" />
                      <div
                        className="absolute top-0 left-0 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%`, background: "#5A6CFF" }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground font-medium">Current:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(goal.currentAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground font-medium">Target:</span>
                      <span className="font-bold">{formatCurrency(goal.targetAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground font-medium">Remaining:</span>
                      <span className="font-bold text-orange-600 dark:text-orange-400">
                        {formatCurrency(goal.targetAmount - goal.currentAmount)}
                      </span>
                    </div>
                  </div>

                  <Dialog
                    open={selectedGoal === goal.id}
                    onOpenChange={(open) => setSelectedGoal(open ? goal.id : null)}
                  >
                    <DialogTrigger asChild>
                      <Button className="w-full h-11 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Funds
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Add Funds to {goal.name}</DialogTitle>
                        <DialogDescription className="text-base">
                          Current progress:{" "}
                          <span className="font-semibold text-green-600">{formatCurrency(goal.currentAmount)}</span> of{" "}
                          <span className="font-semibold">{formatCurrency(goal.targetAmount)}</span>
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="addAmount" className="text-sm font-medium">
                            Amount to Add
                          </Label>
                          <Input
                            id="addAmount"
                            type="number"
                            value={addFundAmount}
                            onChange={(e) => setAddFundAmount(e.target.value)}
                            placeholder="500"
                            className="h-11"
                          />
                        </div>
                        <Button
                          onClick={() => addFundsToGoal(goal.id)}
                          className="w-full h-11 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Funds
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
