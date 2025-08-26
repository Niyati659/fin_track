import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    // Replace with your actual backend API endpoint
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/savings-goals`, {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch savings goals")
    }

    const data = await response.json()

    return NextResponse.json({
      goals: data.goals || [],
      overview: data.overview || {
        totalSavings: 0,
        monthlyInvested: 0,
        remainingToInvest: 0,
        monthlyTarget: 0,
      },
    })
  } catch (error) {
    console.error("Error fetching savings goals:", error)
    return NextResponse.json({ error: "Failed to fetch savings goals" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Replace with your actual backend API endpoint
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/savings-goals`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: body.name,
        targetAmount: body.targetAmount,
        deadline: body.deadline,
        category: body.category,
        currentAmount: 0, // New goals start with 0
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to create savings goal")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating savings goal:", error)
    return NextResponse.json({ error: "Failed to create savings goal" }, { status: 500 })
  }
}
