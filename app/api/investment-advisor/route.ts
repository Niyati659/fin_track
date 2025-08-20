import { type NextRequest, NextResponse } from "next/server"

// Mock Hugging Face API endpoints - replace with your actual endpoints
const HF_ENDPOINT = process.env.ML_MODEL_URL
interface ModelResponse {
  data: [string, string, number]  // [risk_tolerance, investment_horizon, amount]
}

interface StockRecommendation {
  [key: string]: number;
}

interface MutualFundRecommendation {
  [key: string]: number;
}

interface MLModelResponse {
  status: string;
  data: {
    "Predicted Stock Category": string;
    "Predicted MF Category": string;
    "Recommended Stocks": StockRecommendation;
    "Recommended Mutual Funds": MutualFundRecommendation;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { risk, investmentHorizon, investmentAmount } = body
    console.log("Received data:", body)
    // Check if HF_ENDPOINT is defined
    if (!HF_ENDPOINT) {
      return NextResponse.json({ error: "ML_MODEL_URL environment variable is not set" }, { status: 500 })
    }

    // Call Hugging Face model API to get event ID
    const response = await fetch(HF_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
       body: JSON.stringify({
          data: [risk, investmentHorizon, Number(investmentAmount)]
        
      })
    })
    console.log("Hugging Face API response:", response)

    if (!response.ok) {
      throw new Error("Failed to call Hugging Face API")
    }

    const data = await response.json()

    // Return the event ID from the Hugging Face response
    return NextResponse.json({
      eventId: data.event_id ,
      status: "processing",
    })
  } catch (error) {
    console.error("Error calling Hugging Face API:", error)
    return NextResponse.json({ error: "Failed to process investment request" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get("eventId")

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    if (!HF_ENDPOINT) {
      return NextResponse.json({ error: "ML_MODEL_URL environment variable is not set" }, { status: 500 })
    }

    const response = await fetch(`${HF_ENDPOINT}/${eventId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to get results from Hugging Face API")
    }

    // Read the response as text first
    const responseText = await response.text()
    console.log("Raw response:", responseText)

    // Try to parse the last line which should contain the complete data
    const lines = responseText.split('\n')
    const lastValidLine = lines
      .reverse()
      .find(line => line.trim().startsWith('data:'))

    if (!lastValidLine) {
      return NextResponse.json({
        status: "processing",
        message: "Still processing recommendation...",
      })
    }

    // Extract the JSON data after "data:"
    const jsonStr = lastValidLine.replace('data:', '').trim()
    const modelResponse: MLModelResponse[] = JSON.parse(jsonStr)

    if (modelResponse[0]?.status === "success") {
      const data = modelResponse[0].data
      
      return NextResponse.json({
        status: "completed",
        recommendations: {
          stocks: {
            category: data["Predicted Stock Category"],
            recommendations: Object.entries(data["Recommended Stocks"]).map(([name, price]) => ({
              name,
              price: price.toFixed(2)
            }))
          },
          mutualFunds: {
            category: data["Predicted MF Category"],
            recommendations: Object.entries(data["Recommended Mutual Funds"]).map(([name, nav]) => ({
              name,
              nav: nav.toFixed(2)
            }))
          }
        }
      })
    }

    return NextResponse.json({
      status: "processing",
      message: "Recommendations are being generated...",
    })

  } catch (error) {
    console.error("Error getting results from Hugging Face API:", error)
    return NextResponse.json({ 
      error: "Failed to get investment recommendations",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
