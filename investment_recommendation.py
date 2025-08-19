import pandas as pd
import pickle
import yfinance as yf
import requests

# -------------------------------
# Step 1: Load Models & Encoders
# -------------------------------
try:
    with open("stock_model.pkl", "rb") as f:
        stock_model = pickle.load(f)

    with open("mf_model.pkl", "rb") as f:
        mf_model = pickle.load(f)

    with open("encoders.pkl", "rb") as f:
        encoders = pickle.load(f)
except FileNotFoundError as e:
    raise FileNotFoundError(f"Model or encoder file missing. Make sure: stock_model.pkl, mf_model.pkl, encoders.pkl are in the same folder.\n{e}")
except Exception as e:
    raise RuntimeError(f"Error loading models: {e}")


# -------------------------------
# Step 2: Helper Functions
# -------------------------------

def get_stock_price(ticker):
    """
    Fetch latest closing price using Yahoo Finance.
    Returns: float or None
    """
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="5d")
        if not hist.empty:
            return round(hist['Close'].iloc[-1], 2)
        else:
            print(f"⚠ No price data for {ticker}")
            return None
    except Exception as e:
        print(f"❌ Error fetching {ticker}: {e}")
        return None


def get_mf_schemes_by_category(mf_category):
    """
    Search mutual fund schemes by category using api.mfapi.in
    Returns: dict of {scheme_name: nav}
    """
    url = "https://api.mfapi.in/mf"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        funds = response.json()

        # Map your model's MF categories to keywords
        keyword_map = {
            "ELSS": r"tax saver|ELSS|Long Term Equity",
            "Debt": r"debt|short term|income|savings|credit risk",
            "Equity": r"equity|flexi cap|large & mid|mid & small|large cap",
            "Hybrid": r"hybrid|balanced|aggressive|conservative",
            "Index": r"index fund|nifty 50|sensex|s&p|passive"
        }

        import re
        pattern = keyword_map.get(mf_category, mf_category)
        matched = {}

        for fund in funds:
            name = fund["schemeName"]
            if re.search(pattern, name, re.I):
                try:
                    nav = float(fund["data"][0]["nav"])
                    matched[name] = round(nav, 2)
                    if len(matched) >= 3:  # Top 3 matches
                        break
                except (KeyError, ValueError, IndexError):
                    continue

        return matched
    except Exception as e:
        print(f"❌ Error fetching mutual funds: {e}")
        return {}


# -------------------------------
# Step 3: Category → Asset Mapping
# Aligns with your investment_data1.csv
# -------------------------------

# Stock categories from your model: Small-Cap, Growth, Index, Value, Dividend, Blend
stock_category_to_tickers = {
    "Small-Cap": [
        "IRCTC.NS", "JIOFIN.NS", "POLICYBZR.NS", "NAUKRI.NS",
        "AUBANK.NS", "DEEPAKFERT.NS", "SOUTHBANK.NS"
    ],
    "Growth": [
        "RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS",
        "LTIM.NS", "DMART.NS", "TATAPOWER.NS", "MUTHOOTFIN.NS"
    ],
    "Index": [
        "NIFTYBEES.NS", "BANKBEES.NS", "ICICIB22.NS",
        "MOM100.NS", "SILVERBEES.NS", "GOLDBEES.NS"
    ],
    "Value": [
        "HINDALCO.NS", "TATASTEEL.NS", "COALINDIA.NS",
        "NTPC.NS", "POWERGRID.NS", "BPCL.NS"
    ],
    "Dividend": [
        "SBIN.NS", "AXISBANK.NS", "VEDL.NS",
        "GAIL.NS", "ADANIENT.NS", "OIL.NS"
    ],
    "Blend": [
        "ITC.NS", "NESTLEIND.NS", "BRITANNIA.NS",
        "CIPLA.NS", "HDFC.NS", "KOTAKBANK.NS"
    ]
}

# Mutual Fund categories from your model: ELSS, Debt, Equity, Hybrid, Index
# No mapping needed — we search by category using keywords


# -------------------------------
# Step 4: Main Recommendation Function
# -------------------------------

def recommend_investment(user_input):
    """
    Recommends investment based on user profile.
    user_input = {
        "risk": "Aggressive",
        "horizon": "Long-term",
        "investment_amount": 100000
    }
    Note: risk & horizon must match training labels (case-sensitive after capitalize)
    """
    required = ["risk", "horizon", "investment_amount"]
    for field in required:
        if field not in user_input:
            raise ValueError(f"Missing required field: {field}")

    # Normalize input to match encoder (capitalized)
    risk = str(user_input["risk"]).strip().capitalize()
    horizon = str(user_input["horizon"]).strip().capitalize()

    # Validate and encode
    try:
        risk_enc = encoders["risk"].transform([risk])[0]
        horizon_enc = encoders["horizon"].transform([horizon])[0]
    except ValueError as e:
        available_risks = encoders["risk"].classes_
        available_horizons = encoders["horizon"].classes_
        raise ValueError(
            f"Invalid risk/horizon. Must be one of:\n"
            f"Risk: {list(available_risks)}\n"
            f"Horizon: {list(available_horizons)}\n"
            f"Got: risk='{risk}', horizon='{horizon}'"
        )

    # Prepare input for model
    X = pd.DataFrame([{
        "risk_profile_enc": risk_enc,
        "investment_horizon_enc": horizon_enc,
        "investment_amount": float(user_input["investment_amount"])
    }])

    # Predict
    try:
        stock_pred_enc = stock_model.predict(X)[0]
        mf_pred_enc = mf_model.predict(X)[0]

        stock_category = encoders["stock"].inverse_transform([stock_pred_enc])[0]
        mf_category = encoders["mf"].inverse_transform([mf_pred_enc])[0]
    except Exception as e:
        raise RuntimeError(f"Error during model prediction: {e}")

    # Fetch recommended stocks
    tickers = stock_category_to_tickers.get(stock_category, [])
    stocks = {}
    for ticker in tickers:
        price = get_stock_price(ticker)
        if price is not None:
            stocks[ticker] = price

    # Fetch mutual funds
    mfs = get_mf_schemes_by_category(mf_category)

    return {
        "Predicted Stock Category": stock_category,
        "Predicted MF Category": mf_category,
        "Recommended Stocks": stocks,
        "Recommended Mutual Funds": mfs
    }


# -------------------------------
# Step 5: Example Usage
# -------------------------------

if __name__ == "__main__":
    # Example user input — must match training categories
    user = {
        "risk": "Moderate",         # Options: Conservative, Moderate, Aggressive
        "horizon": "Medium-term",   # Options: Short-term, Medium-term, Long-term
        "investment_amount": 100000
    }

    print("🔍 Running investment recommendation...\n")
    try:
        result = recommend_investment(user)
        print("✅ Recommendation Success!\n")
        for key, value in result.items():
            print(f"{key}:")
            if isinstance(value, dict):
                for k, v in value.items():
                    print(f"  • {k}: {v}")
            else:
                print(f"  {value}")
            print()
    except Exception as e:
        print(f"❌ Error: {e}")