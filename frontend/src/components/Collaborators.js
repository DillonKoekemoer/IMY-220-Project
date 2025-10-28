// Dillon Koekemoer u23537052
import React, { useState, useEffect } from 'react';
import { projectsAPI } from '../services/api';

const Collaborators = ({ projectId, currentUser, isOwner }) => {
    const [collaborators, setCollaborators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCollaborator, setIsCollaborator] = useState(false);
    const [showTransferConfirm, setShowTransferConfirm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

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

    const handleRemoveMember = async (userId) => {
        if (window.confirm('Are you sure you want to remove this member?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3001/api/projects/${projectId}/members/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error('Failed to remove member');

                fetchCollaborators();
            } catch (error) {
                console.error('Failed to remove member:', error);
                alert('Failed to remove member');
            }
        }
    };

    const handleTransferOwnership = async () => {
        if (!selectedUser) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/projects/${projectId}/transfer-ownership`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ newOwnerId: selectedUser._id })
            });

            if (!response.ok) throw new Error('Failed to transfer ownership');

            alert('Ownership transferred successfully! You are no longer the owner.');
            window.location.reload(); // Reload to update permissions
        } catch (error) {
            console.error('Failed to transfer ownership:', error);
            alert('Failed to transfer ownership');
        } finally {
            setShowTransferConfirm(false);
            setSelectedUser(null);
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
                            {isOwner && collaborator._id !== currentUser?._id && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedUser(collaborator);
                                            setShowTransferConfirm(true);
                                        }}
                                        className="px-3 py-2 text-xs font-semibold bg-forge-yellow/20 text-forge-yellow border border-forge-yellow/30 rounded-lg hover:bg-forge-yellow hover:text-steel-dark transition-all duration-300"
                                        title="Transfer ownership"
                                    >
                                        👑 Make Owner
                                    </button>
                                    <button
                                        onClick={() => handleRemoveMember(collaborator._id)}
                                        className="px-3 py-2 text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300"
                                        title="Remove from project"
                                    >
                                        ✕ Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Transfer Ownership Confirmation Modal */}
            {showTransferConfirm && selectedUser && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-lg p-4">
                    <div className="bg-iron-gray text-silver rounded-xl p-8 max-w-md w-full shadow-forge-hover border-2 border-forge-yellow">
                        <h3 className="text-xl font-semibold text-forge-yellow mb-4">Transfer Project Ownership</h3>
                        <p className="text-ash-gray mb-6">
                            Are you sure you want to transfer ownership of this project to <span className="text-forge-orange font-semibold">{selectedUser.name}</span>?
                        </p>
                        <p className="text-red-400 text-sm mb-6">
                            ⚠️ You will lose all owner privileges and will not be able to undo this action.
                        </p>
                        <div className="flex gap-4">
                            <button
                                className="flex-1 px-6 py-3 rounded-xl font-semibold bg-forge-yellow text-steel-dark transition-all duration-300 hover:bg-forge-orange hover:-translate-y-0.5"
                                onClick={handleTransferOwnership}
                            >
                                Confirm Transfer
                            </button>
                            <button
                                className="flex-1 px-6 py-3 rounded-xl font-semibold bg-transparent text-ash-gray border border-ash-gray transition-all duration-300 hover:bg-iron-light hover:text-silver"
                                onClick={() => {
                                    setShowTransferConfirm(false);
                                    setSelectedUser(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Collaborators;