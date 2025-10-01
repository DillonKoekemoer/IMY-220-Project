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
            <div className="activity-sidebar">
                <h3>Recent Activity</h3>
                <div className="activity-loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="activity-sidebar">
            <h3>Recent Activity</h3>
            {activities.length > 0 ? (
                <div className="activity-list">
                    {activities.map(activity => {
                        const user = users[activity.userId];
                        const timeAgo = new Date(activity.createdAt).toLocaleDateString();
                        
                        return (
                            <div 
                                key={activity._id} 
                                className="activity-item"
                                onClick={() => handleActivityClick(activity)}
                            >
                                <div className="activity-header">
                                    <div className="activity-avatar">
                                        {user?.name?.charAt(0) || '?'}
                                    </div>
                                    <div className="activity-info">
                                        <div className="activity-user">{user?.name || 'Unknown'}</div>
                                        <div className="activity-time">{timeAgo}</div>
                                    </div>
                                </div>
                                <div className="activity-content">
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
                <div className="no-activities">
                    <p>No recent activity</p>
                </div>
            )}
        </div>
    );
};

export default ActivitySidebar;