// Dillon Koekemoer u23537052
import React, { useState } from 'react';

const Files = ({ projectId }) => {
    const [sortBy, setSortBy] = useState('name');
    const [filterType, setFilterType] = useState('all');

    const files = [];
    const fileTypes = ['all'];
    const processedFiles = [];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <h3 className="text-xl font-semibold text-forge-yellow">🗃️ Materials Vault</h3>
                    <span className="px-3 py-1 bg-iron-light text-forge-orange rounded-full text-sm font-medium border border-forge-orange/30">
                        0 files (0 KB)
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
                    <button className="px-4 py-2 rounded-lg text-white font-medium bg-gradient-fire shadow-forge transition-all duration-300 hover:shadow-forge-hover hover:-translate-y-1 hover:scale-105 active:scale-95 text-sm">
                        📤 Upload Materials
                    </button>
                    <button className="px-4 py-2 rounded-lg font-medium bg-transparent text-forge-orange border-2 border-forge-orange transition-all duration-300 hover:bg-forge-orange hover:text-white hover:-translate-y-0.5 text-sm">
                        📥 Download All
                    </button>
                </div>
            </div>

            <div className="bg-iron-light rounded-xl p-12 text-center">
                <div className="text-6xl mb-4">📂</div>
                <h4 className="text-xl font-semibold text-silver mb-2">No materials found</h4>
                <p className="text-ash-gray mb-6">No files have been uploaded yet.</p>
                <button className="px-8 py-4 rounded-xl text-white font-semibold bg-gradient-fire shadow-forge transition-all duration-300 hover:shadow-forge-hover hover:-translate-y-1 hover:scale-105 active:scale-95">
                    🚀 Add First Material
                </button>
            </div>
        </div>
    );
};

export default Files;