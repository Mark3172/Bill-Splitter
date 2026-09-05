const skills = {
  Design: ['Figma', 'Wireframing', 'Prototyping', 'Accessibility Design', 'Typography', 'Color Theory'],
  Development: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Vite', 'Git', 'Java'],
  Other: ['User Research', 'Usability Testing', 'SEO', 'Project Management'],
};

const highlights = [
  {
    title: 'Accessibility-first design',
    text: 'I specialize in digital products for diverse users, including apps designed for neurodivergent and dyslexic audiences.',
  },
  {
    title: 'J.P. Morgan Chase — Advanced Software Engineering (Forage)',
    text: 'Completed the virtual engineering program: Java, Spring Boot, Kafka, and REST API development.',
  },
  {
    title: 'AIESEC cross-cultural experience',
    text: 'Internships in Myanmar developing communication, leadership, and project management across cultures.',
  },
];

const About = () => {
  return (
    <section id="about" className="section about-section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">About</span>
          <h2 className="section-title">Designer who codes</h2>
        </div>

        <div className="about-grid">
          <div className="about-intro">
            <div className="about-photo">
              <img
                src="/profile-photo.jpeg"
                alt="Myo Set Paing"
                className="profile-photo"
                loading="lazy"
              />
            </div>
            <div className="about-text">
              <p>
                I&apos;m a UI/UX designer and front-end developer who cares about the people on
                the other side of the screen. I move comfortably between Figma and code —
                researching, prototyping, and then shipping the real thing in React and
                TypeScript.
              </p>
              <p>
                My favorite problems are accessibility problems: I&apos;ve designed reading
                tools for dyslexic users, conversational AI for students, and fintech utilities
                that make everyday money moments simpler.
              </p>
              <p>
                I&apos;m currently open to roles in product design, front-end development, or
                anywhere the two meet.
              </p>
            </div>

            <ul className="highlight-list">
              {highlights.map((h) => (
                <li key={h.title} className="highlight-item">
                  <h4>{h.title}</h4>
                  <p>{h.text}</p>
                </li>
              ))}
            </ul>
          </div>

          <aside className="skills-panel">
            <h3 className="skills-title">Skills &amp; Tools</h3>
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="skill-category">
                <h4>{category}</h4>
                <div className="skill-items">
                  {items.map((skill) => (
                    <span key={skill} className="skill-item">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
};

export default About;
