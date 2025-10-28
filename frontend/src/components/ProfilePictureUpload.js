// Dillon Koekemoer u23537052
import React, { useState, useRef } from 'react';
import { usersAPI } from '../services/api';

const ProfilePictureUpload = ({ currentPicture, userId, onUploadSuccess }) => {
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

        try {
            const data = await usersAPI.uploadProfilePicture(userId, file);
            console.log('Upload successful:', data);

            if (onUploadSuccess) {
                onUploadSuccess(data.profilePicture);
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

    const getProfileImageStyle = (picture) => {
        if (!picture) return {};

        // Check if it's a placeholder
        if (picture.startsWith('placeholder-')) {
            const color = picture.replace('placeholder-', '');
            return {
                background: `linear-gradient(135deg, #${color} 0%, #${color}dd 100%)`,
            };
        }

        // It's an uploaded image
        return {
            backgroundImage: `url(http://localhost:3001${picture})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        };
    };

    return (
        <div className="space-y-4">
            <div
                className={`relative group cursor-pointer transition-all duration-300 ${
                    isDragging ? 'scale-105 ring-4 ring-forge-orange' : ''
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <div
                    className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold shadow-forge-glow border-4 border-forge-yellow mx-auto relative overflow-hidden"
                    style={preview ? { backgroundImage: `url(${preview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : getProfileImageStyle(currentPicture)}
                >
                    {!preview && !currentPicture?.startsWith('/uploads') && (
                        <span className="text-white relative z-10">
                            {userId?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white text-sm">
                        <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-semibold">
                            {isUploading ? 'Uploading...' : 'Change Photo'}
                        </span>
                        <span className="text-xs text-ash-gray mt-1">
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
                <p>Drag and drop or click to upload</p>
                <p className="mt-1">Max size: 5MB • Formats: JPG, PNG, GIF</p>
            </div>
        </div>
    );
};

export default ProfilePictureUpload;
