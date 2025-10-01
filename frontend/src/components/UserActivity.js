// Dillon Koekemoer u23537052
import React, { useState, useEffect } from 'react';
import { postsAPI } from '../services/api';

const UserActivity = ({ userId }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                setLoading(true);
                const allPosts = await postsAPI.getAll();
                const userPosts = allPosts.filter(post => post.userId === userId);
                setPosts(userPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (error) {
                console.error('Failed to fetch user posts:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserPosts();
        }
    }, [userId]);

    if (loading) {
        return (
            <div className="card">
                <h3>Recent Activity</h3>
                <div className="loading">Loading activity...</div>
            </div>
        );
    }

    return (
        <div className="card">
            <h3>Recent Activity</h3>
            <div className="activity-list">
                {posts.length > 0 ? (
                    posts.map(post => {
                        const timeAgo = new Date(post.createdAt).toLocaleDateString();
                        
                        return (
                            <div key={post._id} className="activity-item">
                                <div className="activity-icon">💬</div>
                                <div className="activity-content">
                                    <p><strong>Posted:</strong> {post.content}</p>
                                    <span className="activity-time">{timeAgo}</span>
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
                    <div className="no-activity">
                        <p>No recent activity yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserActivity;