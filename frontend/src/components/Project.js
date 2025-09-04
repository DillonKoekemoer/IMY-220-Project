import React from 'react';

const Project = ({ projectId, currentUser, onEdit }) => {
  // Dummy project data for now
  const dummyProject = {
    id: projectId,
    name: "Steel Web Framework",
    description: "A robust web framework forged in the fires of modern development",
    owner: "MasterSmith_John",
    members: ["ApprenticeSmith_Sarah", "JourneymanSmith_Mike"],
    status: "checked-in",
    version: "v2.1.0",
    type: "Web Application",
    languages: ["JavaScript", "React", "Node.js"],
    image: "/assets/images/steel-framework.png",
    createdDate: "2025-08-15"
  };

  const isOwner = currentUser === dummyProject.owner;

  return (
    <div className="card mb-2">
      <div className="project-header">
        <h2>{dummyProject.name}</h2>
        <div className="project-status">
          <span className={`status ${dummyProject.status}`}>
            {dummyProject.status}
          </span>
          <span className="version">{dummyProject.version}</span>
        </div>
      </div>

      <div className="project-details">
        <p>{dummyProject.description}</p>
        <div className="project-meta">
          <p><strong>Owner: </strong> {dummyProject.owner}</p>
          <p><strong>Workers: </strong> {dummyProject.members.join(', ')}</p>
          <p><strong>Type: </strong> {dummyProject.type} </p>
          <p><strong>Languages: </strong> {dummyProject.languages.map(lang => `#${lang}`).join(' ')}</p>
          <p><strong>Date: </strong> {dummyProject.createdDate}</p>
        </div>
      </div>

      {isOwner && (
        <div className="project-actions">
          <button className="btn btn-secondary" onClick={onEdit}>
            Edit Blueprint
          </button>
        </div>
      )}
    </div>
  );
};

export default Project;
