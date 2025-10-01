// Dillon Koekemoer u23537052
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Project from '../components/Project';
import Files from '../components/Files';
import Messages from '../components/Messages';
import EditProject from '../components/EditProject';
import CreatePost from '../components/CreatePost';
import '../styles/projectpage.css';

const ProjectPage = ({ currentUser }) => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [refreshActivity, setRefreshActivity] = useState(0);

    return (
        <main className="container">
            <div className="project-container">
                <Project 
                    projectId={id} 
                    currentUser={currentUser}
                    onEdit={() => setIsEditing(true)}
                />
                
                {isEditing && (
                    <EditProject 
                        projectId={id}
                        onClose={() => setIsEditing(false)}
                        onSave={() => setIsEditing(false)}
                    />
                )}

                <div className="project-nav">
                    <button 
                        className={activeTab === 'overview' ? 'active' : ''}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button 
                        className={activeTab === 'files' ? 'active' : ''}
                        onClick={() => setActiveTab('files')}
                    >
                        Files
                    </button>
                    <button 
                        className={activeTab === 'activity' ? 'active' : ''}
                        onClick={() => setActiveTab('activity')}
                    >
                        Activity
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'overview' && (
                        <div className="project-overview">
                            <div className="overview-content">
                                <h3>Project Overview</h3>
                                <p>View and manage your project details, files, and activity.</p>
                            </div>
                        </div>
                    )}
                    {activeTab === 'files' && (
                        <div>
                            <h3>Project Files</h3>
                            <Files projectId={id} />
                        </div>
                    )}
                    {activeTab === 'activity' && (
                        <div>
                            <h3>Project Activity</h3>
                            <CreatePost 
                                currentUser={currentUser} 
                                projectId={id}
                                onPostCreated={() => setRefreshActivity(prev => prev + 1)}
                            />
                            <Messages key={refreshActivity} projectId={id} />
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default ProjectPage;