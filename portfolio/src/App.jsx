import { ThemeProvider } from './contexts/ThemeContext.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Projects from './components/Projects.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <ThemeProvider>
      <a href="#projects" className="skip-link">
        Skip to projects
      </a>
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <About />
        <Contact />
      </main>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
