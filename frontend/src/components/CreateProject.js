// Dillon Koekemoer u23537052
import React, { useState } from 'react';
import { postsAPI } from '../services/api';

const CreateProject = ({ onClose, onSave, isModal = true, currentUser }) => {
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
                const processedData = {
                    ...formData,
                    languages: formData.languages
                        .split(',')
                        .map(lang => lang.trim())
                        .filter(lang => lang.length > 0),
                    createdAt: new Date().toISOString(),
                    status: 'active',
                    userId: currentUser?._id
                };

                const response = await fetch('http://localhost:3001/api/projects', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(processedData)
                });
                
                if (!response.ok) {
                    throw new Error('Failed to create project');
                }
                
                const result = await response.json();
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
        <div className={isModal ? "bg-iron-gray text-silver rounded-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-forge-hover border-2 border-forge-orange animate-modal-slide-in" : ""}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-forge-yellow">Create New Project</h3>
                {isModal && <button className="text-2xl text-ash-gray hover:text-forge-red transition-colors" onClick={onClose}>×</button>}
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="projectName" className="block text-silver font-semibold mb-2 text-sm uppercase tracking-wide">
                        Project Name <span className="text-forge-red">*</span>
                    </label>
                    <input
                        type="text"
                        id="projectName"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg bg-iron-light text-silver border transition-all duration-300 min-h-[44px] ${
                            errors.name 
                                ? 'border-red-500 focus:ring-4 focus:ring-red-500/20' 
                                : 'border-ash-gray focus:border-forge-orange focus:ring-4 focus:ring-forge-orange/20'
                        } focus:outline-none placeholder-ash-gray disabled:opacity-50`}
                        required
                        maxLength="100"
                        disabled={isSubmitting}
                        placeholder="Enter project name"
                    />
                    {errors.name && (
                        <div className="text-forge-red font-medium text-sm mt-1">{errors.name}</div>
                    )}
                </div>

                <div>
                    <label htmlFor="description" className="block text-silver font-semibold mb-2 text-sm uppercase tracking-wide">
                        Description <span className="text-forge-red">*</span> <span className="text-ash-gray normal-case">({formData.description.length}/1000)</span>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg bg-iron-light text-silver border transition-all duration-300 resize-none ${
                            errors.description 
                                ? 'border-red-500 focus:ring-4 focus:ring-red-500/20' 
                                : 'border-ash-gray focus:border-forge-orange focus:ring-4 focus:ring-forge-orange/20'
                        } focus:outline-none placeholder-ash-gray disabled:opacity-50`}
                        rows="3"
                        required
                        maxLength="1000"
                        disabled={isSubmitting}
                        placeholder="Describe your project..."
                    />
                    {errors.description && (
                        <div className="text-forge-red font-medium text-sm mt-1">{errors.description}</div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="type" className="block text-silver font-semibold mb-2 text-sm uppercase tracking-wide">
                            Project Type <span className="text-forge-red">*</span>
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg bg-iron-light text-silver border transition-all duration-300 min-h-[44px] cursor-pointer ${
                                errors.type 
                                    ? 'border-red-500 focus:ring-4 focus:ring-red-500/20' 
                                    : 'border-ash-gray focus:border-forge-orange focus:ring-4 focus:ring-forge-orange/20'
                            } focus:outline-none disabled:opacity-50`}
                            required
                            disabled={isSubmitting}
                        >
                            <option value="">Select type...</option>
                            {projectTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        {errors.type && (
                            <div className="text-forge-red font-medium text-sm mt-1">{errors.type}</div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="version" className="block text-silver font-semibold mb-2 text-sm uppercase tracking-wide">
                            Version <span className="text-forge-red">*</span>
                        </label>
                        <input
                            type="text"
                            id="version"
                            name="version"
                            value={formData.version}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg bg-iron-light text-silver border transition-all duration-300 min-h-[44px] ${
                                errors.version 
                                    ? 'border-red-500 focus:ring-4 focus:ring-red-500/20' 
                                    : 'border-ash-gray focus:border-forge-orange focus:ring-4 focus:ring-forge-orange/20'
                            } focus:outline-none placeholder-ash-gray disabled:opacity-50`}
                            required
                            disabled={isSubmitting}
                            placeholder="1.0.0"
                            pattern="^\d+\.\d+\.\d+$"
                        />
                        {errors.version && (
                            <div className="text-forge-red font-medium text-sm mt-1">{errors.version}</div>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="languages" className="block text-silver font-semibold mb-2 text-sm uppercase tracking-wide">
                        Programming Languages
                    </label>
                    <input
                        type="text"
                        id="languages"
                        name="languages"
                        value={formData.languages}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg bg-iron-light text-silver border transition-all duration-300 min-h-[44px] ${
                            errors.languages 
                                ? 'border-red-500 focus:ring-4 focus:ring-red-500/20' 
                                : 'border-ash-gray focus:border-forge-orange focus:ring-4 focus:ring-forge-orange/20'
                        } focus:outline-none placeholder-ash-gray disabled:opacity-50`}
                        placeholder="JavaScript, Python, CSS"
                        disabled={isSubmitting}
                    />
                    {errors.languages && (
                        <div className="text-forge-red font-medium text-sm mt-1">{errors.languages}</div>
                    )}
                    <div className="text-xs text-ash-gray mt-1">
                        Separate multiple languages with commas
                    </div>
                </div>

                {errors.submit && (
                    <div className="text-forge-red font-medium text-sm text-center">{errors.submit}</div>
                )}

                <div className="flex gap-4 pt-4">
                    <button 
                        type="submit" 
                        className="flex-1 px-8 py-4 rounded-xl text-white font-semibold bg-gradient-fire shadow-forge transition-all duration-300 hover:shadow-forge-hover hover:-translate-y-1 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Project'}
                    </button>
                    {isModal && (
                        <button 
                            type="button" 
                            className="px-8 py-4 rounded-xl font-semibold bg-transparent text-forge-orange border-2 border-forge-orange transition-all duration-300 hover:bg-forge-orange hover:text-white hover:-translate-y-0.5 disabled:opacity-50"
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-lg animate-fade-in p-4">
            {formContent}
        </div>
    ) : formContent;
};

export default CreateProject;