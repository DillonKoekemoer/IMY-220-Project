// Dillon Koekemoer u23537052
import React, { useState } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProjectPage from './pages/ProjectPage';
import Header from './components/Header';
import './styles/main.css';
import './styles/utils.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); 
    const [currentUser, setCurrentUser] = useState(null);

    const handleLogin = (userData) => {
        setIsAuthenticated(true);
        setCurrentUser(userData);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
    };

    const handleUserUpdate = (updatedUser) => {
        setCurrentUser(updatedUser);
    };

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
        <div className="app">
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
