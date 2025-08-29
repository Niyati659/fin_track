import { type NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // params is a Promise!
) {
  try {
    const body = await request.json()
    const { id: goalId } = await context.params  // await params

    const response = await fetch(
      `${process.env.BACKEND_API_URL}fintrack/addTransaction`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: body.amount,
          goal_id: goalId,
          user_id: body.user_id,
        }),
      }
    )

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
