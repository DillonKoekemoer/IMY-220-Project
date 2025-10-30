// Dillon Koekemoer u23537052
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../services/api';

const FriendsSection = ({ userId, currentUser }) => {
    const [activeTab, setActiveTab] = useState('friends');
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [removingFriend, setRemovingFriend] = useState(null);
    const [processingRequest, setProcessingRequest] = useState(null);
    const [sendingRequest, setSendingRequest] = useState(null);
    const navigate = useNavigate();

    const isOwnProfile = currentUser && String(currentUser._id) === String(userId);

    useEffect(() => {
        fetchFriendsData();
        if (isOwnProfile) {
            fetchFriendRequests();
        }
    }, [userId, isOwnProfile]);

    useEffect(() => {
        if (activeTab === 'find') {
            fetchAllUsers();
        }
    }, [activeTab]);

    const fetchFriendsData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3001/api/friends/${userId}`);
            if (response.ok) {
                const friendsData = await response.json();
                const friendDetails = await Promise.all(
                    friendsData.map(async (friendship) => {
                        try {
                            const friend = await usersAPI.getById(friendship.friendId);
                            return { ...friend, friendshipId: friendship._id };
                        } catch (error) {
                            console.error('Error fetching friend:', error);
                            return null;
                        }
                    })
                );
                setFriends(friendDetails.filter(f => f !== null));
            }
        } catch (error) {
            console.error('Error fetching friends:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFriendRequests = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/users/${userId}/friend-requests`);
            if (response.ok) {
                const requests = await response.json();
                setFriendRequests(requests);
            }
        } catch (error) {
            console.error('Error fetching friend requests:', error);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const users = await usersAPI.getAll();
            // Filter out current user and existing friends
            const friendIds = friends.map(f => f._id);
            const filteredUsers = users.filter(
                user => user._id !== userId && !friendIds.includes(user._id)
            );
            setAllUsers(filteredUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleRemoveFriend = async (friendId, e) => {
        e?.stopPropagation();
        if (removingFriend === friendId) return;

        if (!window.confirm('Are you sure you want to remove this friend?')) return;

        setRemovingFriend(friendId);
        try {
            const response = await fetch(`http://localhost:3001/api/friends/${userId}/${friendId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setFriends(prev => prev.filter(friend => friend._id !== friendId));
            } else {
                alert('Failed to remove friend');
            }
        } catch (error) {
            console.error('Error removing friend:', error);
            alert('Failed to remove friend');
        } finally {
            setRemovingFriend(null);
        }
    };

    const handleAcceptRequest = async (requestId, senderId) => {
        if (processingRequest === requestId) return;

        setProcessingRequest(requestId);
        try {
            const response = await fetch('http://localhost:3001/api/users/accept-friend-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, friendId: senderId })
            });

            if (response.ok) {
                setFriendRequests(prev => prev.filter(req => req._id !== requestId));
                await fetchFriendsData();
            } else {
                alert('Failed to accept friend request');
            }
        } catch (error) {
            console.error('Error accepting request:', error);
            alert('Failed to accept friend request');
        } finally {
            setProcessingRequest(null);
        }
    };

    const handleRejectRequest = async (requestId, senderId) => {
        if (processingRequest === requestId) return;

        setProcessingRequest(requestId);
        try {
            const response = await fetch('http://localhost:3001/api/users/reject-friend-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, friendId: senderId })
            });

            if (response.ok) {
                setFriendRequests(prev => prev.filter(req => req._id !== requestId));
            } else {
                alert('Failed to reject friend request');
            }
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert('Failed to reject friend request');
        } finally {
            setProcessingRequest(null);
        }
    };

    const handleSendRequest = async (targetUserId) => {
        if (sendingRequest === targetUserId) return;

        setSendingRequest(targetUserId);
        try {
            const response = await fetch('http://localhost:3001/api/users/send-friend-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, friendId: targetUserId })
            });

            if (response.ok) {
                alert('Friend request sent!');
                setAllUsers(prev => prev.filter(u => u._id !== targetUserId));
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to send friend request');
            }
        } catch (error) {
            console.error('Error sending request:', error);
            alert('Failed to send friend request');
        } finally {
            setSendingRequest(null);
        }
    };

    const filteredUsers = allUsers.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderFriendCard = (friend) => (
        <div
            key={friend._id}
            className="bg-iron-light p-6 rounded-xl border-2 border-steel-blue cursor-pointer transition-all duration-300 hover:border-forge-orange hover:bg-iron-gray hover:-translate-y-1 hover:shadow-forge-hover relative group"
            onClick={() => navigate(`/profile/${friend._id}`)}
        >
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-forge-yellow flex-shrink-0">
                    {friend.profilePicture ? (
                        friend.profilePicture.startsWith('placeholder-') ? (
                            <div
                                className="w-full h-full flex items-center justify-center text-xl font-bold text-white"
                                style={{ backgroundColor: `#${friend.profilePicture.replace('placeholder-', '')}` }}
                            >
                                {friend.name ? friend.name.charAt(0).toUpperCase() : '?'}
                            </div>
                        ) : (
                            <img
                                src={friend.profilePicture.startsWith('http') ? friend.profilePicture : `http://localhost:3001${friend.profilePicture}`}
                                alt={friend.name}
                                className="w-full h-full object-cover"
                            />
                        )
                    ) : (
                        <div className="w-full h-full bg-gradient-fire text-white flex items-center justify-center font-semibold text-xl">
                            {friend.name ? friend.name.charAt(0).toUpperCase() : '?'}
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-silver mb-1 truncate">{friend.name}</h4>
                    <p className="text-sm text-forge-orange truncate">@{friend.username || friend.email?.split('@')[0]}</p>
                    {friend.bio && (
                        <p className="text-xs text-ash-gray mt-2 line-clamp-2">{friend.bio}</p>
                    )}
                </div>
                {isOwnProfile && (
                    <button
                        onClick={(e) => handleRemoveFriend(friend._id, e)}
                        disabled={removingFriend === friend._id}
                        className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center transition-all duration-300 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remove friend"
                    >
                        {removingFriend === friend._id ? '⏳' : '✕'}
                    </button>
                )}
            </div>
        </div>
    );

    const renderRequestCard = (request) => (
        <div
            key={request._id}
            className="bg-iron-light p-6 rounded-xl border-2 border-forge-orange"
        >
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-forge-yellow flex-shrink-0">
                    {request.user?.profilePicture ? (
                        request.user.profilePicture.startsWith('placeholder-') ? (
                            <div
                                className="w-full h-full flex items-center justify-center text-xl font-bold text-white"
                                style={{ backgroundColor: `#${request.user.profilePicture.replace('placeholder-', '')}` }}
                            >
                                {request.user.name ? request.user.name.charAt(0).toUpperCase() : '?'}
                            </div>
                        ) : (
                            <img
                                src={request.user.profilePicture.startsWith('http') ? request.user.profilePicture : `http://localhost:3001${request.user.profilePicture}`}
                                alt={request.user.name}
                                className="w-full h-full object-cover"
                            />
                        )
                    ) : (
                        <div className="w-full h-full bg-gradient-fire text-white flex items-center justify-center font-semibold text-xl">
                            {request.user?.name ? request.user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-silver mb-1">{request.user?.name || 'Unknown User'}</h4>
                    <p className="text-sm text-forge-orange">@{request.user?.username || request.user?.email?.split('@')[0]}</p>
                    <p className="text-xs text-ash-gray mt-1">
                        {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                    <button
                        onClick={() => handleAcceptRequest(request._id, request.userId)}
                        disabled={processingRequest === request._id}
                        className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/50 font-medium text-sm transition-all duration-300 hover:bg-green-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processingRequest === request._id ? '⏳' : '✓ Accept'}
                    </button>
                    <button
                        onClick={() => handleRejectRequest(request._id, request.userId)}
                        disabled={processingRequest === request._id}
                        className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/50 font-medium text-sm transition-all duration-300 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processingRequest === request._id ? '⏳' : '✕ Decline'}
                    </button>
                </div>
            </div>
        </div>
    );

    const renderUserCard = (user) => (
        <div
            key={user._id}
            className="bg-iron-light p-6 rounded-xl border-2 border-steel-blue transition-all duration-300 hover:border-forge-orange"
        >
            <div className="flex items-center gap-4">
                <div
                    className="w-16 h-16 rounded-full overflow-hidden border-2 border-forge-yellow flex-shrink-0 cursor-pointer"
                    onClick={() => navigate(`/profile/${user._id}`)}
                >
                    {user.profilePicture ? (
                        user.profilePicture.startsWith('placeholder-') ? (
                            <div
                                className="w-full h-full flex items-center justify-center text-xl font-bold text-white"
                                style={{ backgroundColor: `#${user.profilePicture.replace('placeholder-', '')}` }}
                            >
                                {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                            </div>
                        ) : (
                            <img
                                src={user.profilePicture.startsWith('http') ? user.profilePicture : `http://localhost:3001${user.profilePicture}`}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        )
                    ) : (
                        <div className="w-full h-full bg-gradient-fire text-white flex items-center justify-center font-semibold text-xl">
                            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h4
                        className="font-semibold text-silver mb-1 truncate cursor-pointer hover:text-forge-yellow"
                        onClick={() => navigate(`/profile/${user._id}`)}
                    >
                        {user.name}
                    </h4>
                    <p className="text-sm text-forge-orange truncate">@{user.username || user.email?.split('@')[0]}</p>
                    {user.bio && (
                        <p className="text-xs text-ash-gray mt-2 line-clamp-2">{user.bio}</p>
                    )}
                </div>
                <button
                    onClick={() => handleSendRequest(user._id)}
                    disabled={sendingRequest === user._id}
                    className="px-4 py-2 rounded-lg bg-forge-orange/20 text-forge-orange border border-forge-orange/50 font-medium text-sm transition-all duration-300 hover:bg-forge-orange hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                    {sendingRequest === user._id ? '⏳ Sending...' : '+ Add Friend'}
                </button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <section>
                <div className="bg-iron-light rounded-xl p-8 text-center">
                    <p className="text-ash-gray">Loading friends...</p>
                </div>
            </section>
        );
    }

    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-forge-yellow">
                    {isOwnProfile ? 'My Friends' : `${friends.length} Friends`}
                </h3>
                {isOwnProfile && friendRequests.length > 0 && (
                    <span className="px-3 py-1 bg-forge-orange/20 text-forge-orange rounded-full text-sm font-bold border border-forge-orange/50">
                        {friendRequests.length} New Request{friendRequests.length !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {isOwnProfile && (
                <div className="flex gap-2 bg-iron-light p-1 rounded-lg border border-ash-gray mb-6">
                    <button
                        onClick={() => setActiveTab('friends')}
                        className={`flex-1 px-4 py-2 rounded-lg border-none bg-transparent cursor-pointer text-sm font-medium transition-all duration-300 ${
                            activeTab === 'friends'
                                ? 'bg-gradient-fire text-white shadow-forge'
                                : 'text-ash-gray hover:bg-iron-dark hover:text-forge-orange'
                        }`}
                    >
                        👥 Friends ({friends.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`flex-1 px-4 py-2 rounded-lg border-none bg-transparent cursor-pointer text-sm font-medium transition-all duration-300 relative ${
                            activeTab === 'requests'
                                ? 'bg-gradient-fire text-white shadow-forge'
                                : 'text-ash-gray hover:bg-iron-dark hover:text-forge-orange'
                        }`}
                    >
                        📬 Requests ({friendRequests.length})
                        {friendRequests.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-forge-orange text-white text-xs rounded-full flex items-center justify-center">
                                {friendRequests.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('find')}
                        className={`flex-1 px-4 py-2 rounded-lg border-none bg-transparent cursor-pointer text-sm font-medium transition-all duration-300 ${
                            activeTab === 'find'
                                ? 'bg-gradient-fire text-white shadow-forge'
                                : 'text-ash-gray hover:bg-iron-dark hover:text-forge-orange'
                        }`}
                    >
                        🔍 Find Friends
                    </button>
                </div>
            )}

            {/* Friends Tab */}
            {activeTab === 'friends' && (
                <>
                    {friends.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {friends.map(renderFriendCard)}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-iron-light rounded-xl border-2 border-ash-gray/20">
                            <div className="text-6xl mb-4">👥</div>
                            <h4 className="text-xl font-semibold text-silver mb-2">No friends yet</h4>
                            <p className="text-ash-gray mb-4">
                                {isOwnProfile ? 'Start connecting with other developers!' : 'This user hasn\'t added any friends yet.'}
                            </p>
                            {isOwnProfile && (
                                <button
                                    onClick={() => setActiveTab('find')}
                                    className="px-6 py-3 rounded-lg bg-gradient-fire text-white font-semibold transition-all duration-300 hover:shadow-forge-hover hover:-translate-y-1"
                                >
                                    Find Friends
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Friend Requests Tab */}
            {activeTab === 'requests' && isOwnProfile && (
                <>
                    {friendRequests.length > 0 ? (
                        <div className="space-y-4">
                            {friendRequests.map(renderRequestCard)}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-iron-light rounded-xl border-2 border-ash-gray/20">
                            <h4 className="text-xl font-semibold text-silver mb-2">No pending requests</h4>
                            <p className="text-ash-gray">You're all caught up!</p>
                        </div>
                    )}
                </>
            )}

            {/* Find Friends Tab */}
            {activeTab === 'find' && isOwnProfile && (
                <>
                    <div className="mb-6">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search users by name or email..."
                            className="w-full px-4 py-3 bg-iron-light border-2 border-ash-gray rounded-lg text-silver placeholder-ash-gray focus:outline-none focus:border-forge-orange focus:ring-2 focus:ring-forge-orange/20"
                        />
                    </div>
                    {filteredUsers.length > 0 ? (
                        <div className="space-y-4">
                            {filteredUsers.map(renderUserCard)}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-iron-light rounded-xl border-2 border-ash-gray/20">
                            <div className="text-6xl mb-4">🔍</div>
                            <h4 className="text-xl font-semibold text-silver mb-2">
                                {searchQuery ? 'No users found' : 'No new users to add'}
                            </h4>
                            <p className="text-ash-gray">
                                {searchQuery ? 'Try a different search term' : 'You\'re already friends with everyone!'}
                            </p>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default FriendsSection;
