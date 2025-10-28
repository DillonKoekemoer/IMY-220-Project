// Dillon Koekemoer u23537052
import React, { useState, useRef } from 'react';

const ProjectFileUpload = ({ projectId, onUploadSuccess, existingFiles = [] }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState(existingFiles);
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

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFiles(files);
        }
    };

    const handleFileInput = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            handleFiles(files);
        }
    };

    const handleFiles = async (files) => {
        // Validate file sizes
        const maxSize = 50 * 1024 * 1024; // 50MB
        const invalidFiles = files.filter(file => file.size > maxSize);

        if (invalidFiles.length > 0) {
            setError(`Some files exceed the 50MB limit: ${invalidFiles.map(f => f.name).join(', ')}`);
            return;
        }

        setError(null);
        uploadFiles(files);
    };

    const uploadFiles = async (files) => {
        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        files.forEach(file => {
            formData.append('projectFiles', file);
        });
        formData.append('projectId', projectId);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/projects/${projectId}/files`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const data = await response.json();
            console.log('Upload successful:', data);

            const newFiles = data.files || [];
            setUploadedFiles(prev => [...prev, ...newFiles]);

            if (onUploadSuccess) {
                onUploadSuccess(newFiles);
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message || 'Failed to upload files');
        } finally {
            setIsUploading(false);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveFile = async (fileId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/projects/${projectId}/files/${fileId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete file');

            setUploadedFiles(prev => prev.filter(f => f._id !== fileId));
        } catch (err) {
            console.error('Delete error:', err);
            setError('Failed to delete file');
        }
    };

    return (
        <div className="space-y-4">
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                    isDragging
                        ? 'border-forge-orange bg-forge-orange/10 scale-105'
                        : 'border-ash-gray hover:border-forge-orange hover:bg-iron-light'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                />

                <div className="flex flex-col items-center gap-4">
                    <svg className="w-12 h-12 text-forge-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>

                    {isUploading ? (
                        <div className="space-y-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-forge-orange mx-auto"></div>
                            <p className="text-silver font-semibold">Uploading files...</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-silver font-semibold">
                                Drag and drop files here, or click to browse
                            </p>
                            <p className="text-ash-gray text-sm">
                                Max file size: 50MB • Multiple files supported
                            </p>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-forge-red text-sm">
                    {error}
                </div>
            )}

            {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-silver font-semibold text-sm uppercase tracking-wide">Uploaded Files ({uploadedFiles.length})</h4>
                    <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                            <div
                                key={file._id || index}
                                className="flex items-center justify-between bg-iron-light p-3 rounded-lg border border-ash-gray/30"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <svg className="w-5 h-5 text-forge-orange flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="text-silver truncate">{file.name || file.filename}</span>
                                    <span className="text-ash-gray text-xs flex-shrink-0">
                                        {file.size ? `${(file.size / 1024).toFixed(1)} KB` : ''}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleRemoveFile(file._id)}
                                    className="ml-4 text-forge-red hover:text-red-600 transition-colors p-1"
                                    title="Remove file"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectFileUpload;
