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
        <div className="card">
            <h4>Share an Update</h4>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="form-input"
                        rows="3"
                        placeholder="Share what you're working on..."
                        disabled={isSubmitting}
                    />
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={!content.trim() || isSubmitting}
                >
                    {isSubmitting ? 'Posting...' : 'Post Update'}
                </button>
            </form>
        </div>
    );
};

export default CreatePost;