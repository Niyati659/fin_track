"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, MinusCircle, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function QuickActions() {
  const [incomeAmount, setIncomeAmount] = useState("")
  const [expenseAmount, setExpenseAmount] = useState("")
  const [expenseCategory, setExpenseCategory] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleAddIncome = async () => {
    if (!incomeAmount) {
      toast({
        title: "Error",
        description: "Please enter income amount",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/add-income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(incomeAmount),
          date: new Date().toISOString(),
          user_id: localStorage.getItem('userId'), // Assuming user ID is stored in localStorage
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Income added successfully!",
        })
        setIncomeAmount("")
      } else {
        throw new Error("Failed to add income")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add income. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddExpense = async () => {
    if (!expenseAmount || !expenseCategory) {
      toast({
        title: "Error",
        description: "Please fill in all expense fields",
        variant: "destructive",
      })
      return
    }
    console.log(localStorage.getItem('userId'),expenseAmount, expenseCategory)
    setLoading(true)
    try {
      const response = await fetch("/api/add-expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(expenseAmount),
          category: expenseCategory,
          user_id: localStorage.getItem('userId'), 
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Expense added successfully!",
        })
        setExpenseAmount("")
        setExpenseCategory("")
      } else {
        throw new Error("Failed to add expense")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Quick Actions</h2>
          <p className="text-muted-foreground">Add your income and expenses instantly</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Add Income Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-green-600" />
                Add Income
              </CardTitle>
              <CardDescription>Record your earnings and income sources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="income-amount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="income-amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-10"
                    value={incomeAmount}
                    onChange={(e) => setIncomeAmount(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleAddIncome} disabled={loading} className="w-full">
                {loading ? "Adding..." : "Add Income"}
              </Button>
            </CardContent>
          </Card>

          {/* Add Expense Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MinusCircle className="h-5 w-5 text-red-600" />
                Add Expense
              </CardTitle>
              <CardDescription>Track your spending and expenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="expense-amount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="expense-amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-10"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="expense-category">Category</Label>
                <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FOOD & GROCERY">Food & Grocery</SelectItem>
                    <SelectItem value="EDUCATION">Education</SelectItem>
                    <SelectItem value="RENTS & BILLS">Rents & Bills</SelectItem>
                    <SelectItem value="HEALTHCARE">Healthcare</SelectItem>
                    <SelectItem value="ENTERTAINMENT">Entertainment</SelectItem>
                    <SelectItem value="TRAVEL">Travel</SelectItem>
                    <SelectItem value="OTHERS">Others</SelectItem>
                    <SelectItem value="LOAN-EMI">Loan-EMI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddExpense} disabled={loading} className="w-full">
                {loading ? "Adding..." : "Add Expense"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
