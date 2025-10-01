// Dillon Koekemoer u23537052
import React from 'react';
import { Link } from 'react-router-dom';

const ProjectPreview = ({ project }) => {
  const getStatusIcon = (status) => {
    return status === 'active' ? '✅' : '🛠️';
  };

  const getStatusText = (status) => {
    return status === 'active' ? 'Active' : 'Inactive';
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
              {project.name}
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
            <span className="meta-label">Type:</span>
            <span className="meta-value">{project.type}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Languages:</span>
            <span className="meta-value">{Array.isArray(project.languages) ? project.languages.join(', ') : project.languages}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Created:</span>
            <span className="meta-value">
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {project.languages && project.languages.length > 0 && (
          <div className="project-languages">
            {(Array.isArray(project.languages) ? project.languages : [project.languages]).map((lang, index) => (
              <span key={index} className="language-tag">
                {lang}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="project-footer">
        <div className="project-actions">
          <Link 
            to={`/project/${project._id}`} 
            className="btn btn-sm btn-primary"
            aria-label={`View details for ${project.name}`}
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
