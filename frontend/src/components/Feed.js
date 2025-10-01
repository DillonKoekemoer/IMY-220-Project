// Dillon Koekemoer u23537052
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectPreview from './ProjectPreview';
import { feedAPI, usersAPI } from '../services/api';

const Feed = ({ type, currentUser, searchTerm, sortBy, selectedLanguage }) => {
    const navigate = useNavigate();
    const [feedItems, setFeedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState({});

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                setLoading(true);
                let data;
                
                if (type === 'global') {
                    data = await feedAPI.getGlobal();
                } else {
                    data = await feedAPI.getLocal(currentUser._id);
                }
                
                // Fetch user data for feed items
                const userIds = [...new Set(data.map(item => item.userId).filter(Boolean))];
                const userMap = {};
                
                if (userIds.length > 0) {
                    try {
                        const userPromises = userIds.map(id => usersAPI.getById(id).catch(() => null));
                        const userData = await Promise.all(userPromises);
                        
                        userData.forEach(user => {
                            if (user) userMap[user._id] = user;
                        });
                    } catch (userError) {
                        console.warn('Failed to fetch some user data:', userError);
                    }
                }
                
                console.log('Feed items:', data);
                console.log('User map:', userMap);
                setUsers(userMap);
                setFeedItems(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchFeed();
        }
    }, [type, currentUser]);

    if (loading) {
        return (
            <section className="feed">
                <div className="card text-center">
                    <h3>Loading projects...</h3>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="feed">
                <div className="card text-center">
                    <h3>Error loading projects</h3>
                    <p>{error}</p>
                </div>
            </section>
        );
    }

    let filteredItems = feedItems;

    if (searchTerm) {
        filteredItems = filteredItems.filter(item =>
            (item.content || item.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.hashtags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }

    const handleItemClick = (item) => {
        if (item.content) {
            // Navigate to post detail
            navigate(`/post/${item._id}`);
        } else if (item.projectId) {
            // Navigate to project detail
            navigate(`/project/${item.projectId}`);
        }
    };

    const renderFeedItem = (item) => {
        const user = users[item.userId];
        const timeAgo = new Date(item.createdAt).toLocaleDateString();
        const isClickable = item.content || item.projectId;
        
        if (item.content) {
            // This is a post
            return (
                <div 
                    key={item._id} 
                    className={`card feed-item post-item ${isClickable ? 'clickable' : ''}`}
                    onClick={() => isClickable && handleItemClick(item)}
                >
                    <div className="feed-item-header">
                        <div className="user-avatar">
                            <div className="avatar-circle">{user?.name?.charAt(0) || '?'}</div>
                        </div>
                        <div className="user-info">
                            <div 
                                className="user-name" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (user?._id) navigate(`/profile/${user._id}`);
                                }}
                                style={{ cursor: user?._id ? 'pointer' : 'default' }}
                            >
                                {user?.name || 'Unknown User'}
                            </div>
                            <div className="feed-time">{timeAgo}</div>
                        </div>
                        <div className="post-type-badge">Post</div>
                    </div>
                    <div className="feed-content">
                        <p>{item.content}</p>
                        {item.hashtags && item.hashtags.length > 0 && (
                            <div className="hashtags">
                                {item.hashtags.map(tag => (
                                    <span key={tag} className="hashtag">#{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="feed-stats">
                        <span className="stat-item">❤️ {item.likes || 0}</span>
                        <span className="stat-item">💬 {item.comments?.length || 0}</span>
                        {isClickable && <span className="click-hint">Click to view details</span>}
                    </div>
                </div>
            );
        } else {
            // This is an activity
            return (
                <div 
                    key={item._id} 
                    className={`card feed-item activity-item ${isClickable ? 'clickable' : ''}`}
                    onClick={() => isClickable && handleItemClick(item)}
                >
                    <div className="feed-item-header">
                        <div className="user-avatar">
                            <div className="avatar-circle">{user?.name?.charAt(0) || '?'}</div>
                        </div>
                        <div className="user-info">
                            <div 
                                className="user-name" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (user?._id) navigate(`/profile/${user._id}`);
                                }}
                                style={{ cursor: user?._id ? 'pointer' : 'default' }}
                            >
                                {user?.name || 'Unknown User'}
                            </div>
                            <div className="feed-time">{timeAgo}</div>
                        </div>
                        <div className="activity-type-badge">
                            {item.type?.replace('_', ' ').toUpperCase()}
                        </div>
                    </div>
                    <div className="feed-content">
                        <p>{item.description}</p>
                        {isClickable && <span className="click-hint">Click to view project</span>}
                    </div>
                </div>
            );
        }
    };

    return (
        <section className="feed">
            {filteredItems.length > 0 ? (
                <div className="feed-items">
                    {filteredItems.map(item => renderFeedItem(item))}
                </div>
            ) : (
                <div className="card empty-feed">
                    <div className="empty-icon">📭</div>
                    <h3>No activity found</h3>
                    <p>{type === 'global' ? 'No global activity yet!' : 'Follow some friends to see their updates!'}</p>
                </div>
            )}
        </section>
    );
};

export default Feed;