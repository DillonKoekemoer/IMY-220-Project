import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoImage from '../assets/Logo.png'; 
import TempProfilePic from '../assets/thething.png';
import '../styles/main.css';
import '../styles/utils.css';

const Header = ({ currentUser, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    const handleProfileClick = () => {
        navigate(`/profile/${currentUser?.id || '1'}`);
    };

    return (
        <header className="header">
            <nav className="nav container">
                <div className="nav-left">
                    <Link to="/" className="nav-brand">
                        <img
                            src={LogoImage} 
                            alt="CodeForge Logo"
                            className="nav-brand-logo"
                        />
                        CodeForge
                    </Link>
                    <div className="nav-tagline">
                        Where code is forged in fire
                    </div>
                </div>
                
                <div className="nav-right">
                    <ul className="nav-links">
                        <li><Link to="/home" className="nav-link">Home</Link></li>
                        <li><Link to={`/profile/${currentUser?.id || '1'}`} className="nav-link">Profile</Link></li>
                    </ul>
                    
                    <img 
                        src={TempProfilePic} 
                        alt="Profile" 
                        className="nav-profile" 
                        onClick={handleProfileClick} 
                        title="Profile" 
                    />
                </div>
            </nav>
        </header>
    );
};

export default Header;
