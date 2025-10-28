// Dillon Koekemoer u23537052
import React from 'react';
import { Link } from 'react-router-dom';

const ProfilePreview = ({ user }) => {
    const getProfileImageStyle = (picture) => {
        if (!picture) {
            return {
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
            };
        }

        // Check if it's a placeholder
        if (picture.startsWith('placeholder-')) {
            const color = picture.replace('placeholder-', '');
            return {
                background: `linear-gradient(135deg, #${color} 0%, #${color}dd 100%)`,
            };
        }

        // It's an uploaded image
        return {
            backgroundImage: `url(http://localhost:3001${picture})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        };
    };

    return (
        <div className="profile-preview card">
            <div
                className="friend-avatar"
                style={getProfileImageStyle(user.profilePicture)}
            >
                {(!user.profilePicture || user.profilePicture.startsWith('placeholder-')) && (
                    <span className="text-white font-bold">
                        {user.firstName?.charAt(0)?.toUpperCase() || user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                )}
            </div>
            <div className="profile-preview-info">
                <Link to={`/profile/${user.id || user._id}`} className="profile-name">
                    {user.firstName} {user.lastName || user.name}
                </Link>
                <p className="profile-username">@{user.username || user.email?.split('@')[0]}</p>
                <p className="profile-bio">{user.bio}</p>
            </div>
        </div>
    );
};

export default ProfilePreview;