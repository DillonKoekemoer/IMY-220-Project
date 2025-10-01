// Dillon Koekemoer u23537052
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI, friendsAPI } from '../services/api';

const FriendsList = ({ userId }) => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingFriend, setRemovingFriend] = useState(null);
    const navigate = useNavigate();

    const handleFriendClick = (friendId) => {
        navigate(`/profile/${friendId}`);
    };

    const handleRemoveFriend = async (friendId, e) => {
        e.stopPropagation();
        if (removingFriend === friendId) return;
        
        setRemovingFriend(friendId);
        try {
            await friendsAPI.removeFriend(userId, friendId);
            setFriends(prev => prev.filter(friend => friend._id !== friendId));
        } catch (error) {
            console.error('Error removing friend:', error);
        } finally {
            setRemovingFriend(null);
        }
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
            <section>
                <h3 className="text-2xl font-semibold text-forge-yellow mb-6">Friends</h3>
                <div className="bg-iron-light rounded-xl p-8 text-center">
                    <p className="text-ash-gray">Loading friends...</p>
                </div>
            </section>
        );
    }

    return (
        <section>
            <h3 className="text-2xl font-semibold text-forge-yellow mb-6">Friends ({friends.length})</h3>
            {friends.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {friends.map(friend => (
                        <div 
                            key={friend._id} 
                            className="bg-iron-light p-6 rounded-xl border-2 border-steel-blue cursor-pointer transition-all duration-300 hover:border-forge-orange hover:bg-iron-gray hover:-translate-y-1 hover:shadow-forge-hover relative group"
                            onClick={() => handleFriendClick(friend._id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-fire text-white flex items-center justify-center font-semibold text-lg">
                                    {friend.name ? friend.name.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-silver mb-1">{friend.name}</h4>
                                    <p className="text-sm text-forge-orange">@{friend.username || friend.email?.split('@')[0]}</p>
                                </div>
                                <button
                                    onClick={(e) => handleRemoveFriend(friend._id, e)}
                                    disabled={removingFriend === friend._id}
                                    className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center transition-all duration-300 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Remove friend"
                                >
                                    {removingFriend === friend._id ? '⏳' : '✕'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-4xl mb-4">👥</div>
                    <p className="text-ash-gray">No friends yet. Connect with other developers!</p>
                </div>
            )}
        </section>
    );
};

export default FriendsList;
