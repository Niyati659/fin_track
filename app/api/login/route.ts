import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body
    console.log("Received login request:", { username, password })

    if (!username || !password) {
      return NextResponse.json(
        { error: "Missing required fields: username, password" }, 
        { status: 400 }
      )
    }

    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}fintrack/findUsers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })

    if (!backendResponse.ok) {
      let errorMessage = "Login failed"
      try {
        const errorData = await backendResponse.json()
        errorMessage = errorData.message || errorMessage
      } catch (parseError) {
        const textError = await backendResponse.text()
        errorMessage = textError || errorMessage
      }
      return NextResponse.json({ error: errorMessage }, { status: backendResponse.status })
    }

    const userData = await backendResponse.json()
    
    // Match the response format from your backend
    return NextResponse.json({
      message: "Login successful",
      user: {
        id: userData.user.id
      }
    })

  } catch (error) {
    console.error("Error during login:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}