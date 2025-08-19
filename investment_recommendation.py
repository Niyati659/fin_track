import pandas as pd
import joblib
import yfinance as yf
import requests
import re

# -------------------------------
# 1. Load Models & Encoders
# -------------------------------
try:
    stock_model = joblib.load("stock_model.joblib")
    mf_model = joblib.load("mf_model.joblib")
    encoders = joblib.load("encoders.joblib")
except FileNotFoundError as e:
    raise FileNotFoundError(
        f"Missing file: {e}. Make sure stock_model.joblib, mf_model.joblib, encoders.joblib are in this folder."
    )
except Exception as e:
    raise RuntimeError(f"Error loading models: {e}")

# Global cache for mutual fund data
_mf_data = None


# -------------------------------
# 2. Helper Functions
# -------------------------------

def get_stock_price(ticker):
    """Fetch latest closing price using Yahoo Finance."""
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="5d")
        if not hist.empty:
            return round(hist['Close'].iloc[-1], 2)
        return None
    except Exception as e:
        print(f"⚠ Error fetching {ticker}: {e}")
        return None


def fetch_mf_data():
    """Fetch and cache all mutual funds from https://api.mfapi.in/mf"""
    global _mf_data
    if _mf_data is not None:
        return _mf_data

    url = "https://api.mfapi.in/mf"
    try:
        print("🔍 Fetching mutual fund data from api.mfapi.in...")
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        data = response.json()
        print(f"✅ Fetched {len(data)} mutual funds")
        _mf_data = data
        return data
    except Exception as e:
        print(f"❌ Failed to fetch mutual fund data: {e}")
        return []


def clean_scheme_name(name):
    """Remove plan types and options for cleaner display."""
    name = re.sub(r" - (Regular|Direct) Plan.*", "", name)
    name = re.sub(r" -.*Option", "", name)
    name = re.sub(r" \(.*\)", "", name)
    name = re.sub(r"\s+", " ", name).strip()
    return name


def get_nav(fund):
    """Safely extract NAV from fund data."""
    try:
        nav_str = fund["data"][0]["nav"]
        return float(nav_str)
    except (IndexError, KeyError, ValueError, TypeError):
        return None
    
def fetch_fund_details(scheme_code):
    """Fetch NAV details for a given schemeCode."""
    try:
        url = f"https://api.mfapi.in/mf/{scheme_code}"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"⚠ Failed to fetch details for {scheme_code}: {e}")
        return None


def get_nav_from_details(fund_details):
    """Extract latest NAV from scheme details."""
    try:
        nav_str = fund_details["data"][0]["nav"]
        return float(nav_str)
    except (IndexError, KeyError, ValueError, TypeError):
        return None


def search_mf_by_category(category):
    """
    Search mutual funds by category using keyword matching.
    Returns: dict of {clean_scheme_name: nav}
    """
    funds = fetch_mf_data()
    if not funds:
        return {}

    # Refined mapping
    keyword_map = {
        "ELSS": r"(tax.?saver|elss|long.?term.?equity|tax.?plan)",
        "Debt": r"(debt|income|gilt|bond|savings|credit.?risk|short.?term|corporate.?debt|liquid|money.?market|fixed.?maturity)",
        "Equity": r"(equity|flexi.?cap|flexicap|large.?cap|mid.?cap|small.?cap|multi.?cap|focused.?fund|blue.?chip)",
        "Hybrid": r"(hybrid|balanced|advantage|aggressive|conservative|arbitrage|asset.?allocator|dynamic.?asset)",
        "Index": r"(index|nifty|sensex|passive|bees|exchange.?traded|etf)"
    }

    pattern = keyword_map.get(category, category)
    results = {}

    for fund in funds:
        name = fund["schemeName"].lower()

        # Skip if no keyword match
        if not re.search(pattern, name, re.I):
            continue

        # Skip IDCW/Dividend/Bonus/FMP
        if any(x in name for x in ["dividend", "idcw", "bonus", "fmp"]):
            continue

        # Fetch NAV
        details = fetch_fund_details(fund["schemeCode"])
        if not details:
            continue
        nav = get_nav_from_details(details)
        if not nav:
            continue

        clean_name = clean_scheme_name(fund["schemeName"])
        if clean_name not in results:
            results[clean_name] = round(nav, 2)

        if len(results) >= 3:  # Limit to 3
            break

    return results



