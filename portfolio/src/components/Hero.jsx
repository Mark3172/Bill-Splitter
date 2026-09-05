import { FaGithub, FaLinkedin, FaEnvelope, FaInstagram, FaArrowDown } from 'react-icons/fa';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-shapes" aria-hidden="true">
        <span className="shape shape-1" />
        <span className="shape shape-2" />
        <span className="shape shape-3" />
        <span className="shape shape-4" />
      </div>
      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="hero-badge">
            <span className="badge-dot" aria-hidden="true" />
            Available for opportunities
          </span>

          <h1 className="hero-title">
            Hi, I&apos;m <span className="accent-text">Myo Set Paing</span>
          </h1>

          <p className="hero-role">UI/UX Designer &amp; Front-End Developer</p>

          <p className="hero-lede">
            I design and build accessible, user-centered digital experiences — from Figma
            prototypes for neurodivergent users to production React and TypeScript apps.
          </p>

          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary">
              View My Work <FaArrowDown aria-hidden="true" />
            </a>
            <a href="#contact" className="btn btn-ghost">
              Get in Touch
            </a>
          </div>

          <div className="social-links">
            <a
              href="https://github.com/Mark3172"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub /> <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/mark3172/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin /> <span>LinkedIn</span>
            </a>
            <a href="mailto:markmyosp@gmail.com" aria-label="Email">
              <FaEnvelope /> <span>Email</span>
            </a>
            <a
              href="https://www.instagram.com/mark_hhh3172/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram /> <span>Instagram</span>
            </a>
          </div>
        </div>

        <div className="hero-card" aria-hidden="true">
          <div className="code-card">
            <div className="code-card-header">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
              <span className="code-card-title">profile.ts</span>
            </div>
            <pre className="code-card-body">
              <code>
                <span className="c-comment">{'// user-centered by default'}</span>
                {'\n'}
                <span className="c-keyword">const</span> <span className="c-var">mark</span> ={' '}
                {'{'}
                {'\n  '}
                <span className="c-prop">role</span>:{' '}
                <span className="c-string">&quot;UI/UX + Front-End&quot;</span>,{'\n  '}
                <span className="c-prop">focus</span>:{' '}
                <span className="c-string">&quot;Accessibility&quot;</span>,{'\n  '}
                <span className="c-prop">stack</span>: [
                <span className="c-string">&quot;Figma&quot;</span>,{' '}
                <span className="c-string">&quot;React&quot;</span>,{' '}
                <span className="c-string">&quot;TS&quot;</span>],{'\n  '}
                <span className="c-prop">shipping</span>: <span className="c-keyword">true</span>
                {'\n'}
                {'}'};
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
