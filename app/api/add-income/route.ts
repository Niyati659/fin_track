import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, category, date } = body

    // Validate input
    if (!amount || !category || !date) {
      return NextResponse.json({ error: "Missing required fields: amount, category, date" }, { status: 400 })
    }

    // Call your existing backend API
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/api/income`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_TOKEN}`, // Add your auth token if needed
      },
      body: JSON.stringify({
        amount: Number.parseFloat(amount),
        category,
        date,
        userId: "user-id-from-auth", // Replace with actual user ID from auth
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