# -------------------------------
# 3. Stock Category → Tickers
# -------------------------------

STOCK_CATEGORY_TO_TICKERS = {
    "Small-Cap": ["IRCTC.NS", "JIOFIN.NS", "POLICYBZR.NS", "NAUKRI.NS", "AUBANK.NS"],
    "Growth": ["RELIANCE.NS", "TCS.NS", "INFY.NS", "DMART.NS", "HDFCBANK.NS"],
    "Index": ["NIFTYBEES.NS", "BANKBEES.NS", "ICICIB22.NS", "MOM100.NS", "GOLDBEES.NS"],
    "Value": ["HINDALCO.NS", "TATASTEEL.NS", "COALINDIA.NS", "NTPC.NS", "POWERGRID.NS"],
    "Dividend": ["SBIN.NS", "AXISBANK.NS", "BPCL.NS", "VEDL.NS", "GAIL.NS"],
    "Blend": ["ITC.NS", "NESTLEIND.NS", "BRITANNIA.NS", "CIPLA.NS", "HDFC.NS"]
}


# -------------------------------
# 4. Main Recommendation Function
# -------------------------------

def recommend_investment(user_input):
    """
    user_input = {
        "risk": "Aggressive",
        "horizon": "Long-term",
        "investment_amount": 100000
    }
    """
    required = ["risk", "horizon", "investment_amount"]
    for k in required:
        if k not in user_input:
            raise ValueError(f"Missing input: {k}")

    risk = str(user_input["risk"]).strip().capitalize()
    horizon = str(user_input["horizon"]).strip().capitalize()

    # Validate and encode
    try:
        risk_enc = encoders["risk"].transform([risk])[0]
        horizon_enc = encoders["horizon"].transform([horizon])[0]
    except ValueError:
        available_risks = list(encoders["risk"].classes_)
        available_horizons = list(encoders["horizon"].classes_)
        raise ValueError(
            f"Invalid risk/horizon. Use:\n"
            f"  risk: {available_risks}\n"
            f"  horizon: {available_horizons}"
        )

    # Prepare input
    X = pd.DataFrame([{
        "risk_profile_enc": risk_enc,
        "investment_horizon_enc": horizon_enc,
        "investment_amount": float(user_input["investment_amount"])
    }])

    # Predict
    try:
        stock_pred = stock_model.predict(X)[0]
        mf_pred = mf_model.predict(X)[0]

        stock_category = encoders["stock"].inverse_transform([stock_pred])[0]
        mf_category = encoders["mf"].inverse_transform([mf_pred])[0]
    except Exception as e:
        raise RuntimeError(f"Prediction failed: {e}")

    # Get stocks
    tickers = STOCK_CATEGORY_TO_TICKERS.get(stock_category, [])
    stocks = {}
    for ticker in tickers:
        price = get_stock_price(ticker)
        if price is not None:
            stocks[ticker] = price

    # Get mutual funds
    mfs = search_mf_by_category(mf_category)

    return {
        "Predicted Stock Category": stock_category,
        "Predicted MF Category": mf_category,
        "Recommended Stocks": stocks,
        "Recommended Mutual Funds": mfs
    }


# -------------------------------
# 5. Example Usage
# -------------------------------

if __name__ == "__main__":
    # Example user input
    user = {
        "risk": "Aggressive",
        "horizon": "Long-term",
        "investment_amount": 10000
    }

    print("🚀 Investment Recommendation System\n")
    try:
        result = recommend_investment(user)
        print("✅ Recommendation Generated:\n")
        for key, value in result.items():
            print(f"📌 {key}:")
            if isinstance(value, dict):
                for k, v in value.items():
                    print(f"   • {k} : ₹{v}")
            else:
                print(f"   {value}")
            print()
    except Exception as e:
        print(f"💥 Error: {e}")