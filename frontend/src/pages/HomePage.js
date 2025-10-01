// Dillon Koekemoer u23537052
import React, { useState } from 'react';
import ProjectFeed from '../components/ProjectFeed';
import ActivitySidebar from '../components/ActivitySidebar';
import SearchInput from '../components/SearchInput';


const HomePage = ({ currentUser }) => {
    const [feedType, setFeedType] = useState('local');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name'); 
    const [selectedLanguage, setSelectedLanguage] = useState('all'); 

    const availableLanguages = [
        'all',
        'JavaScript',
        'React',
        'CSS',
        'Python',
        'Pandas',
        'NumPy',
        'Node.js',
        'Express',
        'HTML'
    ];

    return (
        <main className="max-w-6xl mx-auto px-8 py-5">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
                <div className="bg-gradient-steel text-silver rounded-xl p-8 shadow-forge border-2 border-forge-orange">
                    <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                        <h1 className="text-2xl text-forge-yellow mb-4 font-display font-semibold">Project Feed</h1>
                        <SearchInput 
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search projects..."
                        />
                    </div>
                    <div className="flex justify-between items-center mb-8 flex-wrap gap-6">
                        <div className="flex gap-2 bg-iron-light p-1 rounded-lg border border-ash-gray">
                            <button 
                                className={`px-4 py-2 rounded-lg border-none bg-transparent cursor-pointer text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                                    feedType === 'local' 
                                        ? 'bg-gradient-fire text-white shadow-forge transform -translate-y-1' 
                                        : 'text-ash-gray hover:bg-iron-light hover:text-forge-orange'
                                }`}
                                onClick={() => setFeedType('local')}
                            >
                                My Feed
                            </button>
                            <button 
                                className={`px-4 py-2 rounded-lg border-none bg-transparent cursor-pointer text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                                    feedType === 'global' 
                                        ? 'bg-gradient-fire text-white shadow-forge transform -translate-y-1' 
                                        : 'text-ash-gray hover:bg-iron-light hover:text-forge-orange'
                                }`}
                                onClick={() => setFeedType('global')}
                            >
                                Global Feed
                            </button>
                        </div>
                        <div className="flex gap-6 flex-wrap">
                            <div className="flex items-center gap-2">
                                <label htmlFor="sort-select" className="text-sm font-medium text-silver">Sort by:</label>
                                <select
                                    id="sort-select"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2 border border-ash-gray rounded-lg text-sm bg-iron-light text-silver min-h-[36px] cursor-pointer focus:border-forge-orange focus:outline-none focus:ring-2 focus:ring-forge-orange/20"
                                >
                                    <option value="name">Name</option>
                                    <option value="version">Version</option>
                                    <option value="status">Status</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <label htmlFor="language-select" className="text-sm font-medium text-silver">Filter by Language:</label>
                                <select
                                    id="language-select"
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                    className="px-4 py-2 border border-ash-gray rounded-lg text-sm bg-iron-light text-silver min-h-[36px] cursor-pointer focus:border-forge-orange focus:outline-none focus:ring-2 focus:ring-forge-orange/20"
                                >
                                    {availableLanguages.map((language) => (
                                        <option key={language} value={language}>
                                            {language === 'all' ? 'All Languages' : language}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <ProjectFeed 
                        type={feedType} 
                        currentUser={currentUser} 
                        searchTerm={searchTerm}
                        sortBy={sortBy}
                        selectedLanguage={selectedLanguage}
                    />
                </div>
                <ActivitySidebar 
                    type={feedType}
                    currentUser={currentUser}
                />
            </div>
        </main>
    );
};

export default HomePage;