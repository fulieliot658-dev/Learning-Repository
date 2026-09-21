import { ArrowUpRight, GraduationCap, BriefcaseBusiness, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <section className="page-section">
      <div className="container narrow-page">
        <p className="kicker">ABOUT ME</p>
        <h1 className="page-title">Student. Developer. Continuous learner.</h1>
        <p className="page-lead">
          I am Fuli Eliot Nchongtakang, a student at Heritage Higher Institute of Peace and Development Studies (HEHIPEDS), where I am developing my academic and technical foundation while building practical digital projects.
        </p>

        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-icon"><GraduationCap /></div>
            <div><span>EDUCATION</span><h3>Heritage Higher Institute of Peace and Development Studies</h3><p>Building knowledge across academic studies while developing practical technology skills.</p></div>
          </div>
          <div className="timeline-item">
            <div className="timeline-icon"><BriefcaseBusiness /></div>
            <div><span>INTERNSHIP</span><h3>TIC Foundation · Tech Innovation Center Foundation</h3><p>A practical internship experience involving full-stack projects, demanding schedules, Enterprise Design Thinking, responsive design, interactive design and the art of dialogue.</p></div>
          </div>
          <div className="timeline-item">
            <div className="timeline-icon"><Lightbulb /></div>
            <div><span>APPROACH</span><h3>Learn by building</h3><p>I enjoy taking concepts from class or practice sessions and turning them into usable interfaces and applications.</p></div>
          </div>
        </div>

        <div className="quote-card">
          <p>“The goal is not simply to write code, but to understand a problem, design a useful solution, and keep improving it.”</p>
        </div>

        <Link to="/projects" className="text-link">See my projects <ArrowUpRight size={16} /></Link>
      </div>
    </section>
  );
}
