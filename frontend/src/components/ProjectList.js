// Dillon Koekemoer u23537052
import React, { useState, useEffect } from 'react';
import ProjectPreview from './ProjectPreview';

const ProjectList = ({ userId, isOwnProfile }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const allProjects = await response.json();
        const userProjects = allProjects.filter(project => project.userId === userId);
        setProjects(userProjects);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userId]);

  if (loading) {
    return (
      <section className="project-list">
        <div className="card text-center">
          <h3>Loading projects...</h3>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="project-list">
        <div className="card text-center">
          <h3>Error loading projects</h3>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  const activeProjects = projects.filter(p => p.status === 'active' || !p.status);
  const inactiveProjects = projects.filter(p => p.status === 'inactive');

  return (
    <section className="project-list">
      <div className="project-list-header">
        <h3>{isOwnProfile ? 'My Projects' : 'Projects'}</h3>
        <div className="project-summary">
          <span className="summary-item">
            <span className="summary-count">{projects.length}</span>
            <span className="summary-label">Total Projects</span>
          </span>
          <span className="summary-item">
            <span className="summary-count">{activeProjects.length}</span>
            <span className="summary-label">Active</span>
          </span>
          <span className="summary-item">
            <span className="summary-count">{inactiveProjects.length}</span>
            <span className="summary-label">Inactive</span>
          </span>
        </div>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <ProjectPreview key={project._id} project={project} />
        ))}
      </div>

      {projects.length === 0 && (
        <div className="no-projects">
          <div className="no-projects-icon">🔨</div>
          <h4>No Projects Yet</h4>
          <p>{isOwnProfile ? 'Start forging your first project to see it here!' : 'This user hasn\'t created any projects yet.'}</p>
        </div>
      )}
    </section>
  );
};

export default ProjectList;