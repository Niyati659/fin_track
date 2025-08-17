import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, user_id, date } = body

    // Validate input
    if (!amount || !date) {
      return NextResponse.json({ error: "Missing required fields: amount,  date" }, { status: 400 })
    }

    // Call your existing backend API
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}fintrack/addIncome`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        
      },
      body: JSON.stringify({
        amount: Number(amount),
        date:date,
        user_id: user_id, 
      }),
    })

    if (!backendResponse.ok) {
      throw new Error("Backend API call failed")
    }

    const result = await backendResponse.json()

    return NextResponse.json({
      success: true,
      message: "Income added successfully",
      data: result,
    })
  } catch (error) {
    console.error("Error adding income:", error)
    return NextResponse.json({ error: "Failed to add income" }, { status: 500 })
  }
}
