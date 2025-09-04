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
        
        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        // Password validation
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

        setTimeout(() => {
            // Dummy info
            const dummyUser = {
                email: 'dillon.koek2@gmail.com',
                password: 'password123',
                name: 'Test User',
                id: 1
            };

            if (
                formData.email === dummyUser.email &&
                formData.password === dummyUser.password
            ) {
                onLogin(dummyUser);
                setErrors({});
            } else {
                setErrors({ submit: 'Invalid email or password' });
            }

            setIsSubmitting(false);
        }, 1000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <h2 className="text-center mb-3">Welcome Back</h2>
            
            <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="Enter your email"
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                />
                {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            {errors.submit && <div className="error-message mb-2">{errors.submit}</div>}

            <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isSubmitting}
                style={{ width: '100%' }}
            >
                {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
        </form>
    );
};

export default LoginForm;
