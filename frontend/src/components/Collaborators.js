// Dillon Koekemoer u23537052
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI, friendsAPI, usersAPI } from '../services/api';

const Collaborators = ({ projectId, currentUser, isOwner }) => {
    const navigate = useNavigate();
    const [collaborators, setCollaborators] = useState([]);
    const [friendStatuses, setFriendStatuses] = useState({});
    const [loading, setLoading] = useState(true);
    const [isCollaborator, setIsCollaborator] = useState(false);
    const [processingFriend, setProcessingFriend] = useState({});
    const [processingAction, setProcessingAction] = useState({});
    const [project, setProject] = useState(null);

    useEffect(() => {
        fetchCollaborators();
    }, [projectId, currentUser]);

    const fetchCollaborators = async () => {
        try {
            // Fetch project details to get owner info
            const projectResponse = await fetch(`http://localhost:3001/api/projects/${projectId}`);
            if (projectResponse.ok) {
                const projectData = await projectResponse.json();
                setProject(projectData);
            }

            const data = await projectsAPI.getCollaborators(projectId);
            setCollaborators(data);
            setIsCollaborator(data.some(collab => collab._id === currentUser?._id));

            // Fetch friend status for each collaborator
            if (currentUser) {
                const statuses = {};
                for (const collaborator of data) {
                    if (collaborator._id !== currentUser._id) {
                        statuses[collaborator._id] = await checkFriendStatus(collaborator._id);
                    }
                }
                setFriendStatuses(statuses);
            }
        } catch (error) {
            console.error('Failed to fetch collaborators:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkFriendStatus = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/users/friendship-status/${currentUser._id}/${userId}`);
            if (response.ok) {
                const data = await response.json();
                return data.status; 
            }
        } catch (error) {
            console.error('Error checking friend status:', error);
        }
        return 'none';
    };

    const handleSendFriendRequest = async (userId) => {
        setProcessingFriend(prev => ({ ...prev, [userId]: true }));
        try {
            const response = await fetch('http://localhost:3001/api/users/send-friend-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: currentUser._id,
                    friendId: userId
                })
            });

            if (response.ok) {
                setFriendStatuses(prev => ({ ...prev, [userId]: 'request_sent' }));
                alert('Friend request sent successfully!');
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Failed to send friend request');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
            alert('Failed to send friend request. Please try again.');
        } finally {
            setProcessingFriend(prev => ({ ...prev, [userId]: false }));
        }
    };

    const handleUnfriend = async (userId) => {
        if (!window.confirm('Are you sure you want to unfriend this user?')) return;

        setProcessingFriend(prev => ({ ...prev, [userId]: true }));
        try {
            await friendsAPI.removeFriend(currentUser._id, userId);
            setFriendStatuses(prev => ({ ...prev, [userId]: 'none' }));
            alert('User unfriended successfully');
        } catch (error) {
            console.error('Error unfriending user:', error);
            alert('Failed to unfriend user. Please try again.');
        } finally {
            setProcessingFriend(prev => ({ ...prev, [userId]: false }));
        }
    };

    const handleViewProfile = (userId) => {
        const friendStatus = friendStatuses[userId];
        if (friendStatus === 'friends') {
            navigate(`/profile/${userId}`);
        } else {
            alert('Add this user as a friend to view their full profile!');
        }
    };

    const handleJoinProject = async () => {
        try {
            await projectsAPI.joinProject(projectId);
            await fetchCollaborators();
        } catch (error) {
            console.error('Failed to join project:', error);
            alert('Failed to join project. Please try again.');
        }
    };

    const handleLeaveProject = async () => {
        if (window.confirm('Are you sure you want to leave this project?')) {
            try {
                await projectsAPI.leaveProject(projectId);
                await fetchCollaborators();
            } catch (error) {
                console.error('Failed to leave project:', error);
                alert('Failed to leave project. Please try again.');
            }
        }
    };

    const handleRemoveCollaborator = async (userId) => {
        if (!window.confirm('Are you sure you want to remove this collaborator from the project?')) return;

        setProcessingAction(prev => ({ ...prev, [userId]: 'removing' }));
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/projects/${projectId}/members/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to remove collaborator');
            }

            alert('Collaborator removed successfully');
            await fetchCollaborators();
        } catch (error) {
            console.error('Error removing collaborator:', error);
            alert(error.message || 'Failed to remove collaborator. Please try again.');
        } finally {
            setProcessingAction(prev => ({ ...prev, [userId]: null }));
        }
    };

    const handlePromoteToOwner = async (userId) => {
        if (!window.confirm('Are you sure you want to transfer ownership to this user? You will become a regular collaborator.')) return;

        setProcessingAction(prev => ({ ...prev, [userId]: 'promoting' }));
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/projects/${projectId}/transfer-ownership`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newOwnerId: userId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to transfer ownership');
            }

            alert('Ownership transferred successfully! This user is now the project owner.');
            await fetchCollaborators();
            window.location.reload(); 
        } catch (error) {
            console.error('Error transferring ownership:', error);
            alert(error.message || 'Failed to transfer ownership. Please try again.');
        } finally {
            setProcessingAction(prev => ({ ...prev, [userId]: null }));
        }
    };

    const getProfilePicture = (user) => {
        if (user.profilePicture) {
            if (user.profilePicture.startsWith('placeholder-')) {
                return (
                    <div
                        className="w-full h-full flex items-center justify-center text-lg font-bold text-white"
                        style={{ backgroundColor: `#${user.profilePicture.replace('placeholder-', '')}` }}
                    >
                        {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                    </div>
                );
            } else {
                return (
                    <img
                        src={user.profilePicture.startsWith('http') ? user.profilePicture : `http://localhost:3001${user.profilePicture}`}
                        alt={user.name}
                        className="w-full h-full object-cover"
                    />
                );
            }
        }
        return (
            <div className="w-full h-full bg-gradient-fire text-white flex items-center justify-center text-lg font-bold">
                {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
            </div>
        );
    };

    if (loading) {
        return <div className="text-ash-gray">Loading collaborators...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-forge-yellow">👥 Collaborators ({collaborators.length})</h3>
                {!isOwner && currentUser && (
                    <div>
                        {isCollaborator ? (
                            <button
                                onClick={handleLeaveProject}
                                className="px-6 py-3 bg-red-500/20 text-red-400 border-2 border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 font-semibold hover:-translate-y-0.5"
                            >
                                Leave Project
                            </button>
                        ) : (
                            <button
                                onClick={handleJoinProject}
                                className="px-6 py-3 bg-gradient-fire text-white border-2 border-forge-orange rounded-lg hover:shadow-forge-hover transition-all duration-300 font-semibold hover:-translate-y-0.5"
                            >
                                Join Project
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="grid gap-4">
                {collaborators.length === 0 ? (
                    <div className="text-center py-12 bg-iron-light rounded-xl border-2 border-ash-gray/20">
                        <div className="text-6xl mb-4">👤</div>
                        <p className="text-ash-gray text-lg">No collaborators yet</p>
                        <p className="text-steel-light text-sm mt-2">Join this project to collaborate!</p>
                    </div>
                ) : (
                    collaborators.map((collaborator) => {
                        const friendStatus = friendStatuses[collaborator._id] || 'none';
                        const isCurrentUser = collaborator._id === currentUser?._id;
                        const isFriend = friendStatus === 'friends';

                        return (
                            <div
                                key={collaborator._id}
                                className="bg-iron-light p-5 rounded-xl border-2 border-steel-blue/30 hover:border-forge-orange/50 transition-all duration-300"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Profile Picture */}
                                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-forge-orange flex-shrink-0">
                                        {getProfilePicture(collaborator)}
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-silver font-semibold text-lg truncate">
                                            {collaborator.name || 'Unknown User'}
                                        </h4>
                                        {/* Only show email if friends or current user */}
                                        {(isFriend || isCurrentUser) && (
                                            <p className="text-ash-gray text-sm truncate">{collaborator.email}</p>
                                        )}
                                        {!isFriend && !isCurrentUser && (
                                            <p className="text-steel-light text-xs italic">Add as friend to see more</p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    {!isCurrentUser && currentUser && (
                                        <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                                            {/* Owner Controls */}
                                            {isOwner && collaborator._id !== project?.userId && (
                                                <>
                                                    <button
                                                        onClick={() => handlePromoteToOwner(collaborator._id)}
                                                        disabled={processingAction[collaborator._id] === 'promoting'}
                                                        className="px-4 py-2 rounded-lg font-medium bg-forge-yellow/20 text-forge-yellow border border-forge-yellow/30 hover:bg-forge-yellow hover:text-iron-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                                        title="Transfer ownership to this user"
                                                    >
                                                        {processingAction[collaborator._id] === 'promoting' ? '⏳' : 'Make Owner'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveCollaborator(collaborator._id)}
                                                        disabled={processingAction[collaborator._id] === 'removing'}
                                                        className="px-4 py-2 rounded-lg font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                                        title="Remove from project"
                                                    >
                                                        {processingAction[collaborator._id] === 'removing' ? '⏳' : ' Remove'}
                                                    </button>
                                                </>
                                            )}

                                            {/* View Profile Button */}
                                            {!isOwner && (
                                                <button
                                                    onClick={() => handleViewProfile(collaborator._id)}
                                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                                                        isFriend
                                                            ? 'bg-forge-orange/20 text-forge-orange border border-forge-orange/30 hover:bg-forge-orange hover:text-white'
                                                            : 'bg-steel-blue/20 text-steel-light border border-steel-blue/30 hover:bg-steel-blue hover:text-white'
                                                    }`}
                                                >
                                                    {isFriend ? ' View Profile' : ' View'}
                                                </button>
                                            )}

                                            {/* Friend Action Button - Only show if not owner viewing collaborator */}
                                            {!isOwner && friendStatus === 'none' && (
                                                <button
                                                    onClick={() => handleSendFriendRequest(collaborator._id)}
                                                    disabled={processingFriend[collaborator._id]}
                                                    className="px-4 py-2 rounded-lg font-medium bg-gradient-fire text-white border border-forge-orange transition-all duration-300 hover:shadow-forge-hover disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                                >
                                                    {processingFriend[collaborator._id] ? '⏳' : ' Add Friend'}
                                                </button>
                                            )}

                                            {!isOwner && friendStatus === 'request_sent' && (
                                                <button
                                                    disabled
                                                    className="px-4 py-2 rounded-lg font-medium bg-ash-gray/20 text-ash-gray border border-ash-gray/30 cursor-not-allowed text-sm"
                                                >
                                                     Request Sent
                                                </button>
                                            )}

                                            {!isOwner && friendStatus === 'request_received' && (
                                                <button
                                                    onClick={() => navigate('/home')}
                                                    className="px-4 py-2 rounded-lg font-medium bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500 hover:text-white transition-all duration-300 text-sm"
                                                >
                                                    Accept Request
                                                </button>
                                            )}

                                            {!isOwner && friendStatus === 'friends' && (
                                                <button
                                                    onClick={() => handleUnfriend(collaborator._id)}
                                                    disabled={processingFriend[collaborator._id]}
                                                    className="px-4 py-2 rounded-lg font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                                >
                                                    {processingFriend[collaborator._id] ? '⏳' : 'X Unfriend'}
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Current User Badge */}
                                    {isCurrentUser && (
                                        <div className="px-4 py-2 rounded-lg bg-forge-yellow/20 text-forge-yellow border border-forge-yellow/30 font-semibold text-sm">
                                            You
                                        </div>
                                    )}

                                    {/* Owner Badge */}
                                    {collaborator._id === project?.userId && (
                                        <div className="px-4 py-2 rounded-lg bg-forge-orange/20 text-forge-orange border border-forge-orange/30 font-semibold text-sm flex items-center gap-1">
                                            👑 Owner
                                        </div>
                                    )}
                                </div>

                                {/* Extended Info for Friends */}
                                {isFriend && collaborator.bio && (
                                    <div className="mt-3 pt-3 border-t border-steel-blue/30">
                                        <p className="text-ash-gray text-sm italic">"{collaborator.bio}"</p>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Collaborators;
