import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}fintrack/addUsers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password
      }),
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json()
      return NextResponse.json(
        { error: errorData.message },
        { status: backendResponse.status }
      )
    }

    const userData = await backendResponse.json()

    return NextResponse.json({
      message: "Signup successful",
      user: {
        id: userData.id,
        username: userData.username
      }
    })

  } catch (error) {
    console.error("Error during signup:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}