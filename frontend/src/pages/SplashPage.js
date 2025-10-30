// Dillon Koekemoer u23537052
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';
import LogoImage from '../assets/Logo.png';

const SplashPage = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleAuthSuccess = (data) => {
        onLogin(data);
        navigate('/home');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-iron-dark via-iron-light to-iron-dark relative overflow-x-hidden">
            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-forge-orange/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-forge-yellow/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-forge-red/10 rounded-full blur-3xl"></div>
            </div>

            {/* Main Hero Section */}
            <section className="min-h-screen flex items-center justify-center p-8 relative z-10">
                <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Info */}
                    <div className="text-center lg:text-left">
                        {/* Logo and Title */}
                        <div className="flex justify-center lg:justify-start items-center gap-4 mb-6">
                            <img
                                src={LogoImage}
                                alt="CodeForge Logo"
                                className="w-24 h-24"
                            />
                            <h1 className="text-5xl lg:text-6xl font-sans font-bold text-forge-yellow">
                                CodeForge
                            </h1>
                        </div>

                        {/* Tagline */}
                        <p className="text-3xl text-forge-yellow font-semibold mb-6">
                            Where Code is Forged in Fire
                        </p>

                        {/* Description */}
                        <p className="text-lg text-ash-gray mb-8 leading-relaxed">
                            A powerful platform for developers to collaborate, create, and deploy projects with precision.
                            Build amazing projects with your team using our intuitive version control system.
                        </p>

                        {/* Quick Features */}
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3 justify-center lg:justify-start">
                                <div className="text-2xl">🚀</div>
                                <span className="text-ash-gray">Deploy with confidence</span>
                            </div>
                            <div className="flex items-center gap-3 justify-center lg:justify-start">
                                <div className="text-2xl">👥</div>
                                <span className="text-ash-gray">Collaborate seamlessly</span>
                            </div>
                            <div className="flex items-center gap-3 justify-center lg:justify-start">
                                <div className="text-2xl">🔒</div>
                                <span className="text-ash-gray">Secure by design</span>
                            </div>
                        </div>

                        {/* Scroll Indicator */}
                        <div className="hidden lg:flex items-center gap-2 text-forge-yellow animate-bounce">
                            <span className="text-sm">Discover more</span>
                            <span className="text-xl">↓</span>
                        </div>
                    </div>

                    {/* Right Side - Auth Forms */}
                    <div className="flex justify-center lg:justify-end">
                        <div className="w-full max-w-md">
                            <div className="bg-gradient-steel p-8 rounded-xl shadow-forge border-2 border-forge-orange">
                                {/* Tab Buttons */}
                                <div className="flex gap-2 mb-8 bg-iron-light p-1 rounded-lg">
                                    <button
                                        className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                                            isLogin
                                                ? 'bg-gradient-fire text-white shadow-forge'
                                                : 'text-forge-orange hover:bg-forge-orange/10'
                                        }`}
                                        onClick={() => setIsLogin(true)}
                                    >
                                        Login
                                    </button>
                                    <button
                                        className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                                            !isLogin
                                                ? 'bg-gradient-fire text-white shadow-forge'
                                                : 'text-forge-orange hover:bg-forge-orange/10'
                                        }`}
                                        onClick={() => setIsLogin(false)}
                                    >
                                        Sign Up
                                    </button>
                                </div>

                                {/* Forms */}
                                <div>
                                    {isLogin ? (
                                        <LoginForm onLogin={handleAuthSuccess} />
                                    ) : (
                                        <SignUpForm onSignUp={handleAuthSuccess} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Additional Info Section - Scrollable */}
            <section className="relative z-10 py-20 px-8 bg-gradient-to-b from-transparent via-iron-light/50 to-transparent">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-forge-yellow mb-4">
                        Why Choose CodeForge?
                    </h2>
                    <p className="text-center text-ash-gray text-lg mb-16 max-w-3xl mx-auto">
                        Everything you need to build, collaborate, and deploy exceptional software
                    </p>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        <div className="bg-gradient-steel/60 backdrop-blur-sm p-6 rounded-xl border border-steel-blue hover:border-forge-orange transition-all duration-300">
                            <div className="text-4xl mb-4">🔥</div>
                            <h3 className="text-xl font-bold text-forge-yellow mb-2">Version Control</h3>
                            <p className="text-ash-gray text-sm">Track changes with our check-in/check-out system</p>
                        </div>

                        <div className="bg-gradient-steel/60 backdrop-blur-sm p-6 rounded-xl border border-steel-blue hover:border-forge-orange transition-all duration-300">
                            <div className="text-4xl mb-4">⚒️</div>
                            <h3 className="text-xl font-bold text-forge-yellow mb-2">Team Collaboration</h3>
                            <p className="text-ash-gray text-sm">Work together on shared projects with ease</p>
                        </div>

                        <div className="bg-gradient-steel/60 backdrop-blur-sm p-6 rounded-xl border border-steel-blue hover:border-forge-orange transition-all duration-300">
                            <div className="text-4xl mb-4">📦</div>
                            <h3 className="text-xl font-bold text-forge-yellow mb-2">File Management</h3>
                            <p className="text-ash-gray text-sm">Upload, download, and manage all project files</p>
                        </div>

                        <div className="bg-gradient-steel/60 backdrop-blur-sm p-6 rounded-xl border border-steel-blue hover:border-forge-orange transition-all duration-300">
                            <div className="text-4xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold text-forge-yellow mb-2">Smart Search</h3>
                            <p className="text-ash-gray text-sm">Find projects and users with fuzzy search</p>
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="bg-gradient-steel/40 backdrop-blur-sm p-8 rounded-xl border border-forge-orange/30">
                        <h3 className="text-2xl font-bold text-forge-yellow mb-6 text-center">How It Works</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-fire rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">1</div>
                                <h4 className="text-lg font-semibold text-forge-yellow mb-2">Create Projects</h4>
                                <p className="text-ash-gray text-sm">Set up your repository and upload files</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-fire rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">2</div>
                                <h4 className="text-lg font-semibold text-forge-yellow mb-2">Collaborate</h4>
                                <p className="text-ash-gray text-sm">Add team members and work together</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-fire rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">3</div>
                                <h4 className="text-lg font-semibold text-forge-yellow mb-2">Deploy</h4>
                                <p className="text-ash-gray text-sm">Share your projects with the world</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-12 px-8 border-t border-forge-orange/20">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="flex justify-center items-center gap-3 mb-4">
                        <img src={LogoImage} alt="CodeForge" className="w-10 h-10" />
                        <span className="text-xl font-bold text-forge-yellow">CodeForge</span>
                    </div>
                    <p className="text-ash-gray text-sm mb-2">
                        Where code is forged in fire. Built by developers, for developers.
                    </p>
                    <p className="text-ash-gray text-xs">
                        © 2025 CodeForge. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default SplashPage;
