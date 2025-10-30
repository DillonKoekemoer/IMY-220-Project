// Dillon Koekemoer u23537052
import React, { useState, useEffect } from 'react';
import ProjectPreview from './ProjectPreview';

const ProjectList = ({ userId, isOwnProfile }) => {
  const [createdProjects, setCreatedProjects] = useState([]);
  const [savedProjects, setSavedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('created');

  useEffect(() => {
    const fetchProjects = async () => {
      if (!userId) return;

      try {
        setLoading(true);

        // Fetch all projects
        const response = await fetch('http://localhost:3001/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const allProjects = await response.json();

        // Filter created projects (projects where user is the owner)
        const userCreatedProjects = allProjects.filter(project => project.userId === userId);
        setCreatedProjects(userCreatedProjects);

        // Filter saved/collaborated projects (projects where user is a collaborator but not owner)
        const userSavedProjects = allProjects.filter(project =>
          project.collaborators &&
          project.collaborators.includes(userId) &&
          project.userId !== userId
        );
        setSavedProjects(userSavedProjects);

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
      <section>
        <div className="bg-iron-light rounded-xl p-8 text-center">
          <h3 className="text-xl font-semibold text-forge-yellow">Loading projects...</h3>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <div className="bg-iron-light rounded-xl p-8 text-center">
          <h3 className="text-xl font-semibold text-forge-red">Error loading projects</h3>
          <p className="text-ash-gray">{error}</p>
        </div>
      </section>
    );
  }

  const currentProjects = activeSection === 'created' ? createdProjects : savedProjects;

  return (
    <section>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h3 className="text-2xl font-semibold text-forge-yellow">{isOwnProfile ? 'My Projects' : 'Projects'}</h3>
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-forge-orange">{createdProjects.length}</div>
            <div className="text-xs text-ash-gray uppercase tracking-wide">Created</div>
          </div>
          {isOwnProfile && (
            <div className="text-center">
              <div className="text-2xl font-bold text-forge-yellow">{savedProjects.length}</div>
              <div className="text-xs text-ash-gray uppercase tracking-wide">Saved</div>
            </div>
          )}
        </div>
      </div>

      {/* Section Toggle - Only show for own profile */}
      {isOwnProfile && (
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveSection('created')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeSection === 'created'
                ? 'bg-gradient-fire text-white shadow-forge'
                : 'bg-iron-light text-ash-gray border border-steel-blue hover:border-forge-orange hover:text-forge-orange'
            }`}
          >
            📦 Created Projects ({createdProjects.length})
          </button>
          <button
            onClick={() => setActiveSection('saved')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeSection === 'saved'
                ? 'bg-gradient-fire text-white shadow-forge'
                : 'bg-iron-light text-ash-gray border border-steel-blue hover:border-forge-orange hover:text-forge-orange'
            }`}
          >
            💾 Saved Projects ({savedProjects.length})
          </button>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProjects.map(project => (
          <ProjectPreview key={project._id} project={project} />
        ))}
      </div>

      {/* Empty State */}
      {currentProjects.length === 0 && (
        <div className="text-center py-12 bg-iron-light rounded-xl border-2 border-ash-gray/20">
          <div className="text-6xl mb-4">
            {activeSection === 'created' ? '📦' : '💾'}
          </div>
          <h4 className="text-xl font-semibold text-silver mb-2">
            {activeSection === 'created' ? 'No Projects Created Yet' : 'No Saved Projects Yet'}
          </h4>
          <p className="text-ash-gray">
            {activeSection === 'created'
              ? isOwnProfile
                ? 'Start forging your first project to see it here!'
                : 'This user hasn\'t created any projects yet.'
              : 'Join projects to collaborate and they will appear here!'}
          </p>
        </div>
      )}
    </section>
  );
};

export default ProjectList;
