// Dillon Koekemoer u23537052
import React from 'react';
import { Link } from 'react-router-dom';

const ProjectPreview = ({ project }) => {
  const getStatusIcon = (status) => {
    return status === 'checked-in' ? '✅' : '🛠️';
  };

  const getStatusText = (status) => {
    return status === 'checked-in' ? 'Completed' : 'In Progress';
  };

  const formatLanguages = (languages) => {
    if (!languages) return [];
    if (Array.isArray(languages)) return languages;
    return languages.split(',').map(lang => lang.trim());
  };

  return (
    <article className="project-preview-card">
      <div className="project-header">
        <div className="project-title-section">
          <h3 className="project-title">
            <Link to={`/project/${project._id}`} className="project-link">
              {project.title}
            </Link>
          </h3>
          <div className="project-status">
            <div className={`status-badge ${project.status}`}>
              <span className="status-icon" aria-hidden="true">
                {getStatusIcon(project.status)}
              </span>
              <span>{getStatusText(project.status)}</span>
            </div>
            <div className="project-version">
              Version {project.version}
            </div>
          </div>
        </div>
      </div>

      <div className="project-content">
        <p className="project-description">
          {project.description}
        </p>
        
        <div className="project-meta">
          <div className="meta-row">
            <span className="meta-label">Author:</span>
            <span className="meta-value">{project.author}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Language:</span>
            <span className="meta-value">{project.language}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Date:</span>
            <span className="meta-value">
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {project.hashtags && project.hashtags.length > 0 && (
          <div className="project-languages">
            {project.hashtags.map((tag, index) => (
              <span key={index} className="language-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="project-footer">
        
        <div className="project-stats">
          <span className="stat-item">
            <span className="stat-icon" aria-hidden="true">📁</span>
            <span>{project.fileCount || 12} files</span>
          </span>
          <span className="stat-item">
            <span className="stat-icon" aria-hidden="true">⬇️</span>
            <span>{project.downloads || 45} downloads</span>
          </span>
        </div>
       < div className="project-actions">
          <Link 
            to={`/project/${project._id}`} 
            className="btn btn-sm btn-primary"
            aria-label={`View details for ${project.title}`}
          >
            <span aria-hidden="true">📋</span>
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProjectPreview;
