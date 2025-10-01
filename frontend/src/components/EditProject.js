// Dillon Koekemoer u23537052
import React, { useState, useEffect } from 'react';
import { projectsAPI } from '../services/api';

const EditProject = ({ projectId, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: '',
        languages: '',
        version: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const project = await projectsAPI.getById(projectId);
                setFormData({
                    name: project.name || '',
                    description: project.description || '',
                    type: project.type || '',
                    languages: Array.isArray(project.languages) ? project.languages.join(', ') : project.languages || '',
                    version: project.version || ''
                });
            } catch (error) {
                console.error('Failed to fetch project:', error);
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            fetchProject();
        }
    }, [projectId]);

    const projectTypes = [
        'Web Application',
        'Mobile Application',
        'Desktop Application',
        'Library',
        'Framework',
        'Tool',
        'Game',
        'API Service',
        'Database Schema',
        'Testing Suite'
    ];

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = "Project name is required";
        } else if (formData.name.length < 3) {
            newErrors.name = "Project name must be at least 3 characters";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        } else if (formData.description.length < 10) {
            newErrors.description = "Description must be at least 10 characters";
        }

        if (!formData.type) {
            newErrors.type = "Project type is required";
        }

        if (!formData.version.trim()) {
            newErrors.version = "Version is required";
        } else if (!/^v?\d+\.\d+(\.\d+)?$/.test(formData.version)) {
            newErrors.version = "Version must follow format: v1.0.0 or 1.0.0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const updateData = {
                    ...formData,
                    languages: formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang)
                };
                await projectsAPI.update(projectId, updateData);
                onSave(updateData);
            } catch (error) {
                console.error('Failed to update project:', error);
                setErrors({ submit: 'Failed to update project' });
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, image: 'Image must be smaller than 5MB' }));
                return;
            }
            
            console.log('Image selected:', file.name);
            setErrors(prev => ({ ...prev, image: '' }));
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-lg p-4">
                <div className="bg-iron-gray text-silver rounded-xl p-8 max-w-md w-full shadow-forge-hover border-2 border-forge-orange">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-forge-yellow">Loading...</h3>
                        <button className="text-2xl text-ash-gray hover:text-forge-red transition-colors" onClick={onClose}>×</button>
                    </div>
                    <div className="text-center text-ash-gray">Loading project data...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-lg p-4">
            <div className="bg-iron-gray text-silver rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-forge-hover border-2 border-forge-orange">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-forge-yellow">⚒️ Reforge Project</h3>
                    <button className="text-2xl text-ash-gray hover:text-forge-red transition-colors" onClick={onClose}>×</button>
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
                            } focus:outline-none placeholder-ash-gray`}
                            placeholder="Enter your project's forge name"
                        />
                        {errors.name && <div className="text-forge-red font-medium text-sm mt-1">{errors.name}</div>}
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-silver font-semibold mb-2 text-sm uppercase tracking-wide">
                            Description <span className="text-forge-red">*</span>
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
                            } focus:outline-none placeholder-ash-gray`}
                            rows="4"
                            placeholder="Describe what you're forging in this project"
                        />
                        {errors.description && <div className="text-forge-red font-medium text-sm mt-1">{errors.description}</div>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="type" className="block text-silver font-semibold mb-2 text-sm uppercase tracking-wide">
                                Forge Type <span className="text-forge-red">*</span>
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
                                } focus:outline-none`}
                            >
                                <option value="">Select forge type...</option>
                                {projectTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            {errors.type && <div className="text-forge-red font-medium text-sm mt-1">{errors.type}</div>}
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
                                } focus:outline-none placeholder-ash-gray`}
                                placeholder="v1.0.0"
                            />
                            {errors.version && <div className="text-forge-red font-medium text-sm mt-1">{errors.version}</div>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="languages" className="block text-silver font-semibold mb-2 text-sm uppercase tracking-wide">
                            Crafting Materials (Programming Languages)
                        </label>
                        <input
                            type="text"
                            id="languages"
                            name="languages"
                            value={formData.languages}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-iron-light text-silver border border-ash-gray focus:border-forge-orange focus:ring-4 focus:ring-forge-orange/20 focus:outline-none placeholder-ash-gray transition-all duration-300 min-h-[44px]"
                            placeholder="JavaScript, Python, CSS, HTML"
                        />
                        <div className="text-xs text-ash-gray mt-1">
                            Separate multiple languages with commas
                        </div>
                    </div>

                    <div>
                        <label htmlFor="projectImage" className="block text-silver font-semibold mb-2 text-sm uppercase tracking-wide">
                            Project Image
                        </label>
                        <input
                            type="file"
                            id="projectImage"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full px-4 py-3 rounded-lg bg-iron-light text-silver border border-ash-gray focus:border-forge-orange focus:ring-4 focus:ring-forge-orange/20 focus:outline-none transition-all duration-300 min-h-[44px] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-forge-orange file:text-white file:font-medium hover:file:bg-forge-red"
                        />
                        {errors.image && <div className="text-forge-red font-medium text-sm mt-1">{errors.image}</div>}
                        <div className="text-xs text-ash-gray mt-1">
                            Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
                        </div>
                    </div>

                    {errors.submit && <div className="text-forge-red font-medium text-sm text-center">{errors.submit}</div>}

                    <div className="flex gap-4 pt-4">
                        <button 
                            type="submit" 
                            className="flex-1 px-8 py-4 rounded-xl text-white font-semibold bg-gradient-fire shadow-forge transition-all duration-300 hover:shadow-forge-hover hover:-translate-y-1 hover:scale-105 active:scale-95"
                        >
                            ✨ Save Changes
                        </button>
                        <button 
                            type="button" 
                            className="px-8 py-4 rounded-xl font-semibold bg-transparent text-forge-orange border-2 border-forge-orange transition-all duration-300 hover:bg-forge-orange hover:text-white hover:-translate-y-0.5"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProject;