Here’s a clean **Frontend Setup & Documentation** to match your backend. You can drop this straight into your repo as a README section.

---

# 🎨 Movie Recommendation Frontend

## 🚀 Overview

This frontend is a **Next.js (React) application** that:

* Displays a paginated movie directory with posters
* Allows users to select movies
* Generates recommendations via backend API
* Provides a responsive, modern UI

---

## 🏗️ Architecture

```text
User (Browser)
      ↓
Next.js Frontend
      ↓
FastAPI Backend (localhost:8000)
      ↓
SQLite DB
```

---

## ⚙️ Tech Stack

* **Next.js** (App Router)
* **React**
* **TypeScript**
* **Tailwind CSS**
* **shadcn/ui** (UI components)
* **Fetch API** (for backend communication)

---

## 📂 Project Structure

```text
frontend/
│
├── app/
│   ├── page.tsx            # Dashboard (recommendations)
│   ├── movies/page.tsx     # Movie directory
│
├── components/ui/          # shadcn components
├── public/                 # static assets (e.g. placeholder.png)
│
└── package.json
```

---

## 🔧 Installation

### 1. Install dependencies

```bash
npm install
```

---

### 2. Start the frontend

```bash
npm run dev
```

App runs at:

```text
http://localhost:3000
```

---

## 🔗 Backend Connection

Your frontend connects to:

```ts
const API_BASE = "http://127.0.0.1:8000";
```

👉 Make sure your backend is running:

```bash
uvicorn main:app --reload
```

---

## 📡 API Usage

### Fetch Movies (Paginated)

```ts
GET /movies?limit=25&offset=0
```

Used in:

* Movie directory page
* Dashboard selection list

---

### Get Recommendations

```ts
POST /recommend/new
```

**Request:**

```json
{
  "movies": [1, 5, 10]
}
```

**Response:**

```json
{
  "recommendations": [
    {
      "title": "Heat",
      "poster": "...",
      "predicted_rating": 4.5
    }
  ]
}
```

---

## 🎬 Key Features

### 1. Movie Directory

* Grid layout
* Poster images
* Pagination
* Responsive design

---

### 2. Dashboard (Recommendations)

* Search movies
* Select multiple movies
* Generate recommendations
* Display results with posters + ratings

---

## 🖼️ Poster Handling

Posters are provided by backend:

```ts
<img src={movie.poster} />
```

Fallback support:

```ts
<img src={movie.poster || "/placeholder.png"} />
```

👉 Add fallback image:

```text
/public/placeholder.png
```

---

## 📄 Pages

---

### 🏠 Dashboard (`/`)

* Select movies
* Generate recommendations
* Displays recommendation grid

---

### 🎬 Movie Directory (`/movies`)

* Browse all movies
* Poster grid view
* Pagination controls

---

## ⚡ Performance Notes

* Posters are **precomputed in backend**
* No external API calls from frontend
* Fast rendering with paginated fetch

---

## 🚀 Running Full System

### Step 1 — Start backend

```bash
uvicorn main:app --reload
```

---

### Step 2 — Start frontend

```bash
npm run dev
```

---

### Step 3 — Open app

```text
http://localhost:3000
```

---

## 🧠 UX Design Decisions

* Poster-first layout (visual browsing)
* Grid system (like Netflix)
* Pagination for scalability
* Selection-based recommendation flow

---

## 🛠️ Future Improvements

* Infinite scroll (replace pagination)
* Loading skeletons
* Movie detail pages
* Better search (backend-powered)
* State persistence (localStorage)

---

## 💡 Key Engineering Insight

> The frontend is designed to consume precomputed data, avoiding heavy processing or external API calls.

---

## 🏁 Summary

This frontend is:

* Fast ⚡
* Responsive 📱
* Clean UI 🎨
* Scalable 📈


