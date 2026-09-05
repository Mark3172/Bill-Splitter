import { useEffect } from 'react';
import { FaTimes, FaExternalLinkAlt } from 'react-icons/fa';

const figmaEmbedUrl = (url) =>
  `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;

/*
  In-page preview so visitors can watch a project without leaving the site.
  Figma prototypes use Figma's official embed player; live sites load in an iframe.
*/
const ProjectModal = ({ project, onClose }) => {
  const src = project.links.figma
    ? figmaEmbedUrl(project.links.figma)
    : project.links.live;
  const external = project.links.figma || project.links.live;

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} preview`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{project.title}</h3>
          <div className="modal-header-actions">
            <a
              className="btn btn-small btn-outline"
              href={external}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaExternalLinkAlt aria-hidden="true" /> Open in new tab
            </a>
            <button className="icon-btn" onClick={onClose} aria-label="Close preview">
              <FaTimes />
            </button>
          </div>
        </div>
        <div className="modal-body">
          <iframe
            src={src}
            title={`${project.title} interactive preview`}
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
