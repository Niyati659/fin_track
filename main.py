import gradio as gr
from investment_recommendation import recommend_investment

def recommend_api(risk, horizon, investment_amount):
    try:
        user = {
            "risk": risk,
            "horizon": horizon,
            "investment_amount": float(investment_amount)
        }
        result = recommend_investment(user)
        return {"status": "success", "data": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

with gr.Blocks(title="FinTrack Investment Recommendation") as demo:
    gr.Markdown("## 💹 FinTrack Investment Recommendation API")
    
    risk = gr.Dropdown(choices=["Aggressive", "Conservative", "Moderate"], label="Risk appetite")
    horizon = gr.Dropdown(choices=["Short-term", "Medium-term", "Long-term"], label="Investment horizon")
    amount = gr.Number(label="Investment amount (₹)", precision=2)
    
    output = gr.JSON(label="Recommendation")
    
    btn = gr.Button("Get Recommendation")
    btn.click(recommend_api, inputs=[risk, horizon, amount], outputs=output)

demo.queue()   # enables API calls
if __name__ == "__main__":
    demo.launch()
