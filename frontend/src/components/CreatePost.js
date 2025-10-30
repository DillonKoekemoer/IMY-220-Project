// Dillon Koekemoer u23537052
import React, { useState } from 'react';
import { postsAPI } from '../services/api';

const CreatePost = ({ currentUser, projectId, onPostCreated }) => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await postsAPI.create({
                content: content.trim(),
                userId: currentUser._id,
                projectId: projectId,
                createdAt: new Date().toISOString()
            });
            
            setContent('');
            if (onPostCreated) onPostCreated();
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-iron-light rounded-xl p-6 border-2 border-steel-blue">
            <h4 className="text-lg font-semibold text-forge-yellow mb-4"> Share an Update</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-iron-gray text-silver border border-ash-gray focus:border-forge-orange focus:ring-4 focus:ring-forge-orange/20 focus:outline-none placeholder-ash-gray transition-all duration-300 resize-none disabled:opacity-50"
                        rows="3"
                        placeholder="Share what you're working on..."
                        disabled={isSubmitting}
                    />
                </div>
                <button 
                    type="submit" 
                    className="px-6 py-3 rounded-xl text-white font-semibold bg-gradient-fire shadow-forge transition-all duration-300 hover:shadow-forge-hover hover:-translate-y-1 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={!content.trim() || isSubmitting}
                >
                    {isSubmitting ? '⏳ Posting...' : ' Post Update'}
                </button>
            </form>
        </div>
    );
};

export default CreatePost;