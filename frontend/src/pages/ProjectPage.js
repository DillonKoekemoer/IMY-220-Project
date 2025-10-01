// Dillon Koekemoer u23537052
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Project from '../components/Project';
import Files from '../components/Files';
import Messages from '../components/Messages';
import EditProject from '../components/EditProject';
import '../styles/projectpage.css';

const ProjectPage = ({ currentUser }) => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);

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
                                <p>This project contains code snippets and examples for developers to learn and implement in their own projects. The codebase is well-documented and follows industry best practices.</p>
                                <h4>Features</h4>
                                <ul>
                                    <li>Clean, readable code structure</li>
                                    <li>Comprehensive documentation</li>
                                    <li>Easy to integrate and customize</li>
                                    <li>Regular updates and maintenance</li>
                                </ul>
                            </div>
                            <div className="overview-sidebar">
                                <div className="project-stats">
                                    <div className="stat-card">
                                        <div className="stat-value">12</div>
                                        <div className="stat-label">Files</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-value">45</div>
                                        <div className="stat-label">Downloads</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-value">3</div>
                                        <div className="stat-label">Contributors</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-value">8</div>
                                        <div className="stat-label">Stars</div>
                                    </div>
                                </div>
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
                            <Messages projectId={id} />
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default ProjectPage;