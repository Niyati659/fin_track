import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, category, user_id } = body
    console.log("Received add expense request:", { amount, category, user_id })
    // Validate input
    if (!amount || !category ) {
      return NextResponse.json({ error: "Missing required fields: amount, category" }, { status: 400 })
    }
    console.log(`${process.env.BACKEND_API_URL}fintrack/addExpenses`)
    // Call your existing backend API
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}fintrack/addExpenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Number(amount),
        category:category,
        user_id: user_id, 
      }),
    })

    if (!backendResponse.ok) {
      throw new Error("Backend API call failed")
    }

    const result = await backendResponse.json()

    return NextResponse.json({
      success: true,
      message: "Expense added successfully",
      data: result,
    })
  } catch (error) {
    console.error("Error adding expense:", error)
    return NextResponse.json({ error: "Failed to add expense" }, { status: 500 })
  }
}
