// Dillon Koekemoer u23537052
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TempProfilePic from '../assets/thething.png';
import { usersAPI } from '../services/api';

const Profile = ({ userId, currentUser, isOwnProfile, onEdit }) => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFriend, setIsFriend] = useState(false);
    const [addingFriend, setAddingFriend] = useState(false);

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
        checkFriendStatus();
    }, [userId]);

    const checkFriendStatus = async () => {
        if (!userId || !currentUser || isOwnProfile) return;
        
        try {
            const response = await fetch(`http://localhost:3001/api/friends/${currentUser._id}`);
            if (response.ok) {
                const friends = await response.json();
                setIsFriend(friends.some(friend => friend.friendId === userId && friend.status === 'accepted'));
            }
        } catch (error) {
            console.error('Error checking friend status:', error);
        }
    };

    const handleAddFriend = async () => {
        if (!userId || !currentUser || addingFriend || isFriend) return;
        
        setAddingFriend(true);
        try {
            const response = await fetch('http://localhost:3001/api/users/add-friend', {
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
                setIsFriend(true);
            } else {
                console.error('Failed to add friend');
            }
        } catch (error) {
            console.error('Error adding friend:', error);
        } finally {
            setAddingFriend(false);
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

    return (
        <div className="bg-gradient-metal text-silver rounded-xl p-8 shadow-forge border-2 border-forge-orange relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-fire rounded-t-xl"></div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Avatar Section */}
                <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-full bg-gradient-fire text-white flex items-center justify-center text-4xl font-bold shadow-forge-glow border-4 border-forge-yellow animate-pulse-glow">
                        {profileData.name ? profileData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                    </div>
                </div>
                
                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-forge-yellow mb-2">
                        {profileData.name || `${profileData.firstName} ${profileData.lastName}`}
                    </h1>
                    <p className="text-lg text-forge-orange mb-4 font-medium">@{profileData.username}</p>
                    
                    {profileData.bio && (
                        <p className="text-ash-gray mb-6 max-w-2xl leading-relaxed">{profileData.bio}</p>
                    )}
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6 text-sm">
                        {profileData.location && (
                            <span className="flex items-center gap-2 text-steel-light">
                                <span className="text-forge-orange">📍</span>
                                {profileData.location}
                            </span>
                        )}
                        <span className="flex items-center gap-2 text-steel-light">
                            <span className="text-forge-orange">📅</span>
                            {profileData.joinDate || 'Recently joined'}
                        </span>
                    </div>
                    
                    {profileData.website && (
                        <div className="mb-6">
                            <span className="flex items-center justify-center md:justify-start gap-2 text-steel-light">
                                <span className="text-forge-orange">🌐</span>
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
                    
                    {/* Action Button */}
                    <div className="flex justify-center md:justify-start">
                        {isOwnProfile ? (
                            <button 
                                className="px-8 py-4 rounded-xl text-white font-semibold bg-gradient-fire shadow-forge transition-all duration-300 hover:shadow-forge-hover hover:-translate-y-1 hover:scale-105 active:scale-95"
                                onClick={onEdit}
                            >
                                ✏️ Edit Profile
                            </button>
                        ) : (
                            <button 
                                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                                    isFriend 
                                        ? 'bg-green-500 text-white cursor-default' 
                                        : 'bg-gradient-fire text-white shadow-forge hover:shadow-forge-hover hover:-translate-y-1 hover:scale-105 active:scale-95'
                                } disabled:opacity-50`}
                                onClick={handleAddFriend}
                                disabled={addingFriend || isFriend}
                            >
                                {addingFriend ? '⏳ Adding...' : isFriend ? '✓ Friends' : '👥 Add Friend'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;