"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, PiggyBank, Target, DollarSign, TrendingUp } from "lucide-react";

interface SavingsGoal {
  id: string;
  goal_name: string;
  target_amount: number;
  invested_amount: number;
}

export default function SavingsGoalsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Form states
  const [newGoalName, setNewGoalName] = useState("")
  const [newGoalTarget, setNewGoalTarget] = useState("")
  const [addFundAmount, setAddFundAmount] = useState<Record<string, string>>({})

  useEffect(() => {
    // Initialize userId from localStorage or create a new one
    let storedId = localStorage.getItem("userId");
    if (!storedId) {
      storedId = `user_${Date.now()}`;
      localStorage.setItem("userId", storedId);
    }
    setUserId(storedId);

    // Fetch savings data for the user
    fetchSavingsData(storedId);
  }, []);

  const fetchSavingsData = async (id: string) => {
    try {
      const response = await fetch(`/api/saving-goals?user_id=${id}`);
      if (response.ok) {
        const data = await response.json();
        const mappedGoals = data.map((goal: any) => ({
          id: goal.goal_id,
          goal_name: goal.goal_name,
          target_amount: goal.target_amount,
          invested_amount: goal.invested_amount,
        }));
        setGoals(mappedGoals);
      } else {
        console.error("Failed to fetch savings data:", await response.text());
      }
    } catch (error) {
      console.error("Failed to fetch savings data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createNewGoal = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const response = await fetch("/api/saving-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal_name: newGoalName,
          target_amount: Number(newGoalTarget),
          user_id: userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGoals((prev) => [
          ...prev,
          {
            id: data.goal_id,
            goal_name: newGoalName,
            target_amount: Number(newGoalTarget),
            invested_amount: 0,
          },
        ]);
        setNewGoalName("");
        setNewGoalTarget("");
        setIsCreateDialogOpen(false);
      } else {
        console.error("Failed to create goal:", await response.text());
      }
    } catch (error) {
      console.error("Failed to create goal:", error);
    } finally {
      setLoading(false);
    }
  };

  const addFundsToGoal = async (goalId: string) => {
  let storedId = localStorage.getItem("userId");
  try {
    const amount = Number.parseFloat(addFundAmount[goalId] || "0")
    if (amount <= 0) return

    const response = await fetch(`/api/saving-goals/${goalId}/add-funds`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amount, user_id: storedId}),
    })

    if (response.ok) {
      await fetchSavingsData(storedId||"")
      setAddFundAmount((prev) => ({ ...prev, [goalId]: "" })) // reset only this goal
    }
  } catch (error) {
    console.error("Failed to add funds:", error)
  }
}

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl py-16 px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="h-9 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="h-10 w-36 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto max-w-7xl py-16 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-balance mb-2 text-white">Your Savings Goals</h1>
            <p className="text-gray-400 text-lg">Track your progress and achieve your financial dreams</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg">
                <Plus className="h-5 w-5 mr-2" />
                Create New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl font-bold">Create New Savings Goal</DialogTitle>
                <DialogDescription className="text-base">
                  Set a target amount and start saving towards your financial goal.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-name" className="text-sm font-medium">
                    Goal Name
                  </Label>
                  <Input
                    id="goal-name"
                    placeholder="e.g., Emergency Fund, Vacation, New Car"
                    value={newGoalName}
                    onChange={(e) => setNewGoalName(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-amount" className="text-sm font-medium">
                    Target Amount
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="target-amount"
                      type="number"
                      placeholder="10000"
                      value={newGoalTarget}
                      onChange={(e) => setNewGoalTarget(e.target.value)}
                      className="h-11 pl-10"
                    />
                  </div>
                </div>
                <Button
                  onClick={createNewGoal}
                  className="w-full h-11 bg-indigo-600 hover:bg-indigo-700"
                  disabled={!newGoalName || !newGoalTarget}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Create Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {goals.length === 0 ? (
          <div className="bg-gray-900/50 rounded-3xl p-16 text-center border border-gray-800">
            <div className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center bg-indigo-600 shadow-lg">
              <PiggyBank className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-4 text-balance text-white">Start Your Savings Journey</h3>
            <p className="text-gray-400 text-xl max-w-md mx-auto text-pretty">
              Create your first savings goal to begin tracking your financial progress and turn your dreams into
              achievable targets.
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              size="lg"
              className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Goal
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {goals.map((goal) => {
              const progress = calculateProgress(goal.invested_amount, goal.target_amount);
              const isCompleted = progress >= 100;

              return (
                <Card
                  key={goal.id}
                  className={`group border-0 bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-800 ${
                    isCompleted ? "ring-2 ring-green-500/20" : ""
                  }`}
                >
                  <CardHeader className="bg-gray-800/50 pb-4">
                    <CardTitle className="flex items-start justify-between gap-3">
                      <span className="text-xl font-bold text-balance leading-tight text-white">{goal.goal_name}</span>
                      {isCompleted && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-base pt-1">
                      <Target className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400 font-medium">Target:</span>
                      <span className="font-bold text-lg text-white">{formatCurrency(goal.target_amount)}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6 p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg text-white">Progress</span>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${isCompleted ? "text-green-400" : "text-indigo-400"}`}>
                            {progress.toFixed(1)}%
                          </div>
                          {isCompleted && <span className="text-xs text-green-400 font-medium">Completed!</span>}
                        </div>
                      </div>

                      <div className="relative">
                        <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-700 ease-out rounded-full ${
                              isCompleted ? "bg-green-500" : "bg-indigo-500"
                            }`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-950/40 rounded-xl p-4 border border-green-900/40">
                        <div className="text-xs text-green-400 font-medium uppercase tracking-wide mb-1">Saved</div>
                        <div className="font-bold text-lg text-green-300">{formatCurrency(goal.invested_amount)}</div>
                      </div>

                      <div className="bg-orange-950/40 rounded-xl p-4 border border-orange-900/40">
                        <div className="text-xs text-orange-400 font-medium uppercase tracking-wide mb-1">
                          Remaining
                        </div>
                        <div className="font-bold text-lg text-orange-300">
                          {formatCurrency(Math.max(0, goal.target_amount - goal.invested_amount))}
                        </div>
                      </div>
                    </div>

                    {!isCompleted && (
                      <div className="space-y-3 pt-2">
                        <Label className="text-sm font-medium text-white">Add Funds</Label>
                        <div className="flex gap-3">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400">₹</span>
                            <Input
                              type="number"
                              placeholder="Amount"
                              value={addFundAmount[goal.id] || ""}
                              onChange={(e) =>
                                setAddFundAmount((prev) => ({
                                  ...prev,
                                  [goal.id]: e.target.value,
                                }))
                              }
                              className="pl-10 h-11 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                            />
                          </div>
                          <Button
                            onClick={() => addFundsToGoal(goal.id)}
                            disabled={!addFundAmount[goal.id] || Number(addFundAmount[goal.id]) <= 0}
                            className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700"
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

