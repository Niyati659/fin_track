from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from investment_recommendation import recommend_investment 


app = FastAPI(title="FinTrack Investment Recommendation API")

# Request schema for POST
class UserInput(BaseModel):
    risk: str
    horizon: str
    investment_amount: float

@app.post("/recommend")
def recommend(user: UserInput):
    try:
        result = recommend_investment(user.dict())
        return {"status": "success", "data": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/")
def root():
    return {"message": "✅ FinTrack API is running!"}
