import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';
import LogoImage from '../assets/Logo.png'; 
import '../styles/splashpage.css';

const SplashPage = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="splash-container">
            <div className="splash-content">
                {/* Hero content */}
                <div className="splash-hero">
                    {/* Title with Logo */}
                    <div className="splash-title">
                        <img 
                            src={LogoImage} 
                            alt="CodeForge Logo" 
                            className="splash-logo" 
                        />
                        <h1>CodeForge</h1>
                    </div>

                    <div className="splash-tagline">
                        Forge code with precision and collaboration
                    </div>
                    <p className="splash-description">
                        Collaborate on projects with version control and team tools. 
                        Build, refine, and deploy with efficiency.
                    </p>
                    
                    <div className="feature-list">
                        <div className="feature-item">
                            <div className="feature-icon">🔥</div>
                            <div className="feature-text">
                                <strong>Team Collaboration</strong>
                                <span>Work together in real-time</span>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">⚒️</div>
                            <div className="feature-text">
                                <strong>Version Control</strong>
                                <span>Track changes effectively</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Auth forms */}
                <div className="auth-container">
                    <div className="auth-header">
                        <h3>Enter the Forge</h3>
                    </div>
                    
                    <div className="auth-toggle">
                        <button 
                            className={`btn ${isLogin ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setIsLogin(true)}
                        >
                            Login
                        </button>
                        <button 
                            className={`btn ${!isLogin ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setIsLogin(false)}
                        >
                            Sign Up
                        </button>
                    </div>
                    
                    <div className="auth-forms">
                        {isLogin ? (
                            <LoginForm onLogin={onLogin} />
                        ) : (
                            <SignUpForm onSignUp={onLogin} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SplashPage;
