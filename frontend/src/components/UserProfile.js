// Dillon Koekemoer u23537052
import React, { useState, useEffect } from 'react';
import { friendsAPI, usersAPI } from '../services/api';

const UserProfile = ({ userId, currentUser, isOwnProfile }) => {
    const [profileData, setProfileData] = useState(null);
    const [friendshipStatus, setFriendshipStatus] = useState('none');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;
            
            try {
                setLoading(true);
                const userData = await usersAPI.getById(userId);
                setProfileData({
                    ...userData,
                    username: userData.username || userData.email?.split('@')[0]
                });

                if (!isOwnProfile && currentUser) {
                    const statusData = await friendsAPI.getFriendshipStatus(currentUser._id, userId);
                    setFriendshipStatus(statusData.status);
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, currentUser, isOwnProfile, friendshipStatus]);

    const handleSendFriendRequest = async () => {
        if (!currentUser || actionLoading) return;
        
        setActionLoading(true);
        try {
            await friendsAPI.sendFriendRequest(currentUser._id, userId);
            setFriendshipStatus('request_sent');
        } catch (error) {
            console.error('Error sending friend request:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUnfriend = async () => {
        if (!currentUser || actionLoading) return;
        
        setActionLoading(true);
        try {
            await friendsAPI.removeFriend(currentUser._id, userId);
            setFriendshipStatus('none');
        } catch (error) {
            console.error('Error unfriending user:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const renderActionButton = () => {
        if (isOwnProfile) return null;

        switch (friendshipStatus) {
            case 'friends':
                return (
                    <button 
                        onClick={handleUnfriend}
                        disabled={actionLoading}
                        className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                        {actionLoading ? 'Unfriending...' : 'Unfriend'}
                    </button>
                );
            case 'request_sent':
                return (
                    <button 
                        disabled
                        className="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold cursor-not-allowed"
                    >
                        Request Sent
                    </button>
                );
            case 'request_received':
                return (
                    <button 
                        onClick={() => friendsAPI.acceptFriendRequest(currentUser._id, userId)}
                        className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
                    >
                        Accept Request
                    </button>
                );
            default:
                return (
                    <button 
                        onClick={handleSendFriendRequest}
                        disabled={actionLoading}
                        className="px-6 py-3 bg-gradient-fire text-white rounded-xl font-semibold hover:shadow-forge-hover transition-all disabled:opacity-50"
                    >
                        {actionLoading ? 'Sending...' : 'Send Friend Request'}
                    </button>
                );
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-metal rounded-xl p-8 shadow-forge border-2 border-steel-blue text-center">
                <div className="animate-pulse">
                    <div className="w-32 h-32 bg-iron-light rounded-full mx-auto mb-4"></div>
                    <div className="h-8 bg-iron-light rounded w-48 mx-auto mb-2"></div>
                    <div className="h-4 bg-iron-light rounded w-32 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="bg-gradient-metal rounded-xl p-8 shadow-forge border-2 border-forge-red text-center">
                <h3 className="text-xl font-semibold text-forge-red mb-2">Profile not found</h3>
            </div>
        );
    }

    const isFriend = friendshipStatus === 'friends';
    const showFullProfile = isOwnProfile || isFriend;

    return (
        <div className="space-y-8">
            {/* Basic Profile Info - Always visible */}
            <div className="bg-gradient-metal text-silver rounded-xl p-8 shadow-forge border-2 border-forge-orange">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="w-32 h-32 rounded-full bg-gradient-fire text-white flex items-center justify-center text-4xl font-bold shadow-forge-glow border-4 border-forge-yellow">
                        {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-forge-yellow mb-2">{profileData.name}</h1>
                        <p className="text-lg text-forge-orange mb-4">@{profileData.username}</p>
                        
                        {showFullProfile && profileData.bio && (
                            <p className="text-ash-gray mb-6">{profileData.bio}</p>
                        )}
                        
                        <div className="flex justify-center md:justify-start">
                            {renderActionButton()}
                        </div>
                    </div>
                </div>
            </div>





            {/* Limited view message for non-friends */}
            {!showFullProfile && (
                <div className="bg-gradient-metal rounded-xl p-8 shadow-forge border-2 border-steel-blue text-center">
                    <div className="text-4xl mb-4">🔒</div>
                    <h3 className="text-xl font-semibold text-forge-yellow mb-2">Limited Profile View</h3>
                    <p className="text-ash-gray">Send a friend request to view this user's full profile, friends, and projects.</p>
                </div>
            )}
        </div>
    );
};

export default UserProfile;