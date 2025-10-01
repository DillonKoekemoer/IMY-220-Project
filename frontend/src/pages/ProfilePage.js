// Dillon Koekemoer u23537052
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usersAPI } from '../services/api';
import Profile from '../components/Profile';
import EditProfile from '../components/EditProfile';
import ProjectList from '../components/ProjectList';
import FriendsList from '../components/FriendsList';
import CreateProject from '../components/CreateProject';
import '../styles/profilepage.css';

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

    return (
        <main className="container">
            <div className="profile-container">
                

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
                <div className="tab-nav">
                    <button 
                        className={activeTab === 'projects' ? 'active' : ''} 
                        onClick={() => setActiveTab('projects')}
                    >
                        Projects
                    </button>
                    <button 
                        className={activeTab === 'friends' ? 'active' : ''} 
                        onClick={() => setActiveTab('friends')}
                    >
                        Friends
                    </button>
                    {isOwnProfile && (
                        <>
                            <button 
                                className={activeTab === 'create-project' ? 'active' : ''} 
                                onClick={() => setActiveTab('create-project')}
                            >
                                Create Project
                            </button>
                            <button 
                                className={activeTab === 'activity' ? 'active' : ''} 
                                onClick={() => setActiveTab('activity')}
                            >
                                My Activity
                            </button>
                        </>
                    )}
                </div>

                {/* Tab Content */}
                <div className="tab-content">
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
                        <div className="create-project-section">
                            <CreateProject 
                                onSave={handleProjectSave}
                                isModal={false}
                            />
                        </div>
                    )}
                    
                    {activeTab === 'activity' && isOwnProfile && (
                        <div className="activity-section">
                            <div className="card">
                                <h3>Recent Activity</h3>
                                <div className="activity-list">
                                    <div className="activity-item">
                                        <div className="activity-icon">📝</div>
                                        <div className="activity-content">
                                            <p><strong>Project Updated:</strong> Updated README.md in "CodeForge Project"</p>
                                            <span className="activity-time">2 hours ago</span>
                                        </div>
                                    </div>
                                    <div className="activity-item">
                                        <div className="activity-icon">🚀</div>
                                        <div className="activity-content">
                                            <p><strong>New Project:</strong> Created "React Dashboard"</p>
                                            <span className="activity-time">1 day ago</span>
                                        </div>
                                    </div>
                                    <div className="activity-item">
                                        <div className="activity-icon">👥</div>
                                        <div className="activity-content">
                                            <p><strong>New Friend:</strong> Connected with Jane Smith</p>
                                            <span className="activity-time">3 days ago</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* Profile Actions - only show for own profile */}
                {isOwnProfile && (
                    <div className="profile-actions">
                        <button 
                            className="btn btn-secondary" 
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </button>
                        <button 
                            className="btn btn-outline" 
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
