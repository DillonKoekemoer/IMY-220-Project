// Dillon Koekemoer u23537052
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usersAPI } from '../services/api';
import Profile from '../components/Profile';
import EditProfile from '../components/EditProfile';
import ProjectList from '../components/ProjectList';
import FriendsList from '../components/FriendsList';
import CreateProject from '../components/CreateProject';
import UserActivity from '../components/UserActivity';


const ProfilePage = ({ profileId, currentUser, onLogout, onUserUpdate }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('projects');
    const [isEditing, setIsEditing] = useState(false);
    const [profileUser, setProfileUser] = useState(null);
    
    const id = profileId || currentUser?._id;
    const isOwnProfile = currentUser && String(currentUser._id) === String(id);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await usersAPI.getById(id);
                setProfileUser(user);
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };
        fetchUser();
    }, [id]);

    const handleProfileSave = (updatedData) => {
        setIsEditing(false);
        if (isOwnProfile && onUserUpdate) {
            onUserUpdate({ ...currentUser, ...updatedData });
        }
        setProfileUser(prev => ({ ...prev, ...updatedData }));
    };

    const handleProjectSave = (projectData) => {
        console.log('Project created:', projectData);
        setActiveTab('projects'); 
    };

    // Handle logout and navigate to splash page
    const handleLogoutClick = () => {
        onLogout();
        navigate('');
    };

    // Handle delete profile with confirmation
    const handleDeleteProfile = async () => {
        if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
            try {
                await usersAPI.delete(currentUser._id);
                onLogout();
                navigate('/');
            } catch (error) {
                console.error('Failed to delete profile:', error);
                alert('Failed to delete profile. Please try again.');
            }
        }
    };

    return (
        <main className="max-w-6xl mx-auto px-8 py-6">
            <div className="space-y-8">
                {/* Profile Component */}
                {profileUser && (
                    <Profile 
                        userId={id} 
                        currentUser={currentUser}
                        profileUser={profileUser}
                        isOwnProfile={isOwnProfile}
                        onEdit={() => setIsEditing(true)}
                    />
                )}
                
                {/* Edit Profile Modal */}
                {isEditing && isOwnProfile && profileUser && (
                    <EditProfile 
                        user={profileUser}
                        onClose={() => setIsEditing(false)}
                        onSave={handleProfileSave}
                    />
                )}

                {/* Tab Navigation */}
                <div className="flex gap-2 bg-gradient-metal p-2 rounded-xl shadow-forge border-2 border-steel-blue flex-wrap">
                    <button 
                        className={`flex-1 px-6 py-4 border-none bg-transparent rounded-lg font-semibold cursor-pointer transition-all duration-300 min-w-[120px] ${
                            activeTab === 'projects' 
                                ? 'bg-gradient-fire text-white shadow-forge transform -translate-y-1' 
                                : 'text-ash-gray hover:bg-iron-light hover:text-forge-orange'
                        }`}
                        onClick={() => setActiveTab('projects')}
                    >
                        Projects
                    </button>
                    <button 
                        className={`flex-1 px-6 py-4 border-none bg-transparent rounded-lg font-semibold cursor-pointer transition-all duration-300 min-w-[120px] ${
                            activeTab === 'friends' 
                                ? 'bg-gradient-fire text-white shadow-forge transform -translate-y-1' 
                                : 'text-ash-gray hover:bg-iron-light hover:text-forge-orange'
                        }`}
                        onClick={() => setActiveTab('friends')}
                    >
                        Friends
                    </button>
                    {isOwnProfile && (
                        <>
                            <button 
                                className={`flex-1 px-6 py-4 border-none bg-transparent rounded-lg font-semibold cursor-pointer transition-all duration-300 min-w-[120px] ${
                                    activeTab === 'create-project' 
                                        ? 'bg-gradient-fire text-white shadow-forge transform -translate-y-1' 
                                        : 'text-ash-gray hover:bg-iron-light hover:text-forge-orange'
                                }`}
                                onClick={() => setActiveTab('create-project')}
                            >
                                Create Project
                            </button>
                            <button 
                                className={`flex-1 px-6 py-4 border-none bg-transparent rounded-lg font-semibold cursor-pointer transition-all duration-300 min-w-[120px] ${
                                    activeTab === 'activity' 
                                        ? 'bg-gradient-fire text-white shadow-forge transform -translate-y-1' 
                                        : 'text-ash-gray hover:bg-iron-light hover:text-forge-orange'
                                }`}
                                onClick={() => setActiveTab('activity')}
                            >
                                My Activity
                            </button>
                        </>
                    )}
                </div>

                {/* Tab Content */}
                <div className="bg-gradient-steel text-silver rounded-xl p-8 shadow-forge border-2 border-forge-orange">
                    {activeTab === 'projects' && (
                        <div>
                            <ProjectList userId={id} isOwnProfile={isOwnProfile} />
                        </div>
                    )}
                    
                    {activeTab === 'friends' && (
                        <div>
                            <FriendsList userId={id} />
                        </div>
                    )}
                    
                    {activeTab === 'create-project' && isOwnProfile && (
                        <div>
                            <CreateProject 
                                onSave={handleProjectSave}
                                isModal={false}
                                currentUser={currentUser}
                            />
                        </div>
                    )}
                    
                    {activeTab === 'activity' && isOwnProfile && (
                        <div>
                            <UserActivity userId={id} />
                        </div>
                    )}
                </div>
                
                {/* Profile Actions - only show for own profile */}
                {isOwnProfile && (
                    <div className="flex gap-4 justify-center flex-wrap">
                        <button 
                            className="px-8 py-4 rounded-xl font-semibold bg-transparent text-red-500 border-2 border-red-500 transition-all duration-300 hover:bg-red-500 hover:text-white hover:-translate-y-0.5"
                            onClick={handleDeleteProfile}
                        >
                            Delete Profile
                        </button>
                        <button 
                            className="px-8 py-4 rounded-xl font-semibold bg-transparent text-ash-gray border border-ash-gray transition-all duration-300 hover:bg-iron-light hover:border-forge-orange hover:text-forge-orange"
                            onClick={handleLogoutClick}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
};

export default ProfilePage;
