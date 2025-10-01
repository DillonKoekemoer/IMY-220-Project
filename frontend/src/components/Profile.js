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
            <div className="profile-header">
                <div className="card text-center">
                    <h3>Loading profile...</h3>
                </div>
            </div>
        );
    }

    if (error || !profileData) {
        return (
            <div className="profile-header">
                <div className="card text-center">
                    <h3>Error loading profile</h3>
                    <p>{error || 'Profile not found'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-header-container">
            <div className="profile-card">
                <div className="profile-avatar-section">
                    <div className="profile-avatar">
                        {profileData.name ? profileData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                    </div>
                </div>
                <div className="profile-info-section">
                    <h1 className="profile-name">{profileData.name || `${profileData.firstName} ${profileData.lastName}`}</h1>
                    <p className="profile-username">@{profileData.username}</p>
                    {profileData.bio && <p className="profile-bio">{profileData.bio}</p>}
                    <div className="profile-meta">
                        {profileData.location && <span className="meta-item">📍 {profileData.location}</span>}
                        <span className="meta-item">📅 {profileData.joinDate || 'Recently joined'}</span>
                    </div>
                    {profileData.website && (
                        <div className="profile-website">
                            <span>🌐 <a href={profileData.website} target="_blank" rel="noopener noreferrer">{profileData.website}</a></span>
                        </div>
                    )}
                    {isOwnProfile ? (
                        <button className="edit-profile-btn" onClick={onEdit}>
                            Edit Profile
                        </button>
                    ) : (
                        <button 
                            className="edit-profile-btn" 
                            onClick={handleAddFriend}
                            disabled={addingFriend || isFriend}
                            style={{
                                background: isFriend ? '#28a745' : undefined,
                                cursor: isFriend ? 'default' : 'pointer'
                            }}
                        >
                            {addingFriend ? 'Adding...' : isFriend ? '✓ Friends' : '+ Add Friend'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;