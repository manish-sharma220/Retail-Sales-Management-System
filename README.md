# Retail Sales Management System

A full-stack web application for managing retail sales data with advanced search, filtering, sorting, and pagination capabilities. Built to handle comprehensive sales records with customer, product, and operational data.

## Tech Stack

**Frontend:** React 18, Vite, React Router, Axios  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Deployment:** Vercel (Frontend), Render (Backend), MongoDB Atlas (Database)

## Search Implementation Summary

Implemented full-text search across customer name and phone number fields using MongoDB regex queries with case-insensitive matching. The search functionality works seamlessly alongside all filters and sorting options, maintaining state across pagination. Debouncing is applied on the frontend to optimize API calls during user input.

## Filter Implementation Summary

Multi-select filtering is implemented for customer region, gender, product category, tags, and payment method. Age range filtering supports min/max values. Date range filtering allows start and end date selection. All filters work independently and in combination, with query conditions built dynamically on the backend. Filter state persists across search and sort operations.

## Sorting Implementation Summary

Sorting is available for date (newest first by default), quantity, and customer name (A-Z). Sort operations are performed at the database level using MongoDB's sort method, ensuring efficiency with large datasets. Active filters and search terms are preserved when sorting is applied.

## Pagination Implementation Summary

Pagination displays 10 items per page with next/previous navigation and numbered page buttons. The current page, total pages, and record count are tracked and displayed. All active search, filter, and sort states are maintained when navigating between pages. Skip and limit operations are handled on the backend for optimal performance.

## Setup Instructions

**Prerequisites:** Node.js (v16+), MongoDB Atlas account or local MongoDB

**Backend Setup:**
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
PORT=5000
```

Start backend server:
```bash
npm start
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

**Database Seeding (Optional):**
```bash
cd backend
npm run seed
```

For detailed deployment instructions, see `DEPLOYMENT.md`
