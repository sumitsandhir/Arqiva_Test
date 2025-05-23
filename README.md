# Arqiva Tech Test Server

This repository contains a FastAPI backend server implementation alongside a React-based client application. The backend is designed to serve filtered data on `contributions` with customizable query parameters, providing robust searching, sorting, and pagination functionality. The frontend includes a basic UI for displaying contributions with dynamic status handling.

---

## **Approach**

### **Backend Setup (FastAPI)**
1. **FastAPI Framework**:  
   The FastAPI framework was chosen for its simplicity, asynchronous capabilities, and ability to generate interactive API documentation (`/docs` and `/redoc`) automatically.

2. **Dynamic Filtering**:  
   The `list_contributions` endpoint enables dynamic filtering based on query parameters such as `title`, `description`, `owner`, and `time ranges`.  
   - The logic supports both `any` (matches any filter) and `all` (matches all filters) via the `MatchType` Enum.

3. **Sorting and Pagination**:  
   - Sorting utilizes an `Enum` for clarity (`ContributionOrder`) to restrict input types (e.g., `id`, `title`, or `description`).
   - Pagination is achieved via `skip` and `limit`, which enables lightweight API responses.

4. **Lifecycle Management**:  
   - The `lifespan` function ensures the server loads `contributions.json` during startup and clears it on shutdown.  
   - This keeps the application stateless, ensuring data integrity.

5. **File Structure**:  
   - A clean file structure is maintained for readability, adhering to Python's PEP-8 standards.

---

### **Frontend Setup (React with TailwindCSS)**
1. **React and TypeScript Support**:  
   - The React frontend is written in TypeScript for better type safety and error handling.  
   - The `ContributionCard` component dynamically calculates and renders the current status of a contribution (`Active`, `Scheduled`, or `Complete`).

2. **Styling**:  
   - TailwindCSS is used for styling, ensuring responsiveness, dark mode support, and rapid prototyping.

3. **Routing**:  
   - The `BrowserRouter` ensures scalability when additional pages or views are incorporated.

---

### **Best Practices Followed**
1. **Reusable and Modular Code** (React, TypeScript):  
   - Components like `ContributionCard` are atomic and focused solely on their functionality.
   - TypeScript types and `Enum` values enforce strict contracts, reducing the risk of runtime errors.

2. **API Documentation** (FastAPI):  
   - The API automatically generates documentation for developers with Redoc and Swagger support.
   - This is a best practice for teams who wish to understand API endpoints quickly.

3. **Excluding Sensitive/Generated Files** (`.gitignore`):  
   - Temporary files (e.g., build output, `.env`) are excluded to maintain a clean and secure repository.

4. **Dynamic Error Handling**:
   - Proper fallback for root elements in React ensures early detection of configuration issues (`main.tsx`).

---

## **Improvements**

### **Backend**
1. **Validation for Query Parameters**:  
   - Currently, query parameters are not validated rigorously enough. While the use of `Enum` constraints helps, deeper checks (e.g., for `startTime` and `endTime` formats) can improve robustness.

2. **Database Integration**:  
   - The current solution loads data from a JSON file. Shifting to a database (e.g., SQLite, PostgreSQL) would enable more advanced querying and better scalability.

3. **Sorting Flexibility**:  
   - Enhance sorting to support ascending/descending directions.

4. **Centralized Logging**:
   - Replace `print` statements with a proper logging system to track application events and errors.

---

### **Frontend**
1. **Pagination Logic**:  
   - The React app currently lacks an implementation to call paginated endpoints dynamically. Adding client-side pagination is essential for large datasets.

2. **Testing**:  
   - Introduce Unit and Integration tests to the React application (e.g., using `@testing-library/react` or `Vitest`).

3. **Error Boundaries**:  
   - Add error boundaries to handle rendering issues gracefully within React.

4. **Frontend-to-Backend Flow**:  
   - Add dynamic request handling to fetch filtered/sorted data from the API.

---

## **Getting Started**

### **Prerequisites**:
- Install Python 3.10 or above.
- Install Node.js (16.x or above recommended for React development).

---

### **Backend (FastAPI)**

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Server**
   ```bash
   uvicorn main:app --reload
   ```

3. **Access API Documentation**:
   - **Swagger**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
   - **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

### **Frontend (React + TailwindCSS)**

1. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## **Example API Endpoints**

- Root: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- List Contributions:  
  [http://127.0.0.1:8000/contributions](http://127.0.0.1:8000/contributions)

### **Query Examples**
- Pagination:  
  `/contributions?skip=0&limit=5`
- Sorting by Title:  
  `/contributions?order_by=title`
- Multi-filter Query (Match All):  
  `/contributions?owner=LiveMusic&title=jazz&match=all`

---
