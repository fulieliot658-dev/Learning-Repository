import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, Github, Code2, Palette, Server } from "lucide-react";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-glow glow-one"></div>
        <div className="hero-glow glow-two"></div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="kicker">STUDENT DEVELOPER · CAMEROON</p>
            <h1>Building digital experiences with <em>curiosity</em> and purpose.</h1>
            <p className="hero-text">
              I’m <strong>Fuli Eliot Nchongtakang</strong>, a student of Heritage Higher Institute of Peace and Development Studies (HEHIPEDS), passionate about web development, design and technology.
            </p>
            <div className="hero-actions">
              <Link to="/projects" className="button primary">Explore my work <ArrowUpRight size={17} /></Link>
              <Link to="/contact" className="button secondary">Get in touch</Link>
            </div>
            <div className="hero-meta">
              <span><span className="status-dot"></span> Available for opportunities</span>
              <span>Based in Cameroon</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="portrait-card">
              <div className="portrait-placeholder">
                <div className="portrait-letter">FE</div>
                <span>YOUR PHOTO</span>
              </div>
              <div className="floating-card card-top">
                <Code2 size={18} />
                <span>Frontend<br /><b>Development</b></span>
              </div>
              <div className="floating-card card-bottom">
                <span className="tiny-label">CURRENT FOCUS</span>
                <b>React · JavaScript · UI</b>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="marquee-section">
        <div className="container tech-strip">
          <span>ReactJS</span><span>JavaScript</span><span>HTML & CSS</span><span>Responsive Design</span><span>Git & GitHub</span><span>Design Thinking</span>
        </div>
      </section>

      <section className="section intro-section">
        <div className="container two-col">
          <div>
            <p className="section-label">A LITTLE ABOUT ME</p>
            <h2>Learning, building, and turning ideas into working interfaces.</h2>
          </div>
          <div>
            <p className="large-muted">
              My development journey combines academic learning with practical project work. During my internship at TIC Foundation (Tech Innovation Center Foundation), I worked through demanding projects and strengthened my understanding of Enterprise Design Thinking, responsive design, interactive design and modern web development.
            </p>
            <Link to="/about" className="text-link">More about me <ArrowUpRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="section dark-section">
        <div className="container">
          <div className="section-heading-row">
            <div>
              <p className="section-label light">WHAT I WORK WITH</p>
              <h2>Skills & interests</h2>
            </div>
            <Link to="/contact" className="button outline-light">Work with me <ArrowUpRight size={16} /></Link>
          </div>
          <div className="skills-grid">
            <div className="skill-card"><Code2 /><h3>Development</h3><p>ReactJS, JavaScript, HTML, CSS and practical frontend development.</p></div>
            <div className="skill-card"><Palette /><h3>Design</h3><p>Responsive interfaces, interactive design and user-focused experiences.</p></div>
            <div className="skill-card"><Server /><h3>Tools & Workflow</h3><p>Git, GitHub, APIs, project organization and iterative development.</p></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container cta-banner">
          <div>
            <p className="section-label">LET'S CONNECT</p>
            <h2>Have an idea worth building?</h2>
          </div>
          <Link to="/contact" className="button primary">Start a conversation <ArrowUpRight size={17} /></Link>
        </div>
      </section>
    </>
  );
}
