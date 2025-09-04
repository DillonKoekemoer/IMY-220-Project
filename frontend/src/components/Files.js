import React, { useState } from 'react';

const Files = ({ projectId }) => {
    const [sortBy, setSortBy] = useState('name');
    const [filterType, setFilterType] = useState('all');

    const dummyFiles = [
        { id: 1, name: "main.js", size: "2.4 KB", type: "JavaScript", lastModified: "2025-09-01", icon: "📄" },
        { id: 2, name: "style.css", size: "1.8 KB", type: "CSS", lastModified: "2025-09-02", icon: "🎨" },
        { id: 3, name: "README.md", size: "0.9 KB", type: "Markdown", lastModified: "2025-08-30", icon: "📝" },
        { id: 4, name: "package.json", size: "1.2 KB", type: "JSON", lastModified: "2025-08-28", icon: "📦" },
        { id: 5, name: "index.html", size: "3.1 KB", type: "HTML", lastModified: "2025-09-01", icon: "🌐" },
        { id: 6, name: "app.py", size: "4.7 KB", type: "Python", lastModified: "2025-08-29", icon: "🐍" },
        { id: 7, name: "config.yaml", size: "0.6 KB", type: "YAML", lastModified: "2025-08-27", icon: "⚙️" },
        { id: 8, name: "blueprint.png", size: "156 KB", type: "Image", lastModified: "2025-08-25", icon: "🖼️" }
    ];

    // Get unique file types for filter
    const fileTypes = ['all', ...new Set(dummyFiles.map(file => file.type))];

    // Filter and sort files
    const processedFiles = dummyFiles
        .filter(file => filterType === 'all' || file.type === filterType)
        .sort((a, b) => {
            switch(sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'size':
                    return parseFloat(a.size) - parseFloat(b.size);
                case 'type':
                    return a.type.localeCompare(b.type);
                case 'date':
                    return new Date(b.lastModified) - new Date(a.lastModified);
                default:
                    return 0;
            }
        });

    const handleDownload = (file) => {
        console.log(`Downloading ${file.name}...`);
        // In a real app, this would trigger the actual download
    };

    const handleView = (file) => {
        console.log(`Viewing ${file.name}...`);
        // In a real app, this would open file viewer/editor
    };

    const getTotalSize = () => {
        const totalKB = dummyFiles.reduce((sum, file) => {
            const sizeStr = file.size.replace(/[^\d.]/g, '');
            const size = parseFloat(sizeStr);
            const unit = file.size.includes('MB') ? 1024 : 1;
            return sum + (size * unit);
        }, 0);
        
        return totalKB > 1024 ? `${(totalKB / 1024).toFixed(1)} MB` : `${totalKB.toFixed(1)} KB`;
    };

    return (
        <div className="card">
            <div className="files-header">
                <h3>Materials Vault</h3>
                <div className="files-stats">
                    <span className="stat-badge">
                        {processedFiles.length} files ({getTotalSize()})
                    </span>
                </div>
            </div>

            <div className="files-controls">
                <div className="files-filters">
                    <div className="filter-group">
                        <label htmlFor="sortBy" className="filter-label">Sort by:</label>
                        <select
                            id="sortBy"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="filter-select"
                        >
                            <option value="name">Name</option>
                            <option value="size">Size</option>
                            <option value="type">Type</option>
                            <option value="date">Last Modified</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="filterType" className="filter-label">Filter:</label>
                        <select
                            id="filterType"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="filter-select"
                        >
                            {fileTypes.map(type => (
                                <option key={type} value={type}>
                                    {type === 'all' ? 'All Types' : type}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="files-actions">
                    <button className="btn btn-sm btn-primary">
                        📤 Upload Materials
                    </button>
                    <button className="btn btn-sm btn-secondary">
                        📥 Download All
                    </button>
                </div>
            </div>

            <div className="files-container">
                {processedFiles.length > 0 ? (
                    <div className="files-list">
                        {processedFiles.map(file => (
                            <div key={file.id} className="file-item">
                                <div className="file-info">
                                    <div className="file-icon-name">
                                        <span className="file-icon">{file.icon}</span>
                                        <div className="file-details">
                                            <span className="file-name">{file.name}</span>
                                            <span className="file-meta">
                                                {file.type} • {file.size} • Modified {file.lastModified}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="file-actions">
                                    <button
                                        className="btn btn-xs btn-outline"
                                        onClick={() => handleView(file)}
                                        title="View file"
                                    >
                                        👁️
                                    </button>
                                    <button
                                        className="btn btn-xs btn-primary"
                                        onClick={() => handleDownload(file)}
                                        title="Download file"
                                    >
                                        ⬇️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-files">
                        <div className="no-files-icon">📂</div>
                        <h4>No materials found</h4>
                        <p>No files match your current filter criteria.</p>
                        <button className="btn btn-primary">
                            Add First Material
                        </button>
                    </div>
                )}
            </div>

            {processedFiles.length > 0 && (
                <div className="files-footer">
                    <div className="files-summary">
                        Showing {processedFiles.length} of {dummyFiles.length} materials
                        {filterType !== 'all' && ` (filtered by ${filterType})`}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Files;