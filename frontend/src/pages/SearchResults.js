// Dillon Koekemoer u23537052
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const SearchResults = ({ currentUser }) => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState({ users: [], projects: [], hashtags: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const performSearch = async () => {
            if (!query.trim()) {
                setResults({ users: [], projects: [], hashtags: [] });
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:3001/api/search?q=${encodeURIComponent(query)}&type=all`
                );
                if (response.ok) {
                    const data = await response.json();
                    setResults(data);
                }
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [query]);

    const totalResults = results.users.length + results.projects.length + results.hashtags.length;

    const UserResult = ({ user }) => (
        <Link
            to={`/profile/${user._id}`}
            className="block p-4 bg-iron-light rounded-lg border-2 border-ash-gray hover:border-forge-orange hover:shadow-forge transition-all duration-300 hover:-translate-y-1"
        >
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-forge-yellow flex-shrink-0">
                    {user.profilePicture ? (
                        user.profilePicture.startsWith('placeholder-') ? (
                            <div
                                className="w-full h-full flex items-center justify-center text-xl font-bold text-white"
                                style={{ backgroundColor: `#${user.profilePicture.replace('placeholder-', '')}` }}
                            >
                                {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                            </div>
                        ) : (
                            <img
                                src={user.profilePicture.startsWith('http') ? user.profilePicture : `http://localhost:3001${user.profilePicture}`}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        )
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-forge-orange via-forge-red to-forge-yellow text-white flex items-center justify-center font-semibold text-xl">
                            {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-silver font-semibold text-lg mb-1 truncate">{user.name}</h3>
                    <p className="text-ash-gray text-sm truncate">{user.email}</p>
                    {user.bio && (
                        <p className="text-ash-gray text-sm mt-2 line-clamp-2">{user.bio}</p>
                    )}
                </div>
                <div className="text-forge-orange text-2xl">👤</div>
            </div>
        </Link>
    );

    const ProjectResult = ({ project }) => (
        <Link
            to={`/project/${project._id}`}
            className="block p-4 bg-iron-light rounded-lg border-2 border-ash-gray hover:border-forge-orange hover:shadow-forge transition-all duration-300 hover:-translate-y-1"
        >
            <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-forge-yellow flex-shrink-0">
                    {project.projectImage ? (
                        <img
                            src={project.projectImage.startsWith('http') ? project.projectImage : `http://localhost:3001${project.projectImage}`}
                            alt={project.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-forge-orange to-forge-red flex items-center justify-center text-white text-2xl font-bold">
                            {project.name ? project.name[0].toUpperCase() : '📁'}
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-silver font-semibold text-lg mb-1 truncate">{project.name}</h3>
                    {project.description && (
                        <p className="text-ash-gray text-sm line-clamp-2 mb-2">{project.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                        {project.languages && project.languages.map((lang, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-1 bg-forge-orange/20 text-forge-orange text-xs rounded border border-forge-orange/30"
                            >
                                {lang}
                            </span>
                        ))}
                        {project.hashtags && project.hashtags.slice(0, 3).map((tag, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-1 bg-forge-yellow/20 text-forge-yellow text-xs rounded border border-forge-yellow/30"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="text-forge-orange text-2xl">📁</div>
            </div>
        </Link>
    );

    const renderResults = () => {
        if (loading) {
            return (
                <div className="text-center py-12">
                    <div className="text-4xl mb-4 animate-pulse">🔍</div>
                    <p className="text-ash-gray">Searching...</p>
                </div>
            );
        }

        if (totalResults === 0) {
            return (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl text-silver mb-2">No results found</h3>
                    <p className="text-ash-gray">
                        Try different keywords or check your spelling
                    </p>
                </div>
            );
        }

        const showUsers = activeTab === 'all' || activeTab === 'users';
        const showProjects = activeTab === 'all' || activeTab === 'projects';
        const showHashtags = activeTab === 'all' || activeTab === 'hashtags';

        return (
            <div className="space-y-8">
                {showUsers && results.users.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold text-forge-yellow mb-4 flex items-center gap-2">
                            👥 Users ({results.users.length})
                        </h2>
                        <div className="grid gap-4">
                            {results.users.map(user => (
                                <UserResult key={user._id} user={user} />
                            ))}
                        </div>
                    </div>
                )}

                {showProjects && results.projects.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold text-forge-yellow mb-4 flex items-center gap-2">
                            📁 Projects ({results.projects.length})
                        </h2>
                        <div className="grid gap-4">
                            {results.projects.map(project => (
                                <ProjectResult key={project._id} project={project} />
                            ))}
                        </div>
                    </div>
                )}

                {showHashtags && results.hashtags.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold text-forge-yellow mb-4 flex items-center gap-2">
                            #️⃣ Hashtag Results ({results.hashtags.length})
                        </h2>
                        <div className="grid gap-4">
                            {results.hashtags.map(project => (
                                <ProjectResult key={project._id} project={project} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <main className="max-w-6xl mx-auto px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-forge-yellow mb-2">
                    Search Results
                </h1>
                <p className="text-ash-gray">
                    Showing results for: <span className="text-silver font-semibold">"{query}"</span>
                </p>
                <p className="text-ash-gray text-sm mt-1">
                    {totalResults} result{totalResults !== 1 ? 's' : ''} found
                </p>
            </div>

            <div className="flex gap-2 mb-6 bg-iron-light p-1 rounded-lg border border-ash-gray inline-flex">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-lg border-none bg-transparent cursor-pointer text-sm font-medium transition-all duration-300 ${
                        activeTab === 'all'
                            ? 'bg-gradient-fire text-white shadow-forge'
                            : 'text-ash-gray hover:bg-iron-dark hover:text-forge-orange'
                    }`}
                >
                    All ({totalResults})
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 rounded-lg border-none bg-transparent cursor-pointer text-sm font-medium transition-all duration-300 ${
                        activeTab === 'users'
                            ? 'bg-gradient-fire text-white shadow-forge'
                            : 'text-ash-gray hover:bg-iron-dark hover:text-forge-orange'
                    }`}
                >
                    Users ({results.users.length})
                </button>
                <button
                    onClick={() => setActiveTab('projects')}
                    className={`px-4 py-2 rounded-lg border-none bg-transparent cursor-pointer text-sm font-medium transition-all duration-300 ${
                        activeTab === 'projects'
                            ? 'bg-gradient-fire text-white shadow-forge'
                            : 'text-ash-gray hover:bg-iron-dark hover:text-forge-orange'
                    }`}
                >
                    Projects ({results.projects.length})
                </button>
                {results.hashtags.length > 0 && (
                    <button
                        onClick={() => setActiveTab('hashtags')}
                        className={`px-4 py-2 rounded-lg border-none bg-transparent cursor-pointer text-sm font-medium transition-all duration-300 ${
                            activeTab === 'hashtags'
                                ? 'bg-gradient-fire text-white shadow-forge'
                                : 'text-ash-gray hover:bg-iron-dark hover:text-forge-orange'
                        }`}
                    >
                        Hashtags ({results.hashtags.length})
                    </button>
                )}
            </div>

            <div className="bg-gradient-steel rounded-xl p-8 shadow-forge border-2 border-forge-orange">
                {renderResults()}
            </div>
        </main>
    );
};

export default SearchResults;
