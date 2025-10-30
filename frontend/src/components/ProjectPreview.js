// Dillon Koekemoer u23537052
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { renderTextWithHashtags, renderHashtagBadges } from '../utils/hashtagUtils';

const ProjectPreview = ({ project }) => {
  const navigate = useNavigate();

  const getStatusText = (status) => {
    return status === 'active' ? 'Active' : 'Inactive';
  };

  const formatLanguages = (languages) => {
    if (!languages) return [];
    if (Array.isArray(languages)) return languages;
    return languages.split(',').map(lang => lang.trim());
  };

  const handleHashtagClick = (hashtag) => {
    navigate(`/search?q=${encodeURIComponent(hashtag)}`);
  };

  return (
    <article className="bg-iron-light text-silver rounded-xl shadow-forge p-6 border-2 border-steel-blue transition-all duration-300 hover:shadow-forge-hover hover:-translate-y-2 hover:border-forge-orange hover:bg-iron-gray animate-fade-in-up h-full flex flex-col relative">
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold border ${
            project.status === 'checked-out'
              ? 'bg-green-500/20 text-green-400 border-green-500/50'
              : 'bg-red-500/20 text-red-400 border-red-500/50'
          }`}
          title={project.status === 'checked-out' ? 'Checked Out - Editable' : 'Checked In - Read Only'}
        >
          {project.status === 'checked-out' ? 'OUT' : 'IN'}
        </span>
      </div>

      <div className="mb-6">
        <div className="mb-4 pr-10">
          <h3 className="text-xl font-sans font-bold text-forge-yellow hover:text-forge-orange transition-colors leading-tight">
            <Link to={`/project/${project._id}`}>
              {project.name}
            </Link>
          </h3>
        </div>
        <div className="text-sm text-forge-orange font-medium mb-4">
          Version {project.version}
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <p className="text-ash-gray text-sm leading-relaxed">
          {renderTextWithHashtags(project.description, handleHashtagClick)}
        </p>

        <div className="bg-iron-gray/50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-silver font-semibold text-sm">Type:</span>
            <span className="text-forge-yellow text-sm font-medium">{project.type}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-silver font-semibold text-sm">Created:</span>
            <span className="text-ash-gray text-sm">
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {project.hashtags && project.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {renderHashtagBadges(project.hashtags, handleHashtagClick)}
          </div>
        )}

        {project.languages && project.languages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(project.languages) ? project.languages : [project.languages]).map((lang, index) => (
              <span key={index} className="bg-forge-orange/20 text-forge-orange px-3 py-1 rounded-full text-xs font-semibold border border-forge-orange/30 transition-all duration-300 hover:bg-forge-orange hover:text-white hover:scale-105">
                {lang}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-ash-gray/20">
        <Link 
          to={`/project/${project._id}`} 
          className="w-full px-6 py-3 rounded-xl text-white font-semibold bg-gradient-fire shadow-forge transition-all duration-300 hover:shadow-forge-hover hover:-translate-y-1 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          aria-label={`View details for ${project.name}`}
        >
          View Project
        </Link>
      </div>
    </article>
  );
};

export default ProjectPreview;
