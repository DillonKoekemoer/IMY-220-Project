// Dillon Koekemoer u23537052
import React, { useState, useEffect } from 'react';
import { postsAPI, usersAPI } from '../services/api';

const Messages = ({ projectId }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState({});

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const projectPosts = await postsAPI.getByProject(projectId);
                
                // Fetch user data for posts
                const userIds = [...new Set(projectPosts.map(post => post.userId).filter(Boolean))];
                const userMap = {};
                
                if (userIds.length > 0) {
                    const userPromises = userIds.map(id => usersAPI.getById(id).catch(() => null));
                    const userData = await Promise.all(userPromises);
                    userData.forEach(user => {
                        if (user) userMap[user._id] = user;
                    });
                }
                
                setUsers(userMap);
                setPosts(projectPosts);
            } catch (error) {
                console.error('Failed to fetch project posts:', error);
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            fetchPosts();
        }
    }, [projectId]);

    if (loading) {
        return (
            <div className="card">
                <h3>Project Activity</h3>
                <div className="loading">Loading activity...</div>
            </div>
        );
    }

    return (
        <div className="card">
            <h3>Project Activity</h3>
            <div className="messages-container">
                {posts.length > 0 ? (
                    posts.map(post => {
                        const user = users[post.userId];
                        const timeAgo = new Date(post.createdAt).toLocaleDateString();
                        
                        return (
                            <div key={post._id} className="message-item post-item">
                                <div className="message-header">
                                    <div className="message-user">
                                        <span className="action-icon">💬</span>
                                        <strong>{user?.name || 'Unknown User'}</strong>
                                        <span className="action-text">posted</span>
                                    </div>
                                    <div className="message-timestamp">
                                        {timeAgo}
                                    </div>
                                </div>
                                <div className="message-content">
                                    <p>{post.content}</p>
                                    {post.hashtags && post.hashtags.length > 0 && (
                                        <div className="hashtags">
                                            {post.hashtags.map(tag => (
                                                <span key={tag} className="hashtag">#{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="no-messages">
                        <p>No activity yet. Be the first to post an update!</p>
                    </div>
                )}
            </div>
            
            <div className="message-stats">
                <div className="stat-item">
                    <span className="stat-label">Total Posts:</span>
                    <span className="stat-value">{posts.length}</span>
                </div>
            </div>
        </div>
    );
};

export default Messages;