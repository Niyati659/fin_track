import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams= request.nextUrl.searchParams
    const userId=searchParams.get('userId')
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}fintrack/getIncome/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
       
      },
    })
    console.log(backendResponse)
    if (!backendResponse.ok) {
      throw new Error("Backend API call failed")
    }
    const result = await backendResponse.json()
    console.log(result);
    // Transform the data to match our frontend expectations
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching financial overview:", error)
    return NextResponse.json({ error: "Failed to fetch financial data" }, { status: 500 })
  }
}
