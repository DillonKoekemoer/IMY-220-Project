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
            <div>
                <h3 className="text-2xl font-semibold text-forge-yellow mb-6">Recent Activity</h3>
                <div className="bg-iron-light rounded-xl p-8 text-center">
                    <div className="text-ash-gray">Loading activity...</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-2xl font-semibold text-forge-yellow mb-6">Recent Activity</h3>
            <div className="space-y-4">
                {posts.length > 0 ? (
                    posts.map(post => {
                        const timeAgo = new Date(post.createdAt).toLocaleDateString();
                        
                        return (
                            <div key={post._id} className="bg-iron-light p-6 rounded-xl border-2 border-steel-blue transition-all duration-300 hover:border-forge-orange hover:bg-iron-gray">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-fire text-white flex items-center justify-center text-lg flex-shrink-0">
                                        💬
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-silver mb-2">
                                            <span className="font-semibold text-forge-orange">Posted:</span> {post.content}
                                        </p>
                                        <div className="text-xs text-ash-gray mb-3">{timeAgo}</div>
                                        {post.hashtags && post.hashtags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {post.hashtags.map(tag => (
                                                    <span key={tag} className="bg-iron-light text-forge-orange px-2 py-1 rounded-lg text-xs font-medium border border-forge-orange transition-all duration-300 hover:bg-forge-orange hover:text-white hover:scale-105">#{tag}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">💭</div>
                        <p className="text-ash-gray">No recent activity yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserActivity;