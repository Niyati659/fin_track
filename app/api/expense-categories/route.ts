import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
     if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }
    console.log(`${process.env.BACKEND_API_URL}fintrack/getExpenses/${userId}`)
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}fintrack/getExpenses/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!backendResponse.ok) {
      throw new Error("Backend API call failed")
    }
    const result = await backendResponse.json()
    console.log(result);
    // Define the standard categories with display names
    const categoryMapping = {
      FOOD_GROCERY: "Food & Grocery",
      EDUCATION: "Education",
      RENTS_BILLS: "Rents & Bills",
      HEALTHCARE: "Healthcare",
      ENTERTAINMENT: "Entertainment",
      TRAVEL: "Travel",
      OTHERS: "Others",
      LOAN_EMI: "Loan-EMI",
    }

    // Transform backend data to match our category structure
    const expensesByCategory = Object.entries(categoryMapping).map(([key, displayName]) => ({
      category: key,
      displayName,
      amount: result.categories?.[key] || 0,
    }))

    // Filter out categories with zero amounts for cleaner visualization
    const nonZeroExpenses = expensesByCategory.filter((expense) => expense.amount > 0)

    return NextResponse.json({
      success: true,
      expenses: nonZeroExpenses,
      totalExpenses: nonZeroExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    })
  } catch (error) {
    console.error("Error fetching expense categories:", error)
    return NextResponse.json({ error: "Failed to fetch expense categories" }, { status: 500 })
  }
}
