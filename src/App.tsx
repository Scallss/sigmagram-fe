// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import CommunityDetailPage from './pages/communities/CommunityDetailPage';
import CommunitiesPage from './pages/communities/CommunityListPage';
import EditCommunityForm from './pages/communities/EditCommunityForm';
import Navbar from './pages/layout/Navbar';
import ProtectedRoute from './pages/layout/ProtectedRoute';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main>
            <Routes>
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route 
                path="/communities" 
                element={
                  <ProtectedRoute>
                    <CommunitiesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/communities/:id" 
                element={
                  <ProtectedRoute>
                    <CommunityDetailPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/communities/:id/edit" 
                element={
                  <ProtectedRoute>
                    <EditCommunityForm />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;