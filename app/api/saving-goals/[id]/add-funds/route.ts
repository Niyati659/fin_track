import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const goalId = params.id

    // Replace with your actual backend API endpoint
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/savings-goals/${goalId}/add-funds`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: body.amount,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to add funds to goal")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error adding funds to goal:", error)
    return NextResponse.json({ error: "Failed to add funds to goal" }, { status: 500 })
  }
}
