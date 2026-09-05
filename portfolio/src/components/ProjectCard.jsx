import { FaGithub, FaFigma, FaExternalLinkAlt, FaFileAlt, FaPlay } from 'react-icons/fa';

const ProjectCard = ({ project, onPreview }) => {
  const { links } = project;
  const canPreview = Boolean(links.figma || links.live);

  return (
    <article className="project-card">
      <div className="project-image">
        <img src={project.image} alt={`${project.title} preview`} loading="lazy" />
        {canPreview && (
          <button
            className="preview-overlay"
            onClick={onPreview}
            aria-label={`Watch ${project.title} preview`}
          >
            <span className="preview-play">
              <FaPlay aria-hidden="true" />
            </span>
            <span>Watch it live</span>
          </button>
        )}
      </div>

      <div className="project-body">
        <div className="project-meta">
          <span className="project-category">{project.categoryLabel}</span>
          <span className="project-timeline">{project.timeline}</span>
        </div>

        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>

        <div className="project-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="project-actions">
          {links.figma && (
            <button className="btn btn-small btn-primary" onClick={onPreview}>
              <FaFigma aria-hidden="true" /> Watch Prototype
            </button>
          )}
          {links.live && (
            <a
              className="btn btn-small btn-primary"
              href={links.live}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaExternalLinkAlt aria-hidden="true" /> Live Demo
            </a>
          )}
          {links.github && (
            <a
              className="btn btn-small btn-outline"
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub aria-hidden="true" /> Code
            </a>
          )}
          {links.doc && (
            <a
              className="btn btn-small btn-outline"
              href={links.doc}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFileAlt aria-hidden="true" /> {project.docLabel || 'Case Study'}
            </a>
          )}
        </div>

        <div className="project-tech">
          <span className="tech-label">Tools</span>
          <span className="tech-list">{project.tech.join(' · ')}</span>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
