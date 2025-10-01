// Dillon Koekemoer u23537052
import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';
import LogoImage from '../assets/Logo.png'; 


const SplashPage = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen bg-iron-dark relative overflow-hidden flex justify-center items-center py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 max-w-6xl w-full px-8 gap-12 items-center relative z-10">
                <div className="px-6 animate-fade-in-up">
                    <div className="flex items-center gap-4 mb-6">
                        <img 
                            src={LogoImage} 
                            alt="CodeForge Logo" 
                            className="w-48 h-auto" 
                        />
                        <h1 className="text-5xl lg:text-6xl font-display font-bold text-forge-yellow">
                            CodeForge
                        </h1>
                    </div>

                    <div className="text-xl text-ash-gray mb-6 text-left leading-relaxed">
                        Forge code with precision and collaboration
                    </div>
                    <p className="text-base text-ash-gray leading-relaxed mb-8 max-w-lg text-left">
                        Collaborate on projects with version control and team tools. 
                        Build, refine, and deploy with efficiency.
                    </p>
                    
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-6 animate-bounce-in">
                            <div className="text-2xl w-12 h-12 flex items-center justify-center bg-forge-orange/20 rounded-full animate-float">🔥</div>
                            <div className="text-left">
                                <div className="text-forge-yellow text-lg font-semibold block mb-1">Team Collaboration</div>
                                <span className="text-ash-gray text-sm">Work together in real-time</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 animate-bounce-in" style={{animationDelay: '0.2s'}}>
                            <div className="text-2xl w-12 h-12 flex items-center justify-center bg-forge-orange/20 rounded-full animate-float" style={{animationDelay: '1s'}}>⚒️</div>
                            <div className="text-left">
                                <div className="text-forge-yellow text-lg font-semibold block mb-1">Version Control</div>
                                <span className="text-ash-gray text-sm">Track changes effectively</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-steel p-8 rounded-xl shadow-forge border-2 border-forge-orange animate-modal-slide-in relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-fire rounded-t-xl"></div>
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-display font-semibold text-forge-yellow">Enter the Forge</h3>
                    </div>
                    
                    <div className="flex gap-2 mb-8 justify-center bg-iron-light p-1 rounded-lg">
                        <button 
                            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                                isLogin 
                                    ? 'bg-gradient-fire text-white shadow-forge transform -translate-y-1' 
                                    : 'bg-transparent text-forge-orange border-2 border-forge-orange hover:bg-forge-orange hover:text-white'
                            }`}
                            onClick={() => setIsLogin(true)}
                        >
                            Login
                        </button>
                        <button 
                            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                                !isLogin 
                                    ? 'bg-gradient-fire text-white shadow-forge transform -translate-y-1' 
                                    : 'bg-transparent text-forge-orange border-2 border-forge-orange hover:bg-forge-orange hover:text-white'
                            }`}
                            onClick={() => setIsLogin(false)}
                        >
                            Sign Up
                        </button>
                    </div>
                    
                    <div className="mt-6">
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
