import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Call your existing backend API to get financial overview
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/api/financial-overview`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_TOKEN}`, // Add your auth token if needed
      },
    })

    if (!backendResponse.ok) {
      throw new Error("Backend API call failed")
    }

    const result = await backendResponse.json()

    // Transform the data to match our frontend expectations
    const financialData = {
      totalIncome: result.totalIncome || 0,
      totalExpenses: result.totalExpenses || 0,
      totalSavings: (result.totalIncome || 0) - (result.totalExpenses || 0),
    }

    return NextResponse.json(financialData)
  } catch (error) {
    console.error("Error fetching financial overview:", error)
    return NextResponse.json({ error: "Failed to fetch financial data" }, { status: 500 })
  }
}
