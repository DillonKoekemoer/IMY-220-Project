// Dillon Koekemoer u23537052
import React, { useState, useRef } from 'react';

const ProjectImageUpload = ({ currentImage, projectId, onUploadSuccess }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFile(files[0]);
        }
    };

    const handleFileInput = (e) => {
        const files = e.target.files;
        if (files && files[0]) {
            handleFile(files[0]);
        }
    };

    const handleFile = (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size must be less than 5MB');
            return;
        }

        setError(null);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload file
        uploadFile(file);
    };

    const uploadFile = async (file) => {
        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('projectImage', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/projects/${projectId}/image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const text = await response.text();
                let errorMessage = 'Failed to upload project image';
                try {
                    const errorData = JSON.parse(text);
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    errorMessage = text || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('Upload successful:', data);

            if (onUploadSuccess) {
                onUploadSuccess(data.projectImage);
            }

            setPreview(null);
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message || 'Failed to upload image');
            setPreview(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        return `http://localhost:3001${imagePath}`;
    };

    return (
        <div className="space-y-4">
            <div
                className={`relative group cursor-pointer transition-all duration-300 rounded-lg overflow-hidden ${
                    isDragging ? 'scale-105 ring-4 ring-forge-orange' : ''
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <div
                    className="w-full h-48 flex items-center justify-center bg-gradient-metal border-2 border-forge-orange rounded-lg relative overflow-hidden"
                    style={
                        preview
                            ? { backgroundImage: `url(${preview})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                            : currentImage
                            ? { backgroundImage: `url(${getImageUrl(currentImage)})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                            : {}
                    }
                >
                    {!preview && !currentImage && (
                        <div className="text-center text-ash-gray">
                            <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="font-semibold">Project Image</p>
                        </div>
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white">
                        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-semibold text-lg">
                            {isUploading ? 'Uploading...' : currentImage ? 'Change Image' : 'Upload Image'}
                        </span>
                        <span className="text-sm text-ash-gray mt-1">
                            Click or drag & drop
                        </span>
                    </div>

                    {isUploading && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forge-orange"></div>
                        </div>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                />
            </div>

            {error && (
                <div className="text-forge-red text-sm text-center bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    {error}
                </div>
            )}

            <div className="text-center text-xs text-ash-gray">
                <p>Drag and drop or click to upload project image</p>
                <p className="mt-1">Max size: 5MB • Formats: JPG, PNG, GIF</p>
            </div>
        </div>
    );
};

export default ProjectImageUpload;
