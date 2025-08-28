"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, PiggyBank } from "lucide-react";

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

  // Form states
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [addFundAmount, setAddFundAmount] = useState("");

  const user_id = localStorage.getItem("userId");

  useEffect(() => {
    fetchSavingsData();
  }, []);

  const fetchSavingsData = async () => {
    const user_id = localStorage.getItem("userId");
    try {
      const response = await fetch(`/api/saving-goals?user_id=${user_id}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Data:", data); // Debugging log

        // Map the fetched data to the SavingsGoal interface
        const mappedGoals = data.map((goal: any) => ({
          id: goal.goal_id,
          goal_name: goal.goal_name,
          target_amount: goal.target_amount,
          invested_amount: goal.invested_amount,
        }));

        console.log("Mapped Goals:", mappedGoals); // Debugging log

        setGoals(mappedGoals); // Update the goals state
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
    try {
      setLoading(true);

      const response = await fetch("/api/saving-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal_name: newGoalName,
          target_amount: Number(newGoalTarget),
          user_id: user_id,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        console.log("Goal created with ID:", data.goal_id);

        // Dynamically update the goals state
        setGoals((prevGoals) => [
          ...prevGoals,
          {
            id: data.goal_id,
            goal_name: newGoalName,
            target_amount: Number(newGoalTarget),
            invested_amount: 0,
          },
        ]);

        // Reset form fields
        setNewGoalName("");
        setNewGoalTarget("");

        // Close the dialog
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
    try {
      const response = await fetch(`/api/saving-goals/${goalId}/add-funds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number.parseFloat(addFundAmount) }),
      });

      if (response.ok) {
        await fetchSavingsData();
        setSelectedGoal(null);
        setAddFundAmount("");
      }
    } catch (error) {
      console.error("Failed to add funds:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto max-w-7xl py-16 px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Your Goals</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Goal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Savings Goal</DialogTitle>
            </DialogHeader>
            <div>
              <Label>Goal Name</Label>
              <Input value={newGoalName} onChange={(e) => setNewGoalName(e.target.value)} />
              <Label>Target Amount</Label>
              <Input value={newGoalTarget} onChange={(e) => setNewGoalTarget(e.target.value)} />
              <Button onClick={createNewGoal}>Create Goal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
            const progress = calculateProgress(goal.invested_amount, goal.target_amount);

            return (
              <Card
                key={goal.id}
                className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden"
              >
                <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20">
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate text-lg font-bold">{goal.goal_name}</span>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-base">
                    <span className="text-sm text-muted-foreground font-medium">Target:</span>
                    <span className="font-bold">{formatCurrency(goal.target_amount)}</span>
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
                      <span className="text-sm text-muted-foreground font-medium">Invested:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(goal.invested_amount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground font-medium">Remaining:</span>
                      <span className="font-bold text-orange-600 dark:text-orange-400">
                        {formatCurrency(goal.target_amount - goal.invested_amount)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <Input
                      placeholder="Add funds"
                      value={addFundAmount}
                      onChange={(e) => setAddFundAmount(e.target.value)}
                      className="w-2/3"
                    />
                    <Button
                      onClick={() => addFundsToGoal(goal.id)}
                      className="w-1/3 bg-blue-500 text-white"
                    >
                      Add Funds
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
