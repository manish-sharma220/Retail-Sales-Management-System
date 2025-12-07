# System Architecture

## Backend Architecture

### Overview
The backend follows a layered architecture pattern with clear separation of concerns. Each layer has specific responsibilities and communicates through well-defined interfaces.

### Layer Structure

**Controllers Layer** (`src/controllers/`)
Handles HTTP request/response cycle. Extracts query parameters, validates input, calls service layer methods, and formats responses. No business logic resides here.

**Services Layer** (`src/services/`)
Contains all business logic for data processing. Constructs database queries based on filter parameters, handles pagination calculations, and manages data transformations. This layer is framework-agnostic and can be tested independently.

**Models Layer** (`src/models/`)
Defines MongoDB schemas using Mongoose. Includes field validations, indexes for query optimization, and data structure definitions. The Sale model encompasses all customer, product, and operational fields.

**Routes Layer** (`src/routes/`)
Maps HTTP endpoints to controller methods. Defines API structure and request routing logic.

**Utils Layer** (`src/utils/`)
Provides reusable utility functions for validation, data seeding, and helper operations.

### Query Construction Strategy

The service layer builds MongoDB queries dynamically based on active filters. Each filter type is handled independently:

- Text search uses regex with case-insensitive flag across multiple fields
- Multi-select filters use `$in` operator for array matching
- Range filters (age, date) use `$gte` and `$lte` operators
- All conditions are combined using MongoDB's implicit AND logic

Indexes are strategically placed on frequently queried fields (customerName, phoneNumber, date, customerRegion, productCategory, tags) to maintain query performance.

### Sorting Implementation

Sorting happens at the database level before pagination is applied. The service layer maps frontend sort field names to actual database field names and applies ascending or descending order. This ensures consistent results and leverages database optimization.

### Pagination Strategy

Pagination uses MongoDB's skip and limit methods. The service calculates skip count based on page number and fixed page size (10 items). Total record count is fetched separately to calculate total pages. This approach scales well with large datasets.

## Frontend Architecture

### Overview
The frontend is built with React using a component-based architecture. State management relies on React hooks without external libraries, keeping the bundle size minimal.

### Component Structure

**Pages** (`src/pages/`)
Top-level components that represent full views. The SalesListPage manages all state for search, filters, sorting, and pagination. It orchestrates data fetching and passes props to child components.

**Components** (`src/components/`)
Reusable UI components with single responsibilities:
- SearchBar: Handles text input with debouncing
- FilterPanel: Renders all filter controls and manages filter state
- SalesTable: Displays data in tabular format with sort controls
- Pagination: Provides page navigation controls

**Services** (`src/services/`)
API communication layer using Axios. Wraps HTTP requests and handles response/error formatting. The saleService provides methods for fetching sales data and filter options.

**Hooks** (`src/hooks/`)
Custom React hooks for reusable logic. The useDebounce hook delays API calls during rapid user input, reducing unnecessary network requests.

**Utils** (`src/utils/`)
Helper functions for data formatting (currency, dates) and other utility operations.

**Styles** (`src/styles/`)
Global CSS with component-specific styling. Uses a clean, minimal design approach with responsive breakpoints.

### State Management

The SalesListPage component maintains local state for:
- Search term (debounced before API call)
- Filter values (object with all filter fields)
- Sort field and direction
- Current page number
- Fetched sales data and pagination metadata

State updates trigger useEffect hooks that fetch new data from the API. All query parameters are passed to the backend, keeping the frontend lightweight.

### Data Flow

1. User interacts with search, filter, or sort controls
2. Component state updates
3. useEffect detects state change
4. API request is made with current state as query parameters
5. Backend processes request and returns filtered/sorted data
6. Component updates with new data
7. UI re-renders to show results

This unidirectional data flow makes the application predictable and easy to debug.

## Data Flow

### Request Flow
```
User Input → Component State → API Service → Backend Route → Controller → Service → Database
```

### Response Flow
```
Database → Service → Controller → API Response → Frontend Service → Component State → UI Update
```

### Filter Processing
All filtering logic executes on the backend. The frontend only collects filter values and sends them as query parameters. This ensures:
- Consistent results regardless of client-side state
- Better performance with large datasets
- Single source of truth for business logic
- Easier testing and maintenance

## Folder Structure

```
root/
├── backend/
│   ├── src/
│   │   ├── controllers/      # HTTP request handlers
│   │   ├── services/          # Business logic layer
│   │   ├── models/            # Database schemas
│   │   ├── routes/            # API endpoint definitions
│   │   ├── utils/             # Helper functions
│   │   └── index.js           # Application entry point
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page-level components
│   │   ├── services/          # API communication
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utility functions
│   │   ├── styles/            # CSS files
│   │   ├── routes/            # React Router setup
│   │   ├── App.jsx            # Root component
│   │   └── main.jsx           # Application entry
│   ├── package.json
│   └── index.html
│
└── docs/
    └── architecture.md        # This file
```

## Module Responsibilities

### Backend Modules

**saleController.js**
- Extracts and validates request parameters
- Calls appropriate service methods
- Formats success/error responses
- Handles HTTP status codes

**saleService.js**
- Builds MongoDB query conditions from filters
- Determines sort criteria
- Executes database queries with pagination
- Calculates pagination metadata
- Provides filter options for dropdowns

**Sale.js (Model)**
- Defines data schema and validation rules
- Creates database indexes
- Exports Mongoose model

**saleRoutes.js**
- Maps HTTP methods and paths to controllers
- Defines API endpoint structure

**validation.js**
- Validates sale data before database insertion
- Checks required fields and data types
- Returns validation errors

### Frontend Modules

**SalesListPage.jsx**
- Manages application state
- Fetches data from API
- Handles user interactions
- Coordinates child components

**SearchBar.jsx**
- Renders search input
- Emits search value changes to parent

**FilterPanel.jsx**
- Displays all filter controls
- Manages filter state
- Provides clear filters functionality

**SalesTable.jsx**
- Renders sales data in table format
- Handles column sorting
- Shows empty state when no results

**Pagination.jsx**
- Displays page navigation controls
- Calculates visible page numbers
- Emits page change events

**saleService.js**
- Wraps Axios HTTP requests
- Constructs query parameters
- Handles API responses and errors

**useDebounce.js**
- Delays value updates
- Prevents excessive API calls
- Improves user experience

**formatters.js**
- Formats currency values
- Formats date/time displays
- Provides consistent data presentation

## Performance Considerations

- Database indexes on frequently queried fields
- Pagination limits result set size
- Debouncing reduces API call frequency
- Backend handles all heavy processing
- Lean queries return only necessary fields
- Connection pooling for database efficiency

## Error Handling

- Backend catches and logs all errors
- Appropriate HTTP status codes returned
- Frontend displays user-friendly error messages
- Validation errors shown before API calls
- Network errors handled gracefully

## Scalability

The architecture supports horizontal scaling:
- Stateless backend can run multiple instances
- Database queries optimized with indexes
- Frontend served from CDN
- API responses cacheable where appropriate
- Separation of concerns allows independent scaling
