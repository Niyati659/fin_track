import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Call your existing backend API to get 3 months of expense data
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/api/expenses/monthly-comparison`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_TOKEN}`,
        // Add user ID from auth context
        "X-User-ID": "user-id-from-auth", // Replace with actual user ID from auth
      },
    })

    if (!backendResponse.ok) {
      throw new Error("Backend API call failed")
    }

    const result = await backendResponse.json()

    // Define the standard categories
    const categories = [
      { key: "FOOD_GROCERY", displayName: "Food & Grocery" },
      { key: "EDUCATION", displayName: "Education" },
      { key: "RENTS_BILLS", displayName: "Rents & Bills" },
      { key: "HEALTHCARE", displayName: "Healthcare" },
      { key: "ENTERTAINMENT", displayName: "Entertainment" },
      { key: "TRAVEL", displayName: "Travel" },
      { key: "OTHERS", displayName: "Others" },
      { key: "LOAN_EMI", displayName: "Loan-EMI" },
    ]

    // Transform backend data for monthly trends
    const monthlyExpenses =
      result.monthlyData?.map((monthData: any) => ({
        month: monthData.month,
        FOOD_GROCERY: monthData.categories?.FOOD_GROCERY || 0,
        EDUCATION: monthData.categories?.EDUCATION || 0,
        RENTS_BILLS: monthData.categories?.RENTS_BILLS || 0,
        HEALTHCARE: monthData.categories?.HEALTHCARE || 0,
        ENTERTAINMENT: monthData.categories?.ENTERTAINMENT || 0,
        TRAVEL: monthData.categories?.TRAVEL || 0,
        OTHERS: monthData.categories?.OTHERS || 0,
        LOAN_EMI: monthData.categories?.LOAN_EMI || 0,
      })) || []

    // Transform data for category comparisons
    const categoryComparisons = categories.map(({ key, displayName }) => {
      const month1 = result.monthlyData?.[0]?.categories?.[key] || 0
      const month2 = result.monthlyData?.[1]?.categories?.[key] || 0
      const month3 = result.monthlyData?.[2]?.categories?.[key] || 0

      // Determine trend
      let trend = "stable"
      if (month3 > month2 && month2 > month1) trend = "up"
      else if (month3 < month2 && month2 < month1) trend = "down"

      return {
        category: key,
        displayName,
        month1,
        month2,
        month3,
        trend,
      }
    })

    return NextResponse.json({
      success: true,
      monthlyExpenses,
      categoryComparisons,
    })
  } catch (error) {
    console.error("Error fetching monthly expense data:", error)
    return NextResponse.json({ error: "Failed to fetch monthly expense data" }, { status: 500 })
  }
}
