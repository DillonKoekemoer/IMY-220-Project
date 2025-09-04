// Dillon Koekemoer u23537052
import React from 'react';
import { useParams } from 'react-router-dom';
import TempProfilePic from '../assets/thething.png';



const Profile = ({ userId, currentUser, isOwnProfile, onEdit }) => {
    // Dummy profile data
    const profileData = {
        id: userId,
        firstName: "Dillon",
        lastName: "Koekemoer",
        username: "dkoekemoer",
        email: "dillon.koek@exampleemail.com",
        bio: "Full-stack developer passionate about creating amazing user experiences",
        avatar: TempProfilePic,
        joinDate: "January 2024",
        location: "South Africa",
        website: "https://dillkoek.dev"
    };

    return (
        <div className="profile-header">
            <div className="profile-info">
                <img 
                    src={profileData.avatar} 
                    alt={`${profileData.firstName} ${profileData.lastName}`}
                    className="personal-profile-avatar"
                />
                <div className="profile-details">
                    <h2>{profileData.firstName} {profileData.lastName}</h2>
                    <p className="profile-username">@{profileData.username}</p>
                    <p className="profile-bio">{profileData.bio}</p>
                    <div className="profile-meta">
                        <span>📍 {profileData.location}</span>
                        <span>📅 Joined {profileData.joinDate}</span>
                        <span>🌐 {profileData.website}</span>
                    </div>
                    {isOwnProfile && (
                        <button className="btn btn-secondary mt-2" onClick={onEdit}>
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;