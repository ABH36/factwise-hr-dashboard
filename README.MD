# 🚀 Smart HR Dashboard | FactWise Assignment

A production-grade **Employee Management Dashboard** built with the **MERN Stack**, featuring a high-performance Data Grid, interactive analytics, and a premium glassmorphism UI. 

This project is designed to handle large datasets efficiently using **AG Grid** with client-side rendering, meeting all assignment requirements with added productivity features.



---

## ✨ Key Features

### 📊 1. Executive Dashboard
- **100% Dynamic Data:** Real-time metrics calculated from MongoDB aggregations.
- **Visual Analytics:** Salary Trend (Area Chart) & Department Distribution (Pie Chart) using Recharts.
- **AI Insights:** Automated recommendations for Promotions and Training based on performance scores.
- **Recent Activity:** Live feed of new joiners and system updates.

### 👥 2. Advanced Employee Grid (The Core)
- **Powered by AG Grid (v31):** Robust handling of tabular data.
- **Productivity Tabs:** Instant filtering (All | Active | Inactive | Engineering).
- **Interactive Actions:** - **Live Status Toggle:** Switch employees Active/Inactive with a click.
  - **CSV Export Engine:** Download full reports instantly.
- **Visual Polish:** Custom "Quartz Dark" theme, skeleton loading states, and sticky columns.

### 🌳 3. Intelligent Org Chart
- **Recursive Hierarchy:** Renders infinite levels of management automatically.
- **Focus Mode:** Search for a department (e.g., "Marketing") to dim unrelated nodes and highlight targets.
- **Circuit Design:** Custom CSS connectors for a high-tech visualization.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion
- **Data Grid:** AG Grid React (Community Edition)
- **Charts:** Recharts
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Indexing & Aggregations)
- **State Management:** React Hooks & Context API

---

## ⚙️ Installation & Setup Guide

Follow these steps to run the project locally.

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas URL)

### 1. Backend Setup (Server & Database)
The backend handles API logic and database seeding.

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Set up Environment Variables
# Create a .env file in /backend and add:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/smart_hr_db

# Seed the Database (Important! Loads the 20 sample rows)
node seeder.js

# Start the Server
npm run dev




2. Frontend Setup (Client UI)
The frontend connects to the backend API on port 5000.


# Navigate to frontend
cd frontend

# Install dependencies (React 18 + AG Grid)
npm install

# Start the Development Server
npm run dev


Requirement,Implementation Status
AG Grid Integration,"✅ Used AgGridReact with sorting, filtering, and pagination."
Client-Side Rendering,✅ Data fetched via Axios and rendered dynamically in React.
Sample Dataset,✅ 20 rows of realistic employee data seeded via backend.
Clean & Professional,"✅ Implemented ""Inter"" typography, dark mode, and consistent spacing."
Scalable,✅ Backend uses Indexing; Frontend uses Debouncing & Virtualization.



.📂 Folder Structure/smart-hr-dashboard
  ├── /backend
  │     ├── /controllers   # Logic for Stats, AI, Search
  │     ├── /models        # Mongoose Schema with Indexing
  │     ├── /routes        # API Endpoints
  │     └── seeder.js      # Data Import Script
  │
  ├── /frontend
  │     ├── /src
  │     │    ├── /components  # Reusable UI (Sidebar, StatsCard)
  │     │    ├── /pages       # Dashboard, Employees (AG Grid), OrgChart
  │     │    └── /api         # Axios Config
  │     └── tailwind.config  # Custom Theme Colors
