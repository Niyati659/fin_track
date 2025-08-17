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
        'FOOD & GROCERY': "Food & Grocery",
        'TRAVEL': "Travel",
        'EDUCATION': "Education",
        'RENTS & BILLS': "Rents & Bills",
        'HEALTHCARE': "Healthcare",
        'ENTERTAINMENT': "Entertainment",
        'OTHERS': "Others",
        'LOAN-EMI': "Loan-EMI",
    }
    

    // Transform backend data to match our category structure
   const expenses = result.map((expense: any) => ({
      category: expense.category,
      displayName: categoryMapping[expense.category] || expense.category,
      amount: expense.total_amount,
      month: expense.month,
      year: expense.year
    }))


    // Filter out categories with zero amounts for cleaner visualization
    const nonZeroExpenses = expenses.filter(expense => expense.amount > 0)

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
