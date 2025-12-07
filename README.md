# Retail Sales Management System

A web app I built for managing retail sales transactions. It lets you search through sales records, apply multiple filters, sort data, and navigate through pages easily.

## Tech Stack

**Frontend:** React 18, Vite, React Router, Axios  
**Backend:** Node.js, Express, MongoDB, Mongoose  
**Database:** MongoDB Atlas

## Search Implementation Summary

Search works across customer names and phone numbers. I used MongoDB regex queries with case-insensitive matching so it finds results regardless of how you type. The search term gets debounced on the frontend (500ms delay) to avoid hammering the API while someone's still typing. It plays nice with filters and sorting - everything stays in sync.

## Filter Implementation Summary

You can filter by multiple things at once - customer region, gender, age range, product categories, tags, and payment methods. I built it so each filter can work alone or combined with others. The backend constructs the MongoDB query dynamically based on whatever filters are active. Age uses min/max range, dates use start/end, and the rest are multi-select checkboxes. Filter state sticks around when you search or sort.

## Sorting Implementation Summary

Three sort options: date (newest first is default), quantity, and customer name alphabetically. Sorting happens in MongoDB before pagination kicks in, which keeps things fast even with lots of records. When you change the sort, your active filters and search don't get cleared.

## Pagination Implementation Summary

Shows 10 records per page with previous/next buttons plus numbered pages. I calculate which page numbers to show based on where you are (shows 5 at a time with ellipsis for gaps). The backend uses skip/limit for efficiency. Page state, filters, search, and sort all work together without conflicts.

## Setup Instructions

**What you need:** Node.js v16 or higher, MongoDB Atlas account (or local MongoDB)

**Backend:**
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder with your MongoDB connection:
```env
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/retail_sales
NODE_ENV=development
PORT=5000
```

Start the server:
```bash
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser and you're good to go.
