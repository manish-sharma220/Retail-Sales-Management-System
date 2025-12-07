# System Architecture

## Backend Architecture

### How it's organized

I split the backend into layers so each part has one job. Controllers handle requests, services do the business logic, and models define the data structure. This makes testing easier and keeps things from getting messy.

### The layers

**Controllers** (`src/controllers/`)  
These grab data from requests, validate it, call the right service methods, and send back responses. I keep all the HTTP stuff here - status codes, error formatting, that kind of thing.

**Services** (`src/services/`)  
This is where the actual work happens. The service layer builds database queries, handles pagination math, and processes data. I made it independent of Express so I could test it without spinning up a server.

**Models** (`src/models/`)  
Mongoose schemas that define what sales records look like. I added indexes on fields that get queried a lot (customer name, phone, date, region, category) to keep things fast.

**Routes** (`src/routes/`)  
Just maps URLs to controller methods. Pretty straightforward.

**Utils** (`src/utils/`)  
Helper stuff like validation functions and the database seeding script.

### How queries work

When filters come in, the service builds a MongoDB query object piece by piece. Text search uses regex with the 'i' flag for case-insensitive matching. Multi-select filters use MongoDB's `$in` operator. Range filters (age, dates) use `$gte` and `$lte`. Everything combines with AND logic automatically.

I put indexes on the fields that get searched and filtered most. Without them, queries would slow down as data grows.

### Sorting approach

Sorting happens in the database before pagination. I map the frontend field names (like 'customer') to actual database fields (like 'customerName') and apply the sort direction. This way MongoDB handles it efficiently instead of sorting in Node.

### Pagination strategy

Using skip and limit from MongoDB. Calculate how many records to skip based on page number (page 3 means skip 20 records if showing 10 per page). I also count total records separately to figure out how many pages there are. Works well even with thousands of records.

## Frontend Architecture

### Component structure

Built with React hooks - no Redux or anything extra. The main page component holds all the state and passes it down to smaller components.

**Pages** (`src/pages/`)  
SalesListPage is the main one. It manages state for search, filters, sorting, and pagination. Fetches data when anything changes and coordinates all the child components.

**Components** (`src/components/`)  
Broke the UI into reusable pieces:
- SearchBar: text input with debouncing
- FilterPanel: all the filter controls in a sidebar
- SalesTable: displays data with sortable columns
- Pagination: page navigation buttons

**Services** (`src/services/`)  
Axios wrapper for API calls. Keeps the HTTP logic separate from components.

**Hooks** (`src/hooks/`)  
Custom hook for debouncing. Delays the search API call until the user stops typing for 500ms.

**Utils** (`src/utils/`)  
Functions for formatting currency and dates consistently.

**Styles** (`src/styles/`)  
One global CSS file. Kept it simple with a clean design and responsive breakpoints.

### State management

SalesListPage tracks everything locally:
- Search term (gets debounced before API call)
- Filter object with all active filters
- Sort field and direction
- Current page number
- Sales data and pagination info from API

When state changes, useEffect triggers a new API call. All the query params get sent to the backend.

### Data flow

User types or clicks something → State updates → useEffect runs → API call with current state → Backend processes → Response comes back → State updates → UI re-renders

Keeping it unidirectional makes debugging way easier.

## How data moves through the system

**Request path:**  
User input → Component state → API service → Backend route → Controller → Service → Database

**Response path:**  
Database → Service → Controller → API response → Frontend service → Component state → UI

**Filter processing:**  
All filtering happens on the backend. Frontend just collects filter values and sends them as query params. This means:
- Results are consistent no matter what
- Better performance with large datasets
- Business logic lives in one place
- Easier to test

## Folder Structure

```
root/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── models/            # Database schemas
│   │   ├── routes/            # API endpoints
│   │   ├── utils/             # Helpers
│   │   └── index.js           # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API calls
│   │   ├── hooks/             # Custom hooks
│   │   ├── utils/             # Helpers
│   │   ├── styles/            # CSS
│   │   ├── routes/            # Router setup
│   │   └── main.jsx           # Entry point
│   └── package.json
│
└── docs/
    └── architecture.md
```

## What each module does

### Backend

**saleController.js**  
Pulls data from requests, validates it, calls service methods, formats responses. Handles HTTP status codes and error messages.

**saleService.js**  
Builds MongoDB queries from filter params, executes queries with pagination, calculates page metadata, fetches filter options for dropdowns.

**Sale.js**  
Defines the data schema, validation rules, and indexes.

**saleRoutes.js**  
Maps HTTP methods and paths to controllers.

**validation.js**  
Checks if sale data is valid before saving. Returns error messages for missing or invalid fields.

### Frontend

**SalesListPage.jsx**  
Main component that holds state, fetches data, handles user interactions, coordinates everything.

**SearchBar.jsx**  
Text input that emits changes to parent.

**FilterPanel.jsx**  
Sidebar with all filter controls. Fetches available options from API and manages multi-select state.

**SalesTable.jsx**  
Renders data in a table. Handles column sorting clicks. Shows empty state when no results.

**Pagination.jsx**  
Page navigation with previous/next and numbered buttons. Calculates which page numbers to show.

**saleService.js**  
Wraps API calls, builds query params, handles errors.

**useDebounce.js**  
Delays value updates to reduce API calls.

**formatters.js**  
Formats currency and dates for display.

## Performance stuff

- Indexes on frequently queried fields
- Pagination limits result size to 10
- Debouncing reduces API calls
- Backend does heavy lifting
- Lean queries return only needed fields

## Error handling

Backend catches errors and returns appropriate status codes. Frontend shows user-friendly messages. Validation happens before API calls when possible.

## Scaling considerations

The architecture can scale horizontally since the backend is stateless. Database queries are optimized with indexes. Frontend can be served from a CDN. Each layer can scale independently if needed.
