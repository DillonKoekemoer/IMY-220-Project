// Dillon Koekemoer u23537052
import React, { useState } from 'react';

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

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (validateForm()) {
            setTimeout(() => {
                onSave(formData);
                setIsSubmitting(false);
            }, 500);
        } else {
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
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Edit Profile</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-2">
                        <div className="form-group">
                            <label htmlFor="firstName" className="form-label">
                                First Name <span style={{color: 'red'}}>*</span>
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`form-input ${errors.firstName ? 'error' : ''}`}
                                required
                                disabled={isSubmitting}
                            />
                            {errors.firstName && (
                                <div className="error-message">{errors.firstName}</div>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName" className="form-label">
                                Last Name <span style={{color: 'red'}}>*</span>
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`form-input ${errors.lastName ? 'error' : ''}`}
                                required
                                disabled={isSubmitting}
                            />
                            {errors.lastName && (
                                <div className="error-message">{errors.lastName}</div>
                            )}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="bio" className="form-label">
                            Bio ({formData.bio.length}/500)
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className={`form-input ${errors.bio ? 'error' : ''}`}
                            rows="3"
                            placeholder="Tell us about yourself..."
                            maxLength="500"
                            disabled={isSubmitting}
                        />
                        {errors.bio && (
                            <div className="error-message">{errors.bio}</div>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="location" className="form-label">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className={`form-input ${errors.location ? 'error' : ''}`}
                            placeholder="City, Country"
                            maxLength="100"
                            disabled={isSubmitting}
                        />
                        {errors.location && (
                            <div className="error-message">{errors.location}</div>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="website" className="form-label">Website</label>
                        <input
                            type="url"
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            className={`form-input ${errors.website ? 'error' : ''}`}
                            placeholder="https://yourwebsite.com"
                            disabled={isSubmitting}
                        />
                        {errors.website && (
                            <div className="error-message">{errors.website}</div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
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