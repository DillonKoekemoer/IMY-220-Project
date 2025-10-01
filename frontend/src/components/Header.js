// Dillon Koekemoer u23537052
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LogoImage from '../assets/Logo.png'; 
import TempProfilePic from '../assets/thething.png';


const Header = ({ currentUser, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    const handleProfileClick = () => {
        navigate(`/profile/${currentUser?._id || 'me'}`);
    };

    return (
        <header className="bg-gradient-to-r from-steel-dark to-iron-light shadow-forge sticky top-0 z-50 border-b-2 border-forge-orange backdrop-blur-lg animate-slide-down">
            <nav className="flex justify-between items-center py-6 px-8 max-w-6xl mx-auto min-h-[80px]">
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center gap-2 text-silver text-2xl font-display font-bold transition-all duration-300 hover:text-forge-yellow hover:scale-105">
                        <img
                            src={LogoImage} 
                            alt="CodeForge Logo"
                            className="w-12 h-12 rounded-full object-cover border-3 border-forge-yellow bg-iron-dark transition-all duration-300 hover:border-silver hover:rotate-360"
                        />
                        CodeForge
                    </Link>
                    <div className="text-steel-light text-sm italic opacity-90 hidden md:block">
                        Where code is forged in fire
                    </div>
                </div>
                
                <div className="flex items-center gap-8">
                    <ul className="flex gap-8 items-center list-none m-0 p-0">
                        <li>
                            <Link 
                                to="/home" 
                                className={`text-ash-gray font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:text-forge-yellow hover:bg-forge-orange/10 hover:-translate-y-0.5 ${
                                    location.pathname === '/home' ? 'text-forge-yellow bg-forge-orange/20 border border-forge-orange/30' : ''
                                }`}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to={`/profile/${currentUser?._id || 'me'}`} 
                                className={`text-ash-gray font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:text-forge-yellow hover:bg-forge-orange/10 hover:-translate-y-0.5 ${
                                    location.pathname.includes('/profile/') ? 'text-forge-yellow bg-forge-orange/20 border border-forge-orange/30' : ''
                                }`}
                            >
                                Profile
                            </Link>
                        </li>
                    </ul>
                    
                    <div 
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-forge-orange via-forge-red to-forge-yellow text-white flex items-center justify-center font-semibold cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-forge-glow border-2 border-forge-yellow text-sm"
                        onClick={handleProfileClick} 
                        title="Profile"
                    >
                        {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
