import React from 'react';
import ProjectPreview from './ProjectPreview';

const Feed = ({ type, currentUser, searchTerm, sortBy, selectedLanguage }) => {
    // Dummy data with type property
    const dummyProjects = [
        {
            id: 1,
            name: "React Weather App",
            description: "A beautiful weather application built with React and OpenWeather API",
            owner: "John Doe",
            version: "v1.2.0",
            status: "checked-in",
            languages: ["JavaScript", "React", "CSS"],
            image: "/assets/images/weather-app.png",
            type: "local"
        },
        {
            id: 2,
            name: "Python Data Analyzer",
            description: "Data analysis tool for processing large CSV datasets",
            owner: "Jane Smith",
            version: "v2.1.0",
            status: "checked-out",
            languages: ["Python", "Pandas", "NumPy"],
            image: "/assets/images/data-analyzer.png",
            type: "global"
        },
        {
            id: 3,
            name: "Node.js API Server",
            description: "RESTful API server with authentication and database integration",
            owner: "Mike Johnson",
            version: "v1.0.0",
            status: "checked-in",
            languages: ["JavaScript", "Node.js", "Express"],
            image: "/assets/images/api-server.png",
            type: "global"
        },
        {
            id: 4,
            name: "Personal Portfolio",
            description: "A personal portfolio website showcasing projects and skills.",
            owner: "You",
            version: "v3.0.0",
            status: "checked-in",
            languages: ["HTML", "CSS", "JavaScript"],
            image: "/assets/images/portfolio.png",
            type: "local"
        },
        {
            id: 5,
            name: "something something something",
            description: "A beautiful weather application built with React and OpenWeather API",
            owner: "John Doe",
            version: "v1.2.0",
            status: "checked-in",
            languages: ["JavaScript", "React", "CSS"],
            image: "/assets/images/weather-app.png",
            type: "local"
        },
        {
            id: 6,
            name: "React Weather App",
            description: "A beautiful weather application built with React and OpenWeather API",
            owner: "John Doe",
            version: "v1.2.0",
            status: "checked-in",
            languages: ["JavaScript", "React", "CSS"],
            image: "/assets/images/weather-app.png",
            type: "local"
        },
    ];

    // Filter projects by feed type, search term, and language
    let filteredProjects = dummyProjects.filter(project => project.type === type);

    // Apply search filter
    if (searchTerm) {
        filteredProjects = filteredProjects.filter(project =>
            project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Apply language filter
    if (selectedLanguage !== 'all') {
        filteredProjects = filteredProjects.filter(project =>
            project.languages.includes(selectedLanguage)
        );
    }

    // Sort projects
    filteredProjects.sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortBy === 'version') {
            return b.version.localeCompare(a.version); // Reverse for newer versions first
        } else if (sortBy === 'status') {
            return a.status.localeCompare(b.status);
        }
        return 0;
    });

    return (
        <section className="feed">
            {filteredProjects.length > 0 ? (
                filteredProjects.map(project => (
                    <ProjectPreview key={project.id} project={project} />
                ))
            ) : (
                <div className="card text-center">
                    <h3>No projects found</h3>
                    <p>Start by creating your first project or following some users!</p>
                </div>
            )}
        </section>
    );
};

export default Feed;