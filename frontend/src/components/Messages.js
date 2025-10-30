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
            <div className="text-ash-gray text-center py-8">
                Loading activity...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {posts.length > 0 ? (
                posts.map(post => {
                    const user = users[post.userId];
                    const timeAgo = new Date(post.createdAt).toLocaleDateString();
                    
                    return (
                        <div key={post._id} className="bg-iron-light rounded-xl p-6 border border-steel-blue/30 transition-all duration-300 hover:border-forge-orange/50">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-fire text-white flex items-center justify-center font-semibold text-sm">
                                        {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-forge-yellow font-semibold">{user?.name || 'Unknown User'}</span>
                                            <span className="text-ash-gray text-sm">posted</span>
                                        </div>
                                        <div className="text-ash-gray text-xs">
                                            {timeAgo}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-silver leading-relaxed mb-4">
                                {post.content}
                            </div>
                            {post.hashtags && post.hashtags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {post.hashtags.map(tag => (
                                        <span key={tag} className="bg-forge-orange/20 text-forge-orange px-3 py-1 rounded-full text-xs font-semibold border border-forge-orange/30">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })
            ) : (
                <div className="text-center py-12 text-ash-gray">
                    <p className="text-lg">No activity yet</p>
                    <p className="text-sm">Project updates will appear here</p>
                </div>
            )}
            
            {posts.length > 0 && (
                <div className="bg-iron-gray/50 rounded-lg p-4 flex justify-between items-center">
                    <span className="text-ash-gray text-sm">Total Posts:</span>
                    <span className="text-forge-yellow font-semibold">{posts.length}</span>
                </div>
            )}
        </div>
    );
};

export default Messages;