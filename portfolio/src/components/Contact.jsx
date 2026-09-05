import { FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';
import Reveal from './Reveal.jsx';

const Contact = () => {
  return (
    <section id="contact" className="section contact-section">
      <Reveal className="container contact-inner">
        <span className="section-eyebrow">Contact</span>
        <h2 className="section-title">Let&apos;s build something together</h2>
        <p className="contact-text">
          I&apos;m open to new opportunities and collaborations. Whether you have a project in
          mind or just want to say hi, my inbox is always open.
        </p>
        <div className="contact-buttons">
          <a href="mailto:markmyo6@gmail.com" className="btn btn-primary">
            <FaEnvelope aria-hidden="true" /> markmyo6@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/mark3172/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            <FaLinkedin aria-hidden="true" /> LinkedIn
          </a>
          <a
            href="https://github.com/Mark3172"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            <FaGithub aria-hidden="true" /> GitHub
          </a>
        </div>
      </Reveal>
    </section>
  );
};

export default Contact;
