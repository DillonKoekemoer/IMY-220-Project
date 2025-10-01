// Dillon Koekemoer u23537052
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { feedAPI, usersAPI } from '../services/api';

const ActivitySidebar = ({ type, currentUser }) => {
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState({});

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoading(true);
                let data;
                
                if (type === 'global') {
                    data = await feedAPI.getGlobal();
                } else {
                    data = await feedAPI.getLocal(currentUser._id);
                }
                
                // Filter only posts for activity sidebar
                const posts = data.filter(item => item.content);
                
                // Fetch user data
                const userIds = [...new Set(posts.map(item => item.userId).filter(Boolean))];
                const userMap = {};
                
                if (userIds.length > 0) {
                    const userPromises = userIds.map(id => usersAPI.getById(id).catch(() => null));
                    const userData = await Promise.all(userPromises);
                    userData.forEach(user => {
                        if (user) userMap[user._id] = user;
                    });
                }
                
                setUsers(userMap);
                setActivities(posts.slice(0, 5)); // Show only 5 recent activities
            } catch (err) {
                console.error('Failed to fetch activities:', err);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchActivities();
        }
    }, [type, currentUser]);

    const handleActivityClick = (activity) => {
        if (activity.projectId) {
            navigate(`/project/${activity.projectId}`);
        } else {
            navigate(`/post/${activity._id}`);
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-steel text-silver rounded-xl p-6 shadow-forge border-2 border-steel-blue">
                <h3 className="text-lg font-semibold text-forge-yellow mb-4">Recent Activity</h3>
                <div className="text-center text-ash-gray">Loading...</div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-steel text-silver rounded-xl p-6 shadow-forge border-2 border-steel-blue">
            <h3 className="text-lg font-semibold text-forge-yellow mb-4">Recent Activity</h3>
            {activities.length > 0 ? (
                <div className="space-y-4">
                    {activities.map(activity => {
                        const user = users[activity.userId];
                        const timeAgo = new Date(activity.createdAt).toLocaleDateString();
                        
                        return (
                            <div 
                                key={activity._id} 
                                className="bg-iron-light p-4 rounded-lg border border-ash-gray/30 cursor-pointer transition-all duration-300 hover:border-forge-orange hover:bg-iron-gray hover:-translate-y-1"
                                onClick={() => handleActivityClick(activity)}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-fire text-white flex items-center justify-center text-sm font-semibold">
                                        {user?.name?.charAt(0) || '?'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-silver">{user?.name || 'Unknown'}</div>
                                        <div className="text-xs text-ash-gray">{timeAgo}</div>
                                    </div>
                                </div>
                                <div className="text-sm text-ash-gray leading-relaxed">
                                    {activity.content.length > 60 
                                        ? `${activity.content.substring(0, 60)}...` 
                                        : activity.content
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-8">
                    <div className="text-2xl mb-2">💭</div>
                    <p className="text-ash-gray">No recent activity</p>
                </div>
            )}
        </div>
    );
};

export default ActivitySidebar;