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

                <div className="tab-nav">
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
                        <div className="card">
                            <h3>Project Overview</h3>
                            <p>wow so cool</p>
                        </div>
                    )}
                    {activeTab === 'files' && <Files projectId={id} />}
                    {activeTab === 'activity' && <Messages projectId={id} />}
                </div>
            </div>
        </main>
    );
};

export default ProjectPage;