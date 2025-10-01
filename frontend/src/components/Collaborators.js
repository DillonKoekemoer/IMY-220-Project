// Dillon Koekemoer u23537052
import React, { useState, useEffect } from 'react';
import { projectsAPI } from '../services/api';

const Collaborators = ({ projectId, currentUser, isOwner }) => {
    const [collaborators, setCollaborators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCollaborator, setIsCollaborator] = useState(false);

    useEffect(() => {
        fetchCollaborators();
    }, [projectId]);

    const fetchCollaborators = async () => {
        try {
            const data = await projectsAPI.getCollaborators(projectId);
            setCollaborators(data);
            setIsCollaborator(data.some(collab => collab._id === currentUser?._id));
        } catch (error) {
            console.error('Failed to fetch collaborators:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinProject = async () => {
        try {
            await projectsAPI.joinProject(projectId);
            fetchCollaborators();
        } catch (error) {
            console.error('Failed to join project:', error);
        }
    };

    const handleLeaveProject = async () => {
        if (window.confirm('Are you sure you want to leave this project?')) {
            try {
                await projectsAPI.leaveProject(projectId);
                fetchCollaborators();
            } catch (error) {
                console.error('Failed to leave project:', error);
            }
        }
    };

    if (loading) {
        return <div className="text-ash-gray">Loading collaborators...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-forge-yellow">Collaborators ({collaborators.length})</h3>
                {!isOwner && currentUser && (
                    <div>
                        {isCollaborator ? (
                            <button
                                onClick={handleLeaveProject}
                                className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300"
                            >
                                Leave Project
                            </button>
                        ) : (
                            <button
                                onClick={handleJoinProject}
                                className="px-4 py-2 bg-forge-orange/20 text-forge-orange border border-forge-orange/30 rounded-lg hover:bg-forge-orange hover:text-white transition-all duration-300"
                            >
                                Join Project
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="grid gap-4">
                {collaborators.length === 0 ? (
                    <p className="text-ash-gray text-center py-8">No collaborators yet</p>
                ) : (
                    collaborators.map((collaborator) => (
                        <div key={collaborator._id} className="bg-iron-light p-4 rounded-lg border border-steel-blue/30 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-fire text-white flex items-center justify-center font-semibold">
                                {collaborator.name ? collaborator.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-silver font-semibold">{collaborator.name}</h4>
                                <p className="text-ash-gray text-sm">{collaborator.email}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Collaborators;