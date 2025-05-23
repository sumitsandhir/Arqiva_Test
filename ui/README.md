# Contribution Viewer

A React application for viewing and searching through a list of video contributions.

## Features

- View a list of contributions with details (title, description, start/end times, owner, status)
- Search contributions by title and producer
- Pagination with 14 contributions per page
- Responsive design (3 per row on desktop, 2 on tablet, 1 on mobile)
- URL persistence for searches and pagination
- Dark mode support with system preference detection and manual toggle

## Technologies Used

- React 18 with TypeScript
- React Router for navigation and URL persistence
- Axios for API requests
- Tailwind CSS for styling
- Vite for build tooling
- Vitest and React Testing Library for testing

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
cd ui
npm install
# or
yarn
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

This will start the development server at [http://localhost:5173](http://localhost:5173).

### Building for Production

```bash
npm run build
# or
yarn build
```

This will create a production-ready build in the `dist` directory.

### Running the Production Build

```bash
npm run preview
# or
yarn preview
```

### Running Tests

```bash
# Run tests once
npm run test
# or
yarn test

# Run tests in watch mode
npm run test:watch
# or
yarn test:watch

# Run tests with coverage
npm run test:coverage
# or
yarn test:coverage
```

The test suite includes unit tests for all components using React Testing Library and Vitest. Tests are automatically run before building the production version to ensure code quality.

## Backend API

The application uses a FastAPI backend that provides contribution data. Make sure the backend server is running on `http://localhost:8000` before starting the frontend application.

To run the backend server:

```bash
cd ../backend
pip install -r requirements.txt
fastapi dev main.py
```

## Project Structure

- `src/components/`: Reusable UI components
  - `ContributionCard.jsx`: Card component for displaying a single contribution
  - `SearchBar.jsx`: Search form for filtering contributions
  - `Pagination.jsx`: Pagination controls
- `src/pages/`: Page components
  - `HomePage.jsx`: Main page that displays the list of contributions
- `src/App.jsx`: Main application component with routing
- `src/main.jsx`: Entry point for the React application

## Design Decisions

- **React + TypeScript**: Chosen for rapid development, type safety, and responsive design
- **Component Structure**: Separated into reusable components for better maintainability
- **URL Persistence**: Search parameters and pagination state are stored in the URL for better user experience and shareable links
- **Responsive Design**: Uses Tailwind's responsive classes to adapt to different screen sizes
- **Status Calculation**: Contribution status (Complete, Active, Scheduled) is calculated based on the current time compared to the start and end times
- **Dark Mode**: Implemented using Tailwind's dark mode class strategy, with system preference detection and localStorage persistence for user preferences
- **Testing Strategy**: Comprehensive unit tests for all components using React Testing Library and Vitest
  - Component tests verify rendering, user interactions, and state changes
  - HomePage tests mock API calls to test loading, error, and success states
  - Tests are integrated into the build process to ensure code quality
