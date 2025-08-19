import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib

# Load dataset
df = pd.read_csv("investment_data1.csv")

# --- Encode categorical features ---
le_risk = LabelEncoder()
le_horizon = LabelEncoder()
le_stock = LabelEncoder()
le_mf = LabelEncoder()

df["risk_profile_enc"] = le_risk.fit_transform(df["risk_profile"])
df["investment_horizon_enc"] = le_horizon.fit_transform(df["investment_horizon"])
df["stock_category_enc"] = le_stock.fit_transform(df["recommended_stock_category"])
df["mf_category_enc"] = le_mf.fit_transform(df["recommended_mf_category"])

# Features & targets
X = df[["risk_profile_enc", "investment_horizon_enc", "investment_amount"]]
y_stock = df["stock_category_enc"]
y_mf = df["mf_category_enc"]

# Train/test split
X_train, X_test, y_stock_train, y_stock_test, y_mf_train, y_mf_test = train_test_split(
    X, y_stock, y_mf, test_size=0.2, random_state=42
)

# --- Train Random Forest Models ---
stock_model = RandomForestClassifier(n_estimators=200, class_weight="balanced", random_state=42)
mf_model = RandomForestClassifier(n_estimators=200, class_weight="balanced", random_state=42)

stock_model.fit(X_train, y_stock_train)
mf_model.fit(X_train, y_mf_train)

# --- Evaluate ---
stock_pred = stock_model.predict(X_test)
mf_pred = mf_model.predict(X_test)

print("📊 Stock Recommendation Model Performance")
print(classification_report(y_stock_test, stock_pred, target_names=le_stock.classes_))

print("📊 Mutual Fund Recommendation Model Performance")
print(classification_report(y_mf_test, mf_pred, target_names=le_mf.classes_))

joblib.dump(stock_model, "stock_model.joblib", compress=("lzma", 3))
joblib.dump(mf_model, "mf_model.joblib", compress=("lzma", 3))
joblib.dump(
    {"risk": le_risk, "horizon": le_horizon, "stock": le_stock, "mf": le_mf},
    "encoders.joblib",
    compress=("lzma", 3)
)

print("✅ Models and encoders saved successfully!")
