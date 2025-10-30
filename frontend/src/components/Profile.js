// Dillon Koekemoer u23537052
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TempProfilePic from '../assets/thething.png';
import { usersAPI } from '../services/api';

const Profile = ({ userId, currentUser, isOwnProfile, onEdit }) => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [friendshipStatus, setFriendshipStatus] = useState('none'); // 'none', 'friends', 'request_sent', 'request_received'
    const [processingRequest, setProcessingRequest] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!userId) return;

            try {
                setLoading(true);
                const data = await usersAPI.getById(userId);
                setProfileData({
                    ...data,
                    avatar: data.avatar || TempProfilePic,
                    firstName: data.name?.split(' ')[0] || data.firstName || data.name,
                    lastName: data.name?.split(' ')[1] || data.lastName || '',
                    username: data.username || data.email?.split('@')[0],
                    joinDate: data.joinDate || 'Recently joined'
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
        checkFriendshipStatus();
    }, [userId, currentUser]);

    const checkFriendshipStatus = async () => {
        if (!userId || !currentUser || isOwnProfile) return;

        try {
            const response = await fetch(`http://localhost:3001/api/users/friendship-status/${currentUser._id}/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setFriendshipStatus(data.status); // 'friends', 'request_sent', 'request_received', 'none'
            }
        } catch (error) {
            console.error('Error checking friendship status:', error);
        }
    };

    const handleSendFriendRequest = async () => {
        if (!userId || !currentUser || processingRequest) return;

        setProcessingRequest(true);
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
                setFriendshipStatus('request_sent');
                alert('Friend request sent successfully!');
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Failed to send friend request');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
            alert('Failed to send friend request. Please try again.');
        } finally {
            setProcessingRequest(false);
        }
    };

    const handleUnfriend = async () => {
        if (!window.confirm('Are you sure you want to unfriend this user?')) return;

        setProcessingRequest(true);
        try {
            const response = await fetch(`http://localhost:3001/api/friends/${currentUser._id}/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setFriendshipStatus('none');
                alert('User unfriended successfully');
            } else {
                alert('Failed to unfriend user');
            }
        } catch (error) {
            console.error('Error unfriending user:', error);
            alert('Failed to unfriend user. Please try again.');
        } finally {
            setProcessingRequest(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-metal text-silver rounded-xl p-8 shadow-forge border-2 border-steel-blue text-center">
                <div className="animate-pulse">
                    <div className="w-32 h-32 bg-iron-light rounded-full mx-auto mb-4"></div>
                    <div className="h-8 bg-iron-light rounded w-48 mx-auto mb-2"></div>
                    <div className="h-4 bg-iron-light rounded w-32 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (error || !profileData) {
        return (
            <div className="bg-gradient-metal text-silver rounded-xl p-8 shadow-forge border-2 border-forge-red text-center">
                <h3 className="text-xl font-semibold text-forge-red mb-2">Error loading profile</h3>
                <p className="text-ash-gray">{error || 'Profile not found'}</p>
            </div>
        );
    }

    // Determine what to show based on friendship status
    const isFriend = friendshipStatus === 'friends';
    const canViewFullProfile = isOwnProfile || isFriend;

    return (
        <div className="bg-gradient-metal text-silver rounded-xl p-8 shadow-forge border-2 border-forge-orange relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-fire rounded-t-xl"></div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Avatar Section - Always visible */}
                <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-full overflow-hidden shadow-forge-glow border-4 border-forge-yellow animate-pulse-glow">
                        {profileData.profilePicture ? (
                            profileData.profilePicture.startsWith('placeholder-') ? (
                                <div
                                    className="w-full h-full flex items-center justify-center text-4xl font-bold text-white"
                                    style={{ backgroundColor: `#${profileData.profilePicture.replace('placeholder-', '')}` }}
                                >
                                    {profileData.name ? profileData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                                </div>
                            ) : (
                                <img
                                    src={profileData.profilePicture.startsWith('http') ? profileData.profilePicture : `http://localhost:3001${profileData.profilePicture}`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            )
                        ) : (
                            <div className="w-full h-full bg-gradient-fire text-white flex items-center justify-center text-4xl font-bold">
                                {profileData.name ? profileData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                    {/* Name - Always visible */}
                    <h1 className="text-3xl md:text-4xl font-sans font-bold text-forge-yellow mb-2">
                        {profileData.name || `${profileData.firstName} ${profileData.lastName}`}
                    </h1>

                    {/* Username - Only visible to friends or own profile */}
                    {canViewFullProfile && (
                        <p className="text-lg text-forge-orange mb-4 font-medium">@{profileData.username}</p>
                    )}

                    {/* Not friends message */}
                    {!canViewFullProfile && (
                        <div className="mb-6 p-4 bg-iron-light rounded-lg border border-ash-gray/30">
                            <p className="text-steel-light text-sm">
                                🔒 Add {profileData.name?.split(' ')[0] || 'this user'} as a friend to view their full profile
                            </p>
                        </div>
                    )}

                    {/* Bio - Only visible to friends or own profile */}
                    {canViewFullProfile && profileData.bio && (
                        <p className="text-ash-gray mb-6 max-w-2xl leading-relaxed">{profileData.bio}</p>
                    )}

                    {/* Additional Info - Only visible to friends or own profile */}
                    {canViewFullProfile && (
                        <>
                            <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6 text-sm">
                                {profileData.location && (
                                    <span className="flex items-center gap-2 text-steel-light">
                                        <span className="text-forge-orange">📍 Location:</span>
                                        {profileData.location}
                                    </span>
                                )}
                                <span className="flex items-center gap-2 text-steel-light">
                                    <span className="text-forge-orange">📅 Joined:</span>
                                    {profileData.joinDate || 'Recently joined'}
                                </span>
                            </div>

                            {profileData.website && (
                                <div className="mb-6">
                                    <span className="flex items-center justify-center md:justify-start gap-2 text-steel-light">
                                        <span className="text-forge-orange">🌐 Website:</span>
                                        <a
                                            href={profileData.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-forge-yellow hover:text-forge-orange transition-colors underline"
                                        >
                                            {profileData.website}
                                        </a>
                                    </span>
                                </div>
                            )}
                        </>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-center md:justify-start gap-3">
                        {isOwnProfile ? (
                            <button
                                className="px-8 py-4 rounded-xl text-white font-semibold bg-gradient-fire shadow-forge transition-all duration-300 hover:shadow-forge-hover hover:-translate-y-1 hover:scale-105 active:scale-95"
                                onClick={onEdit}
                            >
                                ✏️ Edit Profile
                            </button>
                        ) : (
                            <>
                                {/* Add Friend Button - Show when not friends */}
                                {friendshipStatus === 'none' && (
                                    <button
                                        className="px-8 py-4 rounded-xl text-white font-semibold bg-gradient-fire shadow-forge transition-all duration-300 hover:shadow-forge-hover hover:-translate-y-1 hover:scale-105 active:scale-95 disabled:opacity-50"
                                        onClick={handleSendFriendRequest}
                                        disabled={processingRequest}
                                    >
                                        {processingRequest ? '⏳ Sending...' : '➕ Send Friend Request'}
                                    </button>
                                )}

                                {/* Request Sent - Show when request pending */}
                                {friendshipStatus === 'request_sent' && (
                                    <button
                                        disabled
                                        className="px-8 py-4 rounded-xl font-semibold bg-ash-gray/20 text-ash-gray border border-ash-gray/30 cursor-not-allowed"
                                    >
                                        📤 Friend Request Sent
                                    </button>
                                )}

                                {/* Request Received - Show when they sent you a request */}
                                {friendshipStatus === 'request_received' && (
                                    <button
                                        className="px-8 py-4 rounded-xl font-semibold bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500 hover:text-white transition-all duration-300"
                                        onClick={() => window.location.href = '/home'}
                                    >
                                        📥 Accept Friend Request
                                    </button>
                                )}

                                {/* Friends - Show unfriend button */}
                                {friendshipStatus === 'friends' && (
                                    <>
                                        <button
                                            disabled
                                            className="px-8 py-4 rounded-xl font-semibold bg-green-500 text-white cursor-default"
                                        >
                                            ✓ Friends
                                        </button>
                                        <button
                                            className="px-8 py-4 rounded-xl font-semibold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all duration-300 disabled:opacity-50"
                                            onClick={handleUnfriend}
                                            disabled={processingRequest}
                                        >
                                            {processingRequest ? '⏳' : '❌ Unfriend'}
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
