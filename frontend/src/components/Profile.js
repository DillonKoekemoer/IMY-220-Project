// Dillon Koekemoer u23537052
import React from 'react';
import UserProfile from './UserProfile';

const Profile = ({ userId, currentUser, isOwnProfile, onEdit }) => {
    if (isOwnProfile && onEdit) {
        return (
            <div className="space-y-8">
                <UserProfile 
                    userId={userId} 
                    currentUser={currentUser} 
                    isOwnProfile={isOwnProfile} 
                />
                <div className="text-center">
                    <button 
                        className="px-8 py-4 rounded-xl text-white font-semibold bg-gradient-fire shadow-forge transition-all duration-300 hover:shadow-forge-hover hover:-translate-y-1 hover:scale-105 active:scale-95"
                        onClick={onEdit}
                    >
                        Edit Profile
                    </button>
                </div>
            </div>
        );
    }

    return (
        <UserProfile 
            userId={userId} 
            currentUser={currentUser} 
            isOwnProfile={isOwnProfile} 
        />
    );
};

export default Profile;