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

  const activeProjects = projects.filter(p => p.status === 'active' || !p.status);
  const inactiveProjects = projects.filter(p => p.status === 'inactive');

  return (
    <section>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h3 className="text-2xl font-semibold text-forge-yellow">{isOwnProfile ? 'My Projects' : 'Projects'}</h3>
        <div className="text-center">
          <div className="text-2xl font-bold text-forge-orange">{projects.length}</div>
          <div className="text-xs text-ash-gray uppercase tracking-wide">Total Projects</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <ProjectPreview key={project._id} project={project} />
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">

          <h4 className="text-xl font-semibold text-silver mb-2">No Projects Yet</h4>
          <p className="text-ash-gray">{isOwnProfile ? 'Start forging your first project to see it here!' : 'This user hasn\'t created any projects yet.'}</p>
        </div>
      )}
    </section>
  );
};

export default ProjectList;