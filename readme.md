# 💰 FinTrack – Expense Tracking & Advisory Hub

## 📌 Overview

FinTrack is a personal finance tracker that helps users manage their expenses, analyze spending habits, and receive smart saving/investment suggestions. It aims to make financial planning simple by combining expense tracking with an AI-driven advisory hub for smarter money decisions.

## 🛠️ Tech Stack

Frontend: Next.js (React, TailwindCSS, shadcn/ui)

Backend: Node.js / Express (API services)

Database: PostgreSQL (via Supabase)

AI/ML: Logistic Regression model (for investment recommendations)

APIs: Yahoo Finance (for stock/mutual fund data), custom advisory API

Deployment: Vercel (frontend) + Supabase (backend & DB)

## ⚙️ Setup & Installation
Prerequisites

Node.js (>= 18)

npm or yarn

Supabase account & project

Steps

Clone the repo

git clone https://github.com/Niyati659/fin_track.git
cd fin_track


Install dependencies

npm install
### or
yarn install


Setup environment variables
Create a .env file in the root directory:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
YAHOO_FINANCE_API_KEY=your_api_key


Run development server

npm run dev


Access app
Open http://localhost:3000

## ✨ Features

📊 Expense Tracking – Add, update, and view categorized expenses.

🏦 Savings Goals – Define future financial goals (car, home, healthcare, emergency fund, etc.).

🤖 AI Advisory Hub – Personalized saving & investment suggestions based on user’s risk profile and goals.

📈 Investment Insights – Real-time stock & mutual fund data integration.

🔒 Secure Data – Managed via Supabase authentication & PostgreSQL.

📱 Responsive UI – Modern dashboard with interactive graphs.

## 🔄 Technical Workflow

User Input

User enters expenses, savings goals, and investment preferences.

Backend Processing

API layer receives user data.

ML model predicts investment categories based on risk profile, horizon, and savings.

External APIs fetch stock/mutual fund insights.

Database Layer

User data & expenses stored in Supabase PostgreSQL.

Frontend Dashboard

Next.js renders expense charts, summaries, and personalized suggestions.

Interactive graphs and goal-tracking cards help visualize progress.

🚀 FinTrack is your personal money companion — track smarter, save better, invest wisely.
