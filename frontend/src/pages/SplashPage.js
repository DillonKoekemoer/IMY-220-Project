// Dillon Koekemoer u23537052
import React, { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';
import LogoImage from '../assets/Logo.png'; 

const SplashPage = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToMission = () => {
        document.getElementById('mission').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Fixed Volcano Background */}
            <div className="fixed inset-0 volcano-bg"></div>
            
            {/* Hero Section */}
            <section className="min-h-screen flex justify-center items-center py-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 max-w-6xl w-full px-8 gap-12 items-center">
                    <div className="px-6 animate-fade-in-up">
                        <div className="flex items-center gap-4 mb-6">
                            <img 
                                src={LogoImage} 
                                alt="CodeForge Logo" 
                                className="w-48 h-auto" 
                            />
                            <h1 className="text-5xl lg:text-6xl font-sans font-bold text-forge-yellow">
                                CodeForge
                            </h1>
                        </div>

                        <div className="text-xl text-ash-gray mb-6 text-left leading-relaxed">
                            The ultimate repository platform for developers
                        </div>
                        <p className="text-base text-ash-gray leading-relaxed mb-8 max-w-lg text-left">
                            Host, collaborate, and deploy your code with powerful version control and team management tools.
                        </p>
                        
                        <div className="flex flex-col gap-6 mb-8">
                            <div className="flex items-center gap-6 animate-bounce-in">
                                <div className="text-2xl w-12 h-12 flex items-center justify-center bg-forge-orange/20 rounded-full animate-float">🔥</div>
                                <div className="text-left">
                                    <div className="text-forge-yellow text-lg font-semibold block mb-1">Git Repository Hosting</div>
                                    <span className="text-ash-gray text-sm">Unlimited public and private repos</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 animate-bounce-in" style={{animationDelay: '0.2s'}}>
                                <div className="text-2xl w-12 h-12 flex items-center justify-center bg-forge-orange/20 rounded-full animate-float" style={{animationDelay: '1s'}}>⚒️</div>
                                <div className="text-left">
                                    <div className="text-forge-yellow text-lg font-semibold block mb-1">Team Collaboration</div>
                                    <span className="text-ash-gray text-sm">Issue tracking, pull requests, code reviews</span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={scrollToMission}
                            className="flex items-center gap-2 text-forge-orange hover:text-forge-yellow transition-colors scroll-indicator"
                        >
                            <span>Discover Our Mission</span>
                            <span className="text-xl">↓</span>
                        </button>
                    </div>

                    <div className="bg-gradient-steel p-8 rounded-xl shadow-forge border-2 border-forge-orange animate-modal-slide-in relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-fire rounded-t-xl"></div>
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-sans font-semibold text-forge-yellow">Enter the Forge</h3>
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
            </section>

            {/* Mission Section */}
            <section id="mission" className="min-h-screen flex items-center py-16 relative z-10">
                <div className="max-w-6xl mx-auto px-8 w-full">
                    <div 
                        className="text-center mb-16"
                        style={{ transform: `translateY(${scrollY * -0.1}px)` }}
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold text-forge-yellow mb-8">
                            Our Mission: Forging the Future of Code
                        </h2>
                        <p className="text-xl text-ash-gray max-w-4xl mx-auto leading-relaxed">
                            At CodeForge, we believe every line of code is a spark that can ignite innovation. 
                            Our mission is to provide developers with the most powerful, intuitive, and collaborative 
                            platform to host, manage, and deploy their code repositories.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div 
                            className="bg-gradient-steel p-8 rounded-xl border-2 border-forge-orange text-center"
                            style={{ transform: `translateY(${scrollY * -0.05}px)` }}
                        >
                            <div className="text-4xl mb-4">🚀</div>
                            <h3 className="text-xl font-bold text-forge-yellow mb-4">Deploy with Confidence</h3>
                            <p className="text-ash-gray">Seamless CI/CD integration and automated deployments to get your code from forge to production.</p>
                        </div>
                        
                        <div 
                            className="bg-gradient-steel p-8 rounded-xl border-2 border-forge-orange text-center"
                            style={{ transform: `translateY(${scrollY * -0.08}px)` }}
                        >
                            <div className="text-4xl mb-4">👥</div>
                            <h3 className="text-xl font-bold text-forge-yellow mb-4">Collaborate Seamlessly</h3>
                            <p className="text-ash-gray">Advanced team management, code reviews, and project tracking tools built for modern development workflows.</p>
                        </div>
                        
                        <div 
                            className="bg-gradient-steel p-8 rounded-xl border-2 border-forge-orange text-center"
                            style={{ transform: `translateY(${scrollY * -0.03}px)` }}
                        >
                            <div className="text-4xl mb-4">🔒</div>
                            <h3 className="text-xl font-bold text-forge-yellow mb-4">Secure by Design</h3>
                            <p className="text-ash-gray">Enterprise-grade security, private repositories, and granular access controls to protect your intellectual property.</p>
                        </div>
                    </div>

                    <div className="text-center mt-16">
                        <p className="text-lg text-forge-orange font-semibold">
                            Join developers who have already chosen CodeForge as their development home.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SplashPage;
