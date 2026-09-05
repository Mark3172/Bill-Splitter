import { useState } from 'react';
import { projects, categories } from '../data/projects.js';
import ProjectCard from './ProjectCard.jsx';
import ProjectModal from './ProjectModal.jsx';

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [previewProject, setPreviewProject] = useState(null);

  const visible =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Portfolio</span>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">
            Real work you can explore — watch Figma prototypes right on this page, browse the
            source code, or read the case studies.
          </p>
        </div>

        <div className="filter-tabs" role="tablist" aria-label="Filter projects">
          {categories.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeCategory === cat.id}
              className={`filter-tab ${activeCategory === cat.id ? 'filter-tab-active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
              <span className="filter-count">
                {cat.id === 'all'
                  ? projects.length
                  : projects.filter((p) => p.category === cat.id).length}
              </span>
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {visible.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onPreview={() => setPreviewProject(project)}
            />
          ))}
        </div>
      </div>

      {previewProject && (
        <ProjectModal project={previewProject} onClose={() => setPreviewProject(null)} />
      )}
    </section>
  );
};

export default Projects;
