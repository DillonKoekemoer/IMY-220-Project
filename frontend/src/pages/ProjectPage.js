// Dillon Koekemoer u23537052
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Project from '../components/Project';
import Files from '../components/Files';
import Messages from '../components/Messages';
import EditProject from '../components/EditProject';
import CreatePost from '../components/CreatePost';
import Collaborators from '../components/Collaborators';


const ProjectPage = ({ currentUser }) => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('files');
    const [isEditing, setIsEditing] = useState(false);
    const [refreshActivity, setRefreshActivity] = useState(0);
    const [project, setProject] = useState(null);

    const isOwner = currentUser && project && currentUser._id === project.userId;

    return (
        <main className="max-w-6xl mx-auto px-8 py-6">
            <div className="space-y-8">
                <Project 
                    projectId={id} 
                    currentUser={currentUser}
                    onEdit={() => setIsEditing(true)}
                    onProjectLoad={setProject}
                />
                
                {isEditing && (
                    <EditProject 
                        projectId={id}
                        onClose={() => setIsEditing(false)}
                        onSave={() => setIsEditing(false)}
                    />
                )}

                <div className="flex gap-2 bg-gradient-metal p-2 rounded-xl shadow-forge border-2 border-steel-blue">
                    <button 
                        className={`flex-1 px-6 py-4 border-none bg-transparent rounded-lg font-semibold cursor-pointer transition-all duration-300 ${
                            activeTab === 'files' 
                                ? 'bg-gradient-fire text-white shadow-forge transform -translate-y-1' 
                                : 'text-ash-gray hover:bg-iron-light hover:text-forge-orange'
                        }`}
                        onClick={() => setActiveTab('files')}
                    >
                        📁 Files
                    </button>
                    <button 
                        className={`flex-1 px-6 py-4 border-none bg-transparent rounded-lg font-semibold cursor-pointer transition-all duration-300 ${
                            activeTab === 'collaborators' 
                                ? 'bg-gradient-fire text-white shadow-forge transform -translate-y-1' 
                                : 'text-ash-gray hover:bg-iron-light hover:text-forge-orange'
                        }`}
                        onClick={() => setActiveTab('collaborators')}
                    >
                        Collaborators
                    </button>
                    <button 
                        className={`flex-1 px-6 py-4 border-none bg-transparent rounded-lg font-semibold cursor-pointer transition-all duration-300 ${
                            activeTab === 'activity' 
                                ? 'bg-gradient-fire text-white shadow-forge transform -translate-y-1' 
                                : 'text-ash-gray hover:bg-iron-light hover:text-forge-orange'
                        }`}
                        onClick={() => setActiveTab('activity')}
                    >
                        💬 Activity
                    </button>
                </div>

                <div className="bg-gradient-steel text-silver rounded-xl p-8 shadow-forge border-2 border-forge-orange">
                    {activeTab === 'files' && (
                        <div>
                            <h3 className="text-2xl font-semibold text-forge-yellow mb-6">📁 Project Files</h3>
                            <Files projectId={id} />
                        </div>
                    )}
                    {activeTab === 'collaborators' && (
                        <div>
                            <Collaborators projectId={id} currentUser={currentUser} isOwner={isOwner} />
                        </div>
                    )}
                    {activeTab === 'activity' && (
                        <div>
                            <h3 className="text-2xl font-semibold text-forge-yellow mb-6">💬 Project Activity</h3>
                            <div className="space-y-6">
                                {isOwner && (
                                    <CreatePost 
                                        currentUser={currentUser} 
                                        projectId={id}
                                        onPostCreated={() => setRefreshActivity(prev => prev + 1)}
                                    />
                                )}
                                <Messages key={refreshActivity} projectId={id} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default ProjectPage;