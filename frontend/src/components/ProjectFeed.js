// Dillon Koekemoer u23537052
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectPreview from './ProjectPreview';
import { projectFeedAPI, usersAPI } from '../services/api';

const ProjectFeed = ({ type, currentUser, searchTerm, sortBy, selectedLanguage }) => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState({});

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                let data;
                
                if (type === 'global') {
                    data = await projectFeedAPI.getGlobal();
                } else {
                    data = await projectFeedAPI.getLocal(currentUser._id);
                }
                
                // Fetch user data for projects
                const userIds = [...new Set(data.map(project => project.userId).filter(Boolean))];
                const userMap = {};
                
                if (userIds.length > 0) {
                    try {
                        const userPromises = userIds.map(id => usersAPI.getById(id).catch(() => null));
                        const userData = await Promise.all(userPromises);
                        
                        userData.forEach(user => {
                            if (user) userMap[user._id] = user;
                        });
                    } catch (userError) {
                        console.warn('Failed to fetch some user data:', userError);
                    }
                }
                
                setUsers(userMap);
                setProjects(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchProjects();
        }
    }, [type, currentUser]);

    if (loading) {
        return (
            <section>
                <div className="bg-iron-light text-silver rounded-xl shadow-forge p-8 border-2 border-steel-blue text-center">
                    <h3 className="text-xl font-semibold text-forge-yellow">Loading projects...</h3>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section>
                <div className="bg-iron-light text-silver rounded-xl shadow-forge p-8 border-2 border-steel-blue text-center">
                    <h3 className="text-xl font-semibold text-forge-red">Error loading projects</h3>
                    <p className="text-ash-gray">{error}</p>
                </div>
            </section>
        );
    }

    let filteredProjects = projects;

    if (searchTerm) {
        filteredProjects = filteredProjects.filter(project =>
            (project.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (project.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (project.languages || []).some(lang => lang.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }

    if (selectedLanguage && selectedLanguage !== 'all') {
        filteredProjects = filteredProjects.filter(project =>
            project.languages && project.languages.includes(selectedLanguage)
        );
    }

    const handleProjectClick = (project) => {
        navigate(`/project/${project._id}`);
    };

    return (
        <section>
            {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map(project => (
                        <div key={project._id} onClick={() => handleProjectClick(project)} className="cursor-pointer">
                            <ProjectPreview 
                                project={project} 
                                author={users[project.userId]} 
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-iron-light text-silver rounded-xl shadow-forge p-8 border-2 border-steel-blue text-center">

                    <h3 className="text-xl font-semibold mb-2 text-forge-yellow">No projects found</h3>
                    <p className="text-ash-gray">{type === 'global' ? 'No projects available yet!' : 'Follow some friends to see their projects!'}</p>
                </div>
            )}
        </section>
    );
};

export default ProjectFeed;