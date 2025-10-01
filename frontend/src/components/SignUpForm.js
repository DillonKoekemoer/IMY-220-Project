// Dillon Koekemoer u23537052
import React, { useState } from 'react';
import { authAPI } from '../services/api';

const SignUpForm = ({ onSignUp }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        username: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else if (formData.firstName.length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters';
        }
        
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (formData.lastName.length < 2) {
            newErrors.lastName = 'Last name must be at least 2 characters';
        }
        
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = 'Username can only contain letters, numbers, and underscores';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }
        
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        
        try {
            const name = `${formData.firstName} ${formData.lastName}`;
            const result = await authAPI.register(name, formData.email, formData.password);
            onSignUp(result);
        } catch (error) {
            setErrors({ submit: error.message || 'Registration failed' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-center mb-6 text-xl font-semibold text-silver">Join CodeForge</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="firstName" className="block text-silver font-semibold mb-2 text-sm uppercase tracking-wide">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg bg-iron-light text-silver border transition-all duration-300 min-h-[44px] ${
                            errors.firstName 
                                ? 'border-red-500 focus:ring-4 focus:ring-red-500/20' 
                                : 'border-ash-gray focus:border-forge-orange focus:ring-4 focus:ring-forge-orange/20'
                        } focus:outline-none placeholder-ash-gray`}
                        placeholder="John"
                    />
                    {errors.firstName && <div className="text-forge-red font-medium text-sm mt-1">{errors.firstName}</div>}
                </div>

                <div>
                    <label htmlFor="lastName" className="block text-silver font-semibold mb-2 text-sm uppercase tracking-wide">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg bg-iron-light text-silver border transition-all duration-300 min-h-[44px] ${
                            errors.lastName 
                                ? 'border-red-500 focus:ring-4 focus:ring-red-500/20' 
                                : 'border-ash-gray focus:border-forge-orange focus:ring-4 focus:ring-forge-orange/20'
                        } focus:outline-none placeholder-ash-gray`}
                        placeholder="Doe"
                    />
                    {errors.lastName && <div className="text-forge-red font-medium text-sm mt-1">{errors.lastName}</div>}
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="username" className="block text-silver font-semibold mb-2 text-sm uppercase tracking-wide">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-iron-light text-silver border transition-all duration-300 min-h-[44px] ${
                        errors.username 
                            ? 'border-red-500 focus:ring-4 focus:ring-red-500/20' 
                            : 'border-ash-gray focus:border-forge-orange focus:ring-4 focus:ring-forge-orange/20'
                    } focus:outline-none placeholder-ash-gray`}
                    placeholder="johndoe"
                />
                {errors.username && <div className="text-forge-red font-medium text-sm mt-1">{errors.username}</div>}
            </div>

            <div className="mb-4">
                <label htmlFor="email" className="block text-silver font-semibold mb-2 text-sm uppercase tracking-wide">Email Address</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-iron-light text-silver border transition-all duration-300 min-h-[44px] ${
                        errors.email 
                            ? 'border-red-500 focus:ring-4 focus:ring-red-500/20' 
                            : 'border-ash-gray focus:border-forge-orange focus:ring-4 focus:ring-forge-orange/20'
                    } focus:outline-none placeholder-ash-gray`}
                    placeholder="john@example.com"
                />
                {errors.email && <div className="text-forge-red font-medium text-sm mt-1">{errors.email}</div>}
            </div>

            <div className="mb-4">
                <label htmlFor="password" className="block text-silver font-semibold mb-2 text-sm uppercase tracking-wide">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-iron-light text-silver border transition-all duration-300 min-h-[44px] ${
                        errors.password 
                            ? 'border-red-500 focus:ring-4 focus:ring-red-500/20' 
                            : 'border-ash-gray focus:border-forge-orange focus:ring-4 focus:ring-forge-orange/20'
                    } focus:outline-none placeholder-ash-gray`}
                    placeholder="Enter your password"
                />
                {errors.password && <div className="text-forge-red font-medium text-sm mt-1">{errors.password}</div>}
            </div>

            <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-silver font-semibold mb-2 text-sm uppercase tracking-wide">Confirm Password</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-iron-light text-silver border transition-all duration-300 min-h-[44px] ${
                        errors.confirmPassword 
                            ? 'border-red-500 focus:ring-4 focus:ring-red-500/20' 
                            : 'border-ash-gray focus:border-forge-orange focus:ring-4 focus:ring-forge-orange/20'
                    } focus:outline-none placeholder-ash-gray`}
                    placeholder="Confirm your password"
                />
                {errors.confirmPassword && <div className="text-forge-red font-medium text-sm mt-1">{errors.confirmPassword}</div>}
            </div>

            {errors.submit && <div className="text-forge-red font-medium text-sm mb-4 text-center">{errors.submit}</div>}

            <button 
                type="submit" 
                className="w-full px-8 py-4 rounded-xl text-white font-semibold bg-gradient-fire shadow-forge transition-all duration-300 hover:shadow-forge-hover hover:-translate-y-1 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-h-[52px]"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>
        </form>
    );
};

export default SignUpForm;