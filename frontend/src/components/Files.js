// Dillon Koekemoer u23537052
import React, { useState, useEffect, useRef } from 'react';
import { projectsAPI } from '../services/api';

const Files = ({ projectId }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [sortBy, setSortBy] = useState('name');
    const [filterType, setFilterType] = useState('all');
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchProject();
    }, [projectId]);

    const fetchProject = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/projects/${projectId}`);
            if (!response.ok) throw new Error('Failed to fetch project');
            const data = await response.json();
            setFiles(data.files || []);
        } catch (error) {
            console.error('Error fetching project:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length === 0) return;

        setUploading(true);
        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('projectFiles', file);
        });

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                alert('You must be logged in to upload files.');
                setUploading(false);
                return;
            }

            const response = await fetch(`http://localhost:3001/api/projects/${projectId}/files`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
                console.error('Upload error:', errorData);

                if (response.status === 401) {
                    alert('Your session has expired. Please log in again.');
                } else if (response.status === 403) {
                    alert('You do not have permission to upload files to this project.');
                } else {
                    alert(`Failed to upload files: ${errorData.error || 'Unknown error'}`);
                }
                return;
            }

            const data = await response.json();
            console.log('Upload success:', data);
            alert('Files uploaded successfully!');

            // Refresh the project to get updated files
            await fetchProject();
        } catch (error) {
            console.error('Error uploading files:', error);
            alert(`Failed to upload files: ${error.message}`);
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDeleteFile = async (filename) => {
        if (!window.confirm('Are you sure you want to delete this file?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/projects/${projectId}/files/${filename}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to delete file');

            // Refresh the project to get updated files
            await fetchProject();
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('Failed to delete file. Please try again.');
        }
    };

    const handleDownloadFile = (file) => {
        const link = document.createElement('a');
        link.href = `http://localhost:3001${file.path}`;
        link.download = file.originalName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadAll = () => {
        files.forEach(file => {
            setTimeout(() => handleDownloadFile(file), 100);
        });
    };

    const getFileIcon = (mimetype) => {
        if (mimetype?.startsWith('image/')) return '🖼️';
        if (mimetype?.startsWith('text/')) return '📄';
        if (mimetype?.includes('pdf')) return '📕';
        if (mimetype?.includes('zip')) return '📦';
        if (mimetype?.includes('javascript') || mimetype?.includes('json')) return '📜';
        return '📎';
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const getTotalSize = () => {
        return files.reduce((total, file) => total + (file.size || 0), 0);
    };

    const getFileExtension = (filename) => {
        return filename?.split('.').pop()?.toUpperCase() || 'FILE';
    };

    const fileTypes = ['all', ...new Set(files.map(f => getFileExtension(f.originalName)))];

    const processedFiles = files
        .filter(file => filterType === 'all' || getFileExtension(file.originalName) === filterType)
        .sort((a, b) => {
            if (sortBy === 'name') return (a.originalName || '').localeCompare(b.originalName || '');
            if (sortBy === 'size') return (b.size || 0) - (a.size || 0);
            if (sortBy === 'type') return getFileExtension(a.originalName).localeCompare(getFileExtension(b.originalName));
            if (sortBy === 'date') return new Date(b.uploadedAt) - new Date(a.uploadedAt);
            return 0;
        });

    if (loading) {
        return <div className="text-center text-ash-gray py-8">Loading files...</div>;
    }

    return (
        <div>
            <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                accept="*/*"
            />

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <h3 className="text-xl font-semibold text-forge-yellow">🗃️ Materials Vault</h3>
                    <span className="px-3 py-1 bg-iron-light text-forge-orange rounded-full text-sm font-medium border border-forge-orange/30">
                        {files.length} {files.length === 1 ? 'file' : 'files'} ({formatFileSize(getTotalSize())})
                    </span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <label htmlFor="sortBy" className="text-sm font-medium text-silver">Sort by:</label>
                        <select
                            id="sortBy"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 border border-ash-gray rounded-lg text-sm bg-iron-light text-silver min-h-[36px] cursor-pointer focus:border-forge-orange focus:outline-none focus:ring-2 focus:ring-forge-orange/20"
                        >
                            <option value="name">Name</option>
                            <option value="size">Size</option>
                            <option value="type">Type</option>
                            <option value="date">Last Modified</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label htmlFor="filterType" className="text-sm font-medium text-silver">Filter:</label>
                        <select
                            id="filterType"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-3 py-2 border border-ash-gray rounded-lg text-sm bg-iron-light text-silver min-h-[36px] cursor-pointer focus:border-forge-orange focus:outline-none focus:ring-2 focus:ring-forge-orange/20"
                        >
                            {fileTypes.map(type => (
                                <option key={type} value={type}>
                                    {type === 'all' ? 'All Types' : type}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-4 py-2 rounded-lg text-white font-medium bg-gradient-fire shadow-forge transition-all duration-300 hover:shadow-forge-hover hover:-translate-y-1 hover:scale-105 active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? '⏳ Uploading...' : '📤 Upload Materials'}
                    </button>
                    {files.length > 0 && (
                        <button
                            onClick={handleDownloadAll}
                            className="px-4 py-2 rounded-lg font-medium bg-transparent text-forge-orange border-2 border-forge-orange transition-all duration-300 hover:bg-forge-orange hover:text-white hover:-translate-y-0.5 text-sm"
                        >
                            📥 Download All
                        </button>
                    )}
                </div>
            </div>

            {processedFiles.length === 0 ? (
                <div className="bg-iron-light rounded-xl p-12 text-center">
                    <div className="text-6xl mb-4">📂</div>
                    <h4 className="text-xl font-semibold text-silver mb-2">No materials found</h4>
                    <p className="text-ash-gray mb-6">
                        {files.length === 0
                            ? 'No files have been uploaded yet.'
                            : 'No files match the current filter.'}
                    </p>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-8 py-4 rounded-xl text-white font-semibold bg-gradient-fire shadow-forge transition-all duration-300 hover:shadow-forge-hover hover:-translate-y-1 hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        🚀 Add First Material
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {processedFiles.map((file, index) => (
                        <div
                            key={file.filename || index}
                            className="bg-iron-light rounded-xl p-4 flex items-center justify-between hover:bg-iron-gray transition-colors duration-200 border border-transparent hover:border-forge-orange/30"
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="text-3xl flex-shrink-0">
                                    {getFileIcon(file.mimetype)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-silver font-medium truncate">{file.originalName}</h4>
                                    <div className="flex items-center gap-3 text-xs text-ash-gray mt-1">
                                        <span>{formatFileSize(file.size)}</span>
                                        <span>•</span>
                                        <span>{getFileExtension(file.originalName)}</span>
                                        <span>•</span>
                                        <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={() => handleDownloadFile(file)}
                                    className="px-4 py-2 rounded-lg font-medium bg-transparent text-forge-orange border border-forge-orange transition-all duration-300 hover:bg-forge-orange hover:text-white text-sm"
                                >
                                    📥 Download
                                </button>
                                <button
                                    onClick={() => handleDeleteFile(file.filename)}
                                    className="px-4 py-2 rounded-lg font-medium bg-transparent text-red-400 border border-red-400 transition-all duration-300 hover:bg-red-500 hover:text-white text-sm"
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Files;
