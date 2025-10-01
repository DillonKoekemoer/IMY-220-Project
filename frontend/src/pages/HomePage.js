// Dillon Koekemoer u23537052
import React, { useState } from 'react';
import ProjectFeed from '../components/ProjectFeed';
import ActivitySidebar from '../components/ActivitySidebar';
import SearchInput from '../components/SearchInput';
import '../styles/homepage.css';

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
        <main className="container">
            <div className="homepage-layout">
                <div className="main-feed">
                    <div className="feed-header">
                        <h1>Project Feed</h1>
                        <SearchInput 
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search projects..."
                        />
                    </div>
                    <div className="feed-controls">
                        <div className="feed-toggle">
                            <button 
                                className={feedType === 'local' ? 'active' : ''}
                                onClick={() => setFeedType('local')}
                            >
                                My Feed
                            </button>
                            <button 
                                className={feedType === 'global' ? 'active' : ''}
                                onClick={() => setFeedType('global')}
                            >
                                Global Feed
                            </button>
                        </div>
                        <div className="feed-filters">
                            <div className="sort-control">
                                <label htmlFor="sort-select">Sort by: </label>
                                <select
                                    id="sort-select"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="name">Name</option>
                                    <option value="version">Version</option>
                                    <option value="status">Status</option>
                                </select>
                            </div>
                            <div className="language-filter">
                                <label htmlFor="language-select">Filter by Language: </label>
                                <select
                                    id="language-select"
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
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