// Dillon Koekemoer u23537052
import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Save token to localStorage
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    console.log('Token saved to localStorage');
                }
                onLogin(data);
                setErrors({});
            } else {
                setErrors({ submit: data.error || 'Login failed' });
            }
        } catch (error) {
            setErrors({ submit: 'Network error. Please try again.' });
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
            <h2 className="text-center mb-6 text-xl font-semibold text-silver">Welcome Back</h2>
            
            <div className="mb-6">
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
                    placeholder="Enter your email"
                />
                {errors.email && <div className="text-forge-red font-medium text-sm mt-1">{errors.email}</div>}
            </div>

            <div className="mb-6">
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

            {errors.submit && <div className="text-forge-red font-medium text-sm mb-4 text-center">{errors.submit}</div>}

            <button 
                type="submit" 
                className="w-full px-8 py-4 rounded-xl text-white font-semibold bg-gradient-fire shadow-forge transition-all duration-300 hover:shadow-forge-hover hover:-translate-y-1 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-h-[52px]"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
        </form>
    );
};

export default LoginForm;
