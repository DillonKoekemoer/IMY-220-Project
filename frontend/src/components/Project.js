// Dillon Koekemoer u23537052
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../services/api';

const Project = ({ projectId, currentUser, onEdit }) => {
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [projectAuthor, setProjectAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/projects/${projectId}`);
        if (!response.ok) {
          throw new Error('Project not found');
        }
        const data = await response.json();
        setProject(data);
        
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

  if (loading) return <div className="card">Loading project...</div>;
  if (error) return <div className="card">Error: {error}</div>;
  if (!project) return <div className="card">Project not found</div>;

  const isOwner = currentUser?._id === project.userId;

  return (
    <div className="card mb-2">
      <div className="project-header">
        <h2>{project.name}</h2>
        <div className="project-status">
          <span className="status">
            {project.status || 'Active'}
          </span>
        </div>
      </div>

      <div className="project-details">
        <p>{project.description}</p>
        <div className="project-meta">
          <p><strong>Author: </strong> 
            <span 
              onClick={() => projectAuthor?._id && navigate(`/profile/${projectAuthor._id}`)}
              style={{ 
                cursor: projectAuthor?._id ? 'pointer' : 'default',
                color: projectAuthor?._id ? 'var(--accent-primary)' : 'inherit',
                textDecoration: projectAuthor?._id ? 'underline' : 'none'
              }}
            >
              {projectAuthor?.name || 'Loading...'}
            </span>
          </p>
          <p><strong>Type: </strong> {project.type}</p>
          <p><strong>Version: </strong> {project.version}</p>
          <p><strong>Languages: </strong> {Array.isArray(project.languages) ? project.languages.join(', ') : project.languages}</p>
          <p><strong>Created: </strong> {new Date(project.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="project-actions">
        {isOwner && (
          <button className="btn btn-secondary" onClick={onEdit}>
            Edit Project
          </button>
        )}
        {projectAuthor?._id && (
          <button 
            className="btn btn-outline" 
            onClick={() => navigate(`/profile/${projectAuthor._id}`)}
          >
            View Author Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Project;
