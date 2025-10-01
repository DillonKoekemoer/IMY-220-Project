// Dillon Koekemoer u23537052
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../services/api';

const FriendsList = ({ userId }) => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleFriendClick = (friendId) => {
        navigate(`/profile/${friendId}`);
    };

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                setLoading(true);
                console.log('Fetching friends for userId:', userId);
                
                // Get friends from Friends collection
                const response = await fetch(`http://localhost:3001/api/friends/${userId}`);
                console.log('Friends API response status:', response.status);
                
                if (response.ok) {
                    const friendsData = await response.json();
                    console.log('Friends data:', friendsData);
                    
                    // Get user details for each friend
                    const friendDetails = await Promise.all(
                        friendsData.map(async (friendship) => {
                            try {
                                console.log('Fetching friend with ID:', friendship.friendId);
                                const friend = await usersAPI.getById(friendship.friendId);
                                console.log('Friend details:', friend);
                                return friend;
                            } catch (error) {
                                console.error('Error fetching friend:', error);
                                return null;
                            }
                        })
                    );
                    
                    const validFriends = friendDetails.filter(friend => friend !== null);
                    console.log('Valid friends:', validFriends);
                    setFriends(validFriends);
                } else {
                    console.error('Friends API error:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error fetching friends:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchFriends();
        }
    }, [userId]);

    if (loading) {
        return (
            <section className="friends-section">
                <h3>Friends</h3>
                <div className="loading-card">
                    <p>Loading friends...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="friends-section">
            <h3>Friends ({friends.length})</h3>
            {friends.length > 0 ? (
                <div className="friends-grid">
                    {friends.map(friend => (
                        <div 
                            key={friend._id} 
                            className="friend-card" 
                            onClick={() => handleFriendClick(friend._id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="friend-avatar">
                                {friend.name ? friend.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div className="friend-info">
                                <h4>{friend.name}</h4>
                                <p>@{friend.username || friend.email?.split('@')[0]}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-friends">
                    <p>No friends yet. Connect with other developers!</p>
                </div>
            )}
        </section>
    );
};

export default FriendsList;
