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
            <div className="modal-overlay">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3>Loading...</h3>
                        <button className="modal-close" onClick={onClose}>×</button>
                    </div>
                    <div className="loading">Loading project data...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Reforge Project</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="projectName" className="form-label">
                            Project Name *
                        </label>
                        <input
                            type="text"
                            id="projectName"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`form-input ${errors.name ? 'error' : ''}`}
                            placeholder="Enter your project's forge name"
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={`form-input ${errors.description ? 'error' : ''}`}
                            rows="4"
                            placeholder="Describe what you're forging in this project"
                        />
                        {errors.description && <span className="error-message">{errors.description}</span>}
                    </div>

                    <div className="grid grid-2">
                        <div className="form-group">
                            <label htmlFor="type" className="form-label">
                                Forge Type *
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className={`form-input ${errors.type ? 'error' : ''}`}
                            >
                                <option value="">Select forge type...</option>
                                {projectTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            {errors.type && <span className="error-message">{errors.type}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="version" className="form-label">
                                Version *
                            </label>
                            <input
                                type="text"
                                id="version"
                                name="version"
                                value={formData.version}
                                onChange={handleChange}
                                className={`form-input ${errors.version ? 'error' : ''}`}
                                placeholder="v1.0.0"
                            />
                            {errors.version && <span className="error-message">{errors.version}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="languages" className="form-label">
                            Crafting Materials (Programming Languages)
                        </label>
                        <input
                            type="text"
                            id="languages"
                            name="languages"
                            value={formData.languages}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="JavaScript, Python, CSS, HTML"
                        />
                        <small className="form-help">
                            Separate multiple languages with commas
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="projectImage" className="form-label">
                            Project Image
                        </label>
                        <input
                            type="file"
                            id="projectImage"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="form-input"
                        />
                        {errors.image && <span className="error-message">{errors.image}</span>}
                        <small className="form-help">
                            Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
                        </small>
                    </div>

                    {errors.submit && <div className="error-message">{errors.submit}</div>}

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                            Save Changes
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProject;