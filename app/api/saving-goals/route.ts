import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Extract user_id from query parameters
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    console.log("User ID:", user_id); // Debugging log

    // Replace with your actual backend API endpoint
    const response = await fetch(`${process.env.BACKEND_API_URL}fintrack/findAllGoals/${user_id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response Status:", response.status); // Debugging log

    if (!response.ok) {
      throw new Error("Failed to fetch savings goals");
    }

    const data = await response.json();
    console.log("Fetched Data:", data); // Debugging log

    // Return only the fetched data
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching savings goals:", error);
    return NextResponse.json({ error: "Failed to fetch savings goals" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log(body)
    console.log("Backend URL:", `${process.env.BACKEND_API_URL}fintrack/addSavingGoal`);

    // Replace with your actual backend API endpoint
    const response = await fetch(`${process.env.BACKEND_API_URL}fintrack/addSavingGoal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        goal_name: body.goal_name,
        target_amount: body.target_amount,
        user_id:body.user_id
      }),
    })

    console.log("Response Status:", response);

    if (!response.ok) {
      throw new Error("Failed to create savings goal")
    }

    const data = await response.json()
    console.log("Hellll",data);
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating savings goal:", error)
    return NextResponse.json({ error: "Failed to create savings goal" }, { status: 500 })
  }
}
