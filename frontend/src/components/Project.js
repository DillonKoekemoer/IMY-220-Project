// Dillon Koekemoer u23537052
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI, projectsAPI } from '../services/api';
import ProjectImageUpload from './ProjectImageUpload';
import ProjectFileUpload from './ProjectFileUpload';

const Project = ({ projectId, currentUser, onEdit, onProjectLoad }) => {
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [projectAuthor, setProjectAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/projects/${projectId}`);
        if (!response.ok) {
          throw new Error('Project not found');
        }
        const data = await response.json();
        setProject(data);
        if (onProjectLoad) onProjectLoad(data);
        
        // Fetch author details if userId exists
        if (data.userId) {
          try {
            const author = await usersAPI.getById(data.userId);
            setProjectAuthor(author);
          } catch (authorError) {
            console.error('Failed to fetch author:', authorError);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  if (loading) return <div className="bg-gradient-steel text-silver rounded-xl p-8 shadow-forge border-2 border-steel-blue text-center"><div className="text-forge-yellow">Loading project...</div></div>;
  if (error) return <div className="bg-gradient-steel text-silver rounded-xl p-8 shadow-forge border-2 border-forge-red text-center"><div className="text-forge-red">Error: {error}</div></div>;
  if (!project) return <div className="bg-gradient-steel text-silver rounded-xl p-8 shadow-forge border-2 border-steel-blue text-center"><div className="text-ash-gray">Project not found</div></div>;

  const isOwner = currentUser?._id === project.userId;

  const handleDelete = async () => {
    if (!isOwner || deleting) return;

    setDeleting(true);
    try {
      await projectsAPI.delete(projectId);
      navigate('/home');
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete project');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!isOwner || changingStatus) return;

    const newStatus = project.status === 'checked-in' ? 'checked-out' : 'checked-in';
    setChangingStatus(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');

      setProject(prev => ({ ...prev, status: newStatus, lastStatusChange: new Date().toISOString() }));
    } catch (error) {
      console.error('Status toggle error:', error);
      setError('Failed to update project status');
    } finally {
      setChangingStatus(false);
    }
  };

  const handleProjectImageUpload = (newImagePath) => {
    setProject(prev => ({ ...prev, projectImage: newImagePath }));
  };

  const handleFilesUpload = (newFiles) => {
    setProject(prev => ({
      ...prev,
      files: [...(prev.files || []), ...newFiles]
    }));
  };

  return (
    <div className="bg-gradient-steel text-silver rounded-xl p-8 shadow-forge border-2 border-forge-orange relative overflow-hidden">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-fire rounded-t-xl"></div>

      <div className="flex flex-col lg:flex-row lg:items-start gap-8">
        {/* Project Image */}
        {project.projectImage && (
          <div className="lg:w-64 flex-shrink-0">
            <img
              src={`http://localhost:3001${project.projectImage}`}
              alt={project.name}
              className="w-full h-48 object-cover rounded-lg border-2 border-forge-orange shadow-forge"
            />
          </div>
        )}

        {/* Main Project Info */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl lg:text-4xl font-sans font-bold text-forge-yellow">{project.name}</h2>
                {/* Status Badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  project.status === 'checked-in'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {project.status === 'checked-in' ? '✓ Checked In' : '⚠ Checked Out'}
                </span>
              </div>
              <div className="text-forge-orange font-semibold text-sm">
                Version {project.version}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-ash-gray text-lg leading-relaxed">{project.description}</p>
          </div>

          {/* Project Metadata */}
          <div className="bg-iron-light rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-forge-yellow mb-4">Project Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center py-2 border-b border-ash-gray/20">
                <span className="font-semibold text-silver">Author:</span>
                <span 
                  onClick={() => projectAuthor?._id && navigate(`/profile/${projectAuthor._id}`)}
                  className={`${
                    projectAuthor?._id 
                      ? 'text-forge-orange hover:text-forge-yellow cursor-pointer underline transition-colors' 
                      : 'text-ash-gray'
                  }`}
                >
                  {projectAuthor?.name || 'Loading...'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-ash-gray/20">
                <span className="font-semibold text-silver">Type:</span>
                <span className="text-forge-yellow font-medium">{project.type}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-ash-gray/20">
                <span className="font-semibold text-silver">Created:</span>
                <span className="text-ash-gray">{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-ash-gray/20">
                <span className="font-semibold text-silver">Languages:</span>
                <span className="text-ash-gray text-right">{Array.isArray(project.languages) ? project.languages.join(', ') : project.languages}</span>
              </div>
            </div>
          </div>

          {/* Language Tags */}
          {project.languages && project.languages.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-forge-yellow mb-3">Technologies</h3>
              <div className="flex flex-wrap gap-3">
                {(Array.isArray(project.languages) ? project.languages : [project.languages]).map((lang, index) => (
                  <span key={index} className="bg-forge-orange/20 text-forge-orange px-4 py-2 rounded-full font-semibold border border-forge-orange/30 transition-all duration-300 hover:bg-forge-orange hover:text-white hover:scale-105">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-iron-light rounded-xl p-6 space-y-3">
            <h3 className="text-lg font-semibold text-forge-yellow mb-4">Actions</h3>
            {isOwner && (
              <>
                <button
                  className={`w-full px-6 py-3 rounded-xl font-semibold border-2 transition-all duration-300 hover:-translate-y-0.5 ${
                    project.status === 'checked-in'
                      ? 'text-yellow-400 border-yellow-400 hover:bg-yellow-500 hover:text-white'
                      : 'text-green-400 border-green-400 hover:bg-green-500 hover:text-white'
                  }`}
                  onClick={handleStatusToggle}
                  disabled={changingStatus}
                >
                  {changingStatus ? 'Updating...' : project.status === 'checked-in' ? '📤 Check Out' : '📥 Check In'}
                </button>
                <button
                  className="w-full px-6 py-3 rounded-xl font-semibold bg-transparent text-forge-orange border-2 border-forge-orange transition-all duration-300 hover:bg-forge-orange hover:text-white hover:-translate-y-0.5"
                  onClick={() => setShowImageUpload(true)}
                >
                  🖼️ Upload Image
                </button>
                <button
                  className="w-full px-6 py-3 rounded-xl font-semibold bg-transparent text-forge-yellow border-2 border-forge-yellow transition-all duration-300 hover:bg-forge-yellow hover:text-steel-dark hover:-translate-y-0.5"
                  onClick={() => setShowFileUpload(true)}
                >
                  📁 Upload Files
                </button>
                <button
                  className="w-full px-6 py-3 rounded-xl font-semibold bg-transparent text-forge-orange border-2 border-forge-orange transition-all duration-300 hover:bg-forge-orange hover:text-white hover:-translate-y-0.5"
                  onClick={onEdit}
                >
                  ✏️ Edit Project
                </button>
                <button
                  className="w-full px-6 py-3 rounded-xl font-semibold bg-transparent text-red-400 border-2 border-red-400 transition-all duration-300 hover:bg-red-500 hover:text-white hover:-translate-y-0.5"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  🗑️ Delete Project
                </button>
              </>
            )}
            {projectAuthor?._id && (
              <button
                className="w-full px-6 py-3 rounded-xl font-semibold bg-transparent text-ash-gray border border-ash-gray transition-all duration-300 hover:bg-iron-light hover:border-forge-orange hover:text-forge-orange"
                onClick={() => navigate(`/profile/${projectAuthor._id}`)}
              >
                👤 View Author
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-lg p-4">
          <div className="bg-iron-gray text-silver rounded-xl p-8 max-w-md w-full shadow-forge-hover border-2 border-red-500">
            <h3 className="text-xl font-semibold text-red-400 mb-4">Delete Project</h3>
            <p className="text-ash-gray mb-6">Are you sure you want to delete "{project.name}"? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                className="flex-1 px-6 py-3 rounded-xl font-semibold bg-red-500 text-white transition-all duration-300 hover:bg-red-600 hover:-translate-y-0.5 disabled:opacity-50"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                className="flex-1 px-6 py-3 rounded-xl font-semibold bg-transparent text-ash-gray border border-ash-gray transition-all duration-300 hover:bg-iron-light hover:text-silver"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Image Upload Modal */}
      {showImageUpload && isOwner && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-lg p-4">
          <div className="bg-iron-gray text-silver rounded-xl p-8 max-w-lg w-full shadow-forge-hover border-2 border-forge-orange">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-forge-yellow">Upload Project Image</h3>
              <button
                className="text-2xl text-ash-gray hover:text-forge-red transition-colors"
                onClick={() => setShowImageUpload(false)}
              >
                ×
              </button>
            </div>
            <ProjectImageUpload
              currentImage={project.projectImage}
              projectId={projectId}
              onUploadSuccess={handleProjectImageUpload}
            />
          </div>
        </div>
      )}

      {/* Project Files Upload Modal */}
      {showFileUpload && isOwner && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-lg p-4 overflow-y-auto">
          <div className="bg-iron-gray text-silver rounded-xl p-8 max-w-2xl w-full shadow-forge-hover border-2 border-forge-yellow my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-forge-yellow">Upload Project Files</h3>
              <button
                className="text-2xl text-ash-gray hover:text-forge-red transition-colors"
                onClick={() => setShowFileUpload(false)}
              >
                ×
              </button>
            </div>
            <ProjectFileUpload
              projectId={projectId}
              existingFiles={project.files || []}
              onUploadSuccess={handleFilesUpload}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
