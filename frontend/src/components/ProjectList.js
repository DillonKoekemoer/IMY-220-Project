import React from 'react';
import ProjectPreview from './ProjectPreview';

const ProjectList = ({ userId }) => {
  const dummyUserProjects = [
    {
      id: 1,
      name: "Personal Portfolio",
      description: "A modern, responsive portfolio website showcasing my development skills and projects. Built with React and featuring smooth animations and mobile-first design.",
      owner: "You",
      version: "v1.2.0",
      status: "checked-in",
      type: "Web Application",
      languages: ["JavaScript", "React", "CSS"],
      fileCount: 24,
      downloads: 89
    },
    {
      id: 4,
      name: "Task Management App",
      description: "A comprehensive productivity application for managing daily tasks, projects, and team collaboration. Features real-time updates and intuitive drag-and-drop interface.",
      owner: "You", 
      version: "v0.8.2",
      status: "checked-out",
      type: "Full-Stack Application",
      languages: ["JavaScript", "Vue.js", "Node.js", "MongoDB"],
      fileCount: 47,
      downloads: 156
    },
    {
      id: 7,
      name: "E-Commerce Platform",
      description: "A scalable e-commerce solution with integrated payment processing, inventory management, and customer analytics dashboard.",
      owner: "You",
      version: "v2.1.0", 
      status: "checked-in",
      type: "Web Application",
      languages: ["TypeScript", "React", "Express", "PostgreSQL"],
      fileCount: 73,
      downloads: 234
    }
  ];

  const checkedInProjects = dummyUserProjects.filter(p => p.status === 'checked-in');
  const checkedOutProjects = dummyUserProjects.filter(p => p.status === 'checked-out');

  return (
    <section className="project-list">
      <div className="project-list-header">
        <h3>My Projects</h3>
        <div className="project-summary">
          <span className="summary-item">
            <span className="summary-count">{dummyUserProjects.length}</span>
            <span className="summary-label">Total Projects</span>
          </span>
          <span className="summary-item">
            <span className="summary-count">{checkedInProjects.length}</span>
            <span className="summary-label">Available</span>
          </span>
          <span className="summary-item">
            <span className="summary-count">{checkedOutProjects.length}</span>
            <span className="summary-label">In Development</span>
          </span>
        </div>
      </div>

      <div className="projects-grid">
        {dummyUserProjects.map(project => (
          <ProjectPreview key={project.id} project={project} />
        ))}
      </div>

      {dummyUserProjects.length === 0 && (
        <div className="no-projects">
          <div className="no-projects-icon">🔨</div>
          <h4>No Projects Yet</h4>
          <p>Start forging your first project to see it here!</p>
          <button className="btn btn-primary">
            <span aria-hidden="true">➕</span>
            Create New Project
          </button>
        </div>
      )}
    </section>
  );
};

export default ProjectList;