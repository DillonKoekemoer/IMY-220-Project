// Dillon Koekemoer u23537052
import React, { useState, useEffect } from 'react';
import { friendsAPI, usersAPI } from '../services/api';

const FriendRequests = ({ userId }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingRequest, setProcessingRequest] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            if (!userId) return;
            
            try {
                setLoading(true);
                const requestsData = await friendsAPI.getFriendRequests(userId);
                
                // Get user details for each request
                const requestDetails = await Promise.all(
                    requestsData.map(async (request) => {
                        try {
                            const user = await usersAPI.getById(request.userId);
                            return { ...request, user };
                        } catch (error) {
                            console.error('Error fetching request user:', error);
                            return null;
                        }
                    })
                );
                
                setRequests(requestDetails.filter(req => req !== null));
            } catch (error) {
                console.error('Error fetching friend requests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [userId]);

    const handleAcceptRequest = async (requestId, friendId) => {
        if (processingRequest === requestId) return;
        
        setProcessingRequest(requestId);
        try {
            await friendsAPI.acceptFriendRequest(userId, friendId);
            setRequests(prev => prev.filter(req => req._id !== requestId));
        } catch (error) {
            console.error('Error accepting friend request:', error);
        } finally {
            setProcessingRequest(null);
        }
    };

    const handleDeclineRequest = async (requestId, friendId) => {
        if (processingRequest === requestId) return;
        
        setProcessingRequest(requestId);
        try {
            await friendsAPI.removeFriend(friendId, userId);
            setRequests(prev => prev.filter(req => req._id !== requestId));
        } catch (error) {
            console.error('Error declining friend request:', error);
        } finally {
            setProcessingRequest(null);
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-metal rounded-xl p-8 shadow-forge border-2 border-steel-blue">
                <h3 className="text-2xl font-semibold text-forge-yellow mb-6">Friend Requests</h3>
                <p className="text-ash-gray text-center">Loading requests...</p>
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div className="bg-gradient-metal rounded-xl p-8 shadow-forge border-2 border-steel-blue">
                <h3 className="text-2xl font-semibold text-forge-yellow mb-6">Friend Requests</h3>
                <div className="text-center py-8">
                    <div className="text-4xl mb-4">📬</div>
                    <p className="text-ash-gray">No pending friend requests</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-metal rounded-xl p-8 shadow-forge border-2 border-steel-blue">
            <h3 className="text-2xl font-semibold text-forge-yellow mb-6">Friend Requests ({requests.length})</h3>
            <div className="space-y-4">
                {requests.map(request => (
                    <div key={request._id} className="bg-iron-light p-6 rounded-xl border border-steel-blue">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-fire text-white flex items-center justify-center font-semibold text-lg">
                                    {request.user.name ? request.user.name.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-silver">{request.user.name}</h4>
                                    <p className="text-sm text-forge-orange">@{request.user.username || request.user.email?.split('@')[0]}</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAcceptRequest(request._id, request.userId)}
                                    disabled={processingRequest === request._id}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
                                >
                                    {processingRequest === request._id ? '...' : 'Accept'}
                                </button>
                                <button
                                    onClick={() => handleDeclineRequest(request._id, request.userId)}
                                    disabled={processingRequest === request._id}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                    {processingRequest === request._id ? '...' : 'Decline'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FriendRequests;