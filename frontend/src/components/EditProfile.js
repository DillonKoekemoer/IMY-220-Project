// Dillon Koekemoer u23537052
import React, { useState } from 'react';
import { usersAPI } from '../services/api';

const EditProfile = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        bio: user?.bio || '',
        location: user?.location || '',
        website: user?.website || ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else if (formData.firstName.trim().length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters';
        } else if (formData.firstName.trim().length > 50) {
            newErrors.firstName = 'First name must be less than 50 characters';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (formData.lastName.trim().length < 2) {
            newErrors.lastName = 'Last name must be at least 2 characters';
        } else if (formData.lastName.trim().length > 50) {
            newErrors.lastName = 'Last name must be less than 50 characters';
        }

        if (formData.bio.length > 500) {
            newErrors.bio = 'Bio must be less than 500 characters';
        }

        if (formData.website && formData.website.trim()) {
            const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            if (!urlPattern.test(formData.website)) {
                newErrors.website = 'Please enter a valid website URL';
            }
        }

        if (formData.location.length > 100) {
            newErrors.location = 'Location must be less than 100 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (validateForm()) {
            try {
                await usersAPI.update(user._id, formData);
                onSave(formData);
            } catch (error) {
                console.error('Failed to update profile:', error);
                setErrors({ submit: 'Failed to update profile. Please try again.' });
            }
        }
        setIsSubmitting(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-lg p-4">
            <div className="bg-iron-gray text-silver rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-forge-hover border-2 border-forge-orange">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-forge-yellow">✏️ Edit Profile</h3>
                    <button className="text-2xl text-ash-gray hover:text-forge-red transition-colors" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-silver font-semibold mb-2 text-sm uppercase tracking-wide">
                                First Name <span className="text-forge-red">*</span>
                            </label>
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
                                } focus:outline-none placeholder-ash-gray disabled:opacity-50`}
                                required
                                disabled={isSubmitting}
                            />
                            {errors.firstName && (
                                <div className="text-forge-red font-medium text-sm mt-1">{errors.firstName}</div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-silver font-semibold mb-2 text-sm uppercase tracking-wide">
                                Last Name <span className="text-forge-red">*</span>
                            </label>
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
                                } focus:outline-none placeholder-ash-gray disabled:opacity-50`}
                                required
                                disabled={isSubmitting}
                            />
                            {errors.lastName && (
                                <div className="text-forge-red font-medium text-sm mt-1">{errors.lastName}</div>
                            )}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="bio" className="block text-silver font-semibold mb-2 text-sm uppercase tracking-wide">
                            Bio <span className="text-ash-gray normal-case">({formData.bio.length}/500)</span>
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg bg-iron-light text-silver border transition-all duration-300 resize-none ${
                                errors.bio 
                                    ? 'border-red-500 focus:ring-4 focus:ring-red-500/20' 
                                    : 'border-ash-gray focus:border-forge-orange focus:ring-4 focus:ring-forge-orange/20'
                            } focus:outline-none placeholder-ash-gray disabled:opacity-50`}
                            rows="3"
                            placeholder="Tell us about yourself..."
                            maxLength="500"
                            disabled={isSubmitting}
                        />
                        {errors.bio && (
                            <div className="text-forge-red font-medium text-sm mt-1">{errors.bio}</div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-silver font-semibold mb-2 text-sm uppercase tracking-wide">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg bg-iron-light text-silver border transition-all duration-300 min-h-[44px] ${
                                errors.location 
                                    ? 'border-red-500 focus:ring-4 focus:ring-red-500/20' 
                                    : 'border-ash-gray focus:border-forge-orange focus:ring-4 focus:ring-forge-orange/20'
                            } focus:outline-none placeholder-ash-gray disabled:opacity-50`}
                            placeholder="City, Country"
                            maxLength="100"
                            disabled={isSubmitting}
                        />
                        {errors.location && (
                            <div className="text-forge-red font-medium text-sm mt-1">{errors.location}</div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="website" className="block text-silver font-semibold mb-2 text-sm uppercase tracking-wide">Website</label>
                        <input
                            type="url"
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg bg-iron-light text-silver border transition-all duration-300 min-h-[44px] ${
                                errors.website 
                                    ? 'border-red-500 focus:ring-4 focus:ring-red-500/20' 
                                    : 'border-ash-gray focus:border-forge-orange focus:ring-4 focus:ring-forge-orange/20'
                            } focus:outline-none placeholder-ash-gray disabled:opacity-50`}
                            placeholder="https://yourwebsite.com"
                            disabled={isSubmitting}
                        />
                        {errors.website && (
                            <div className="text-forge-red font-medium text-sm mt-1">{errors.website}</div>
                        )}
                    </div>
                    {errors.submit && (
                        <div className="text-forge-red font-medium text-sm text-center mb-4">{errors.submit}</div>
                    )}
                    <div className="flex gap-4 pt-4">
                        <button 
                            type="submit" 
                            className="flex-1 px-8 py-4 rounded-xl text-white font-semibold bg-gradient-fire shadow-forge transition-all duration-300 hover:shadow-forge-hover hover:-translate-y-1 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '⏳ Saving...' : '✨ Save Changes'}
                        </button>
                        <button 
                            type="button" 
                            className="px-8 py-4 rounded-xl font-semibold bg-transparent text-forge-orange border-2 border-forge-orange transition-all duration-300 hover:bg-forge-orange hover:text-white hover:-translate-y-0.5 disabled:opacity-50"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;