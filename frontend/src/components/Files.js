// Dillon Koekemoer u23537052
import React, { useState } from 'react';

const Files = ({ projectId }) => {
    const [sortBy, setSortBy] = useState('name');
    const [filterType, setFilterType] = useState('all');

    const files = [];
    const fileTypes = ['all'];
    const processedFiles = [];

    return (
        <div className="card">
            <div className="files-header">
                <h3>Materials Vault</h3>
                <div className="files-stats">
                    <span className="stat-badge">
                        0 files (0 KB)
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
                <div className="no-files">
                    <div className="no-files-icon">📂</div>
                    <h4>No materials found</h4>
                    <p>No files have been uploaded yet.</p>
                    <button className="btn btn-primary">
                        Add First Material
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Files;