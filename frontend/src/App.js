// Dillon Koekemoer u23537052
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProjectPage from './pages/ProjectPage';
import Header from './components/Header';
import './styles/tailwind.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on mount and fetch fresh data
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('currentUser');

            if (token && storedUser) {
                try {
                    const user = JSON.parse(storedUser);

                    // Fetch fresh user data to get latest profile picture
                    const response = await fetch(`http://localhost:3001/api/users/${user._id}`);
                    if (response.ok) {
                        const freshUserData = await response.json();
                        setCurrentUser(freshUserData);
                        localStorage.setItem('currentUser', JSON.stringify(freshUserData));
                    } else {
                        setCurrentUser(user);
                    }

                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Error loading user:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('currentUser');
                }
            }
            setIsLoading(false);
        };

        loadUser();
    }, []);

    const handleLogin = (userData) => {
        console.log('Login data received:', userData);
        const user = userData.user || userData;

        setIsAuthenticated(true);
        setCurrentUser(user);

        // Persist to localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);

        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
    };

    const handleUserUpdate = (updatedUser) => {
        setCurrentUser(updatedUser);
        // Update localStorage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    };

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen bg-iron-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4 animate-pulse">🔥</div>
                    <div className="text-forge-yellow text-xl font-semibold">Loading CodeForge...</div>
                </div>
            </div>
        );
    }

    const ProfileWrapper = ({ currentUser, onLogout, onUserUpdate }) => {
        const { id } = useParams();
        const profileId = id === 'me' ? currentUser?._id : id;
        return (
            <>
                <Header currentUser={currentUser} onLogout={onLogout} />
                <ProfilePage 
                    key={profileId} 
                    profileId={profileId}
                    currentUser={currentUser} 
                    onLogout={onLogout}
                    onUserUpdate={onUserUpdate}
                />
            </>
        );
    };

    return (
        <div className="min-h-screen bg-iron-dark">
            <Routes>
                <Route 
                    path="/" 
                    element={
                        isAuthenticated ? 
                        <Navigate to="/home" replace /> : 
                        <SplashPage onLogin={handleLogin} />
                    } 
                />

                <Route
                    path=""
                    element={<SplashPage onLogin={handleLogin} />}
                />

                <Route 
                    path="/home" 
                    element={
                        isAuthenticated ? (
                            <>
                                <Header currentUser={currentUser} onLogout={handleLogout} />
                                <HomePage currentUser={currentUser} />
                            </>
                        ) : (
                            <Navigate to="/" replace />
                        )
                    } 
                />

                <Route 
                    path="/profile/:id" 
                    element={
                        isAuthenticated ? (
                            <ProfileWrapper 
                                currentUser={currentUser} 
                                onLogout={handleLogout}
                                onUserUpdate={handleUserUpdate}
                            />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    } 
                />

                <Route 
                    path="/project/:id" 
                    element={
                        isAuthenticated ? (
                            <>
                                <Header currentUser={currentUser} onLogout={handleLogout} />
                                <ProjectPage currentUser={currentUser} />
                            </>
                        ) : (
                            <Navigate to="/" replace />
                        )
                    } 
                />

                <Route 
                    path="/post/:id" 
                    element={
                        isAuthenticated ? (
                            <>
                                <Header currentUser={currentUser} onLogout={handleLogout} />
                                <ProjectPage currentUser={currentUser} isPost={true} />
                            </>
                        ) : (
                            <Navigate to="/" replace />
                        )
                    } 
                />
            </Routes>
        </div>
    );
};

export default App;
