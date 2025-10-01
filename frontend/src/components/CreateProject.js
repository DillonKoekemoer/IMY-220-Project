// Dillon Koekemoer u23537052
import React, { useState } from 'react';
import { postsAPI } from '../services/api';

const CreateProject = ({ onClose, onSave, isModal = true }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: '',
        languages: '',
        version: '1.0.0'
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const projectTypes = [
        'Web Application',
        'Mobile Application',
        'Desktop Application',
        'Library',
        'Framework',
        'Tool',
        'Game'
    ];

    const validateForm = () => {
        const newErrors = {};

        // Project name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Project name is required';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Project name must be at least 3 characters';
        } else if (formData.name.trim().length > 100) {
            newErrors.name = 'Project name must be less than 100 characters';
        } else if (!/^[a-zA-Z0-9\s\-_]+$/.test(formData.name)) {
            newErrors.name = 'Project name can only contain letters, numbers, spaces, hyphens, and underscores';
        }

        // Description validation
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.trim().length < 10) {
            newErrors.description = 'Description must be at least 10 characters';
        } else if (formData.description.length > 1000) {
            newErrors.description = 'Description must be less than 1000 characters';
        }

        // Project type validation
        if (!formData.type) {
            newErrors.type = 'Project type is required';
        }

        // Version validation
        if (!formData.version.trim()) {
            newErrors.version = 'Version is required';
        } else if (!/^\d+\.\d+\.\d+$/.test(formData.version.trim())) {
            newErrors.version = 'Version must be in format x.y.z (e.g., 1.0.0)';
        }

        // Languages validation
        if (formData.languages.trim()) {
            const languageList = formData.languages.split(',').map(lang => lang.trim());
            if (languageList.some(lang => lang.length === 0)) {
                newErrors.languages = 'Please remove empty language entries';
            } else if (languageList.some(lang => lang.length > 30)) {
                newErrors.languages = 'Each language name must be less than 30 characters';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (validateForm()) {
            try {
                const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                const processedData = {
                    ...formData,
                    languages: formData.languages
                        .split(',')
                        .map(lang => lang.trim())
                        .filter(lang => lang.length > 0),
                    createdAt: new Date().toISOString(),
                    status: 'active',
                    userId: currentUser._id || currentUser.id
                };

                const result = await postsAPI.create(processedData);
                onSave(result);
            } catch (error) {
                console.error('Create project error:', error);
                setErrors({ submit: error.message || 'Failed to create project' });
            } finally {
                setIsSubmitting(false);
            }
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

    const formContent = (
        <div className={isModal ? "modal-content" : "section-content"}>
            <div className="modal-header">
                <h3>Create New Project</h3>
                {isModal && <button className="modal-close" onClick={onClose}>×</button>}
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="projectName" className="form-label">
                        Project Name <span style={{color: 'red'}}>*</span>
                    </label>
                    <input
                        type="text"
                        id="projectName"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        required
                        maxLength="100"
                        disabled={isSubmitting}
                        placeholder="Enter project name"
                    />
                    {errors.name && (
                        <div className="error-message">{errors.name}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="description" className="form-label">
                        Description <span style={{color: 'red'}}>*</span> ({formData.description.length}/1000)
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={`form-input ${errors.description ? 'error' : ''}`}
                        rows="3"
                        required
                        maxLength="1000"
                        disabled={isSubmitting}
                        placeholder="Describe your project..."
                    />
                    {errors.description && (
                        <div className="error-message">{errors.description}</div>
                    )}
                </div>

                <div className="grid grid-2">
                    <div className="form-group">
                        <label htmlFor="type" className="form-label">
                            Project Type <span style={{color: 'red'}}>*</span>
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className={`form-input ${errors.type ? 'error' : ''}`}
                            required
                            disabled={isSubmitting}
                        >
                            <option value="">Select type...</option>
                            {projectTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        {errors.type && (
                            <div className="error-message">{errors.type}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="version" className="form-label">
                            Version <span style={{color: 'red'}}>*</span>
                        </label>
                        <input
                            type="text"
                            id="version"
                            name="version"
                            value={formData.version}
                            onChange={handleChange}
                            className={`form-input ${errors.version ? 'error' : ''}`}
                            required
                            disabled={isSubmitting}
                            placeholder="1.0.0"
                            pattern="^\d+\.\d+\.\d+$"
                        />
                        {errors.version && (
                            <div className="error-message">{errors.version}</div>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="languages" className="form-label">
                        Programming Languages (comma-separated)
                    </label>
                    <input
                        type="text"
                        id="languages"
                        name="languages"
                        value={formData.languages}
                        onChange={handleChange}
                        className={`form-input ${errors.languages ? 'error' : ''}`}
                        placeholder="JavaScript, Python, CSS"
                        disabled={isSubmitting}
                    />
                    {errors.languages && (
                        <div className="error-message">{errors.languages}</div>
                    )}
                    <small className="text-muted">
                        Separate multiple languages with commas
                    </small>
                </div>

                {errors.submit && (
                    <div className="error-message">{errors.submit}</div>
                )}

                <div className="flex gap-2">
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Project'}
                    </button>
                    {isModal && (
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );

    return isModal ? (
        <div className="modal-overlay">
            {formContent}
        </div>
    ) : formContent;
};

export default CreateProject;