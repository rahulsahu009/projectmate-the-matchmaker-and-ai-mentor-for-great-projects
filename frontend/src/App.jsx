import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Explore from './pages/Explore';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';

function AppContent() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200 flex flex-col">
      <Navbar />
      <main className="flex-1 w-full mx-auto relative relative">
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-indigo-100/50 to-transparent dark:from-indigo-900/10 dark:to-transparent pointer-events-none -translate-y-px"></div>
        <div className="relative z-10 w-full h-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/project/:id" element={<ProjectDetails />} />
            </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
