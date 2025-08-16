import { Console } from "console"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body
    console.log("Received login request:", { username, password })
    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: "Missing required fields: username, password" }, 
        { status: 400 }
      )
    }
    console.log(`${process.env.BACKEND_API_URL}/fintrack/findUsers`)
    // Call your existing backend API
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/fintrack/findUsers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
    console.log("Backend response status:", backendResponse)
    if (!backendResponse.ok) {
      let errorMessage = "Login failed"
      try {
        const errorData = await backendResponse.json()
        errorMessage = errorData.message || errorMessage
      } catch (parseError) {
        // If JSON parsing fails, try to get text content
        const textError = await backendResponse.text()
        errorMessage = textError || errorMessage
      }

      return NextResponse.json(
        { error: errorMessage }, 
        { status: backendResponse.status }
      )
    }

    let userData
    try {
      userData = await backendResponse.json()
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid response from server" }, 
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      userId: userData.data?.id
    })

  } catch (error) {
    console.error("Error during login:", error)
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    )
  }
}