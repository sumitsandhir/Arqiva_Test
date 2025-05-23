/**
 * Main application component that sets up the routing and layout structure.
 * Includes header with app title and dark mode toggle, main content area with routes,
 * and a footer with copyright information.
 */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ContributionsList from './components/ContributionList'; // Import the component
import DarkModeToggle from './components/DarkModeToggle';

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <header className="bg-blue-600 dark:bg-blue-800 text-white p-4 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Contribution Viewer</h1>
                    <DarkModeToggle />
                </div>
            </header>
            <main className="container mx-auto p-4">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/contributions" element={<ContributionsList />} /> {/* Add new route */}
                </Routes>
            </main>
            <footer className="bg-gray-100 dark:bg-gray-800 p-4 border-t dark:border-gray-700">
                <div className="container mx-auto text-center text-gray-600 dark:text-gray-300">
                    <p>© 2025 Contribution Viewer</p>
                </div>
            </footer>
        </div>
    );
};

export default App;
