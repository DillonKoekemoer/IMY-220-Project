// Dillon Koekemoer u23537052
import React from 'react';
import { Link } from 'react-router-dom';

const ProfilePreview = ({ user }) => {
    return (
        <div className="profile-preview card">
            <img 
                src={user.avatar || '/assets/images/default-avatar.png'} 
                alt={`${user.firstName} ${user.lastName}`}
                className="friend-avatar"
            />
            <div className="profile-preview-info">
                <Link to={`/profile/${user.id}`} className="profile-name">
                    {user.firstName} {user.lastName}
                </Link>
                <p className="profile-username">@{user.username}</p>
                <p className="profile-bio">{user.bio}</p>
            </div>
        </div>
    );
};

export default ProfilePreview;