import { useState } from "react";
import { ExternalLink, Github, FolderGit2 } from "lucide-react";

const projects = [
  {
    title: "HEHIPEDS Digital Portal",
    category: "Web Application",
    description: "A school portal concept focused on connecting students and lecturers with digital learning resources, notes and campus information.",
    stack: ["HTML", "CSS", "JavaScript", "Supabase"],
    github: "",
    demo: ""
  },
  {
    title: "DevHire",
    category: "React / API",
    description: "A developer job discovery interface consuming job-listing API data with search, filtering, saved jobs and application links.",
    stack: ["React", "Fetch API", "JavaScript", "CSS"],
    github: "",
    demo: ""
  },
  {
    title: "Forex Trading SPA",
    category: "Frontend Application",
    description: "A single-page trading interface concept developed around a structured dashboard and chart experience.",
    stack: ["Vue.js", "HTML", "CSS", "JavaScript"],
    github: "",
    demo: ""
  },
  {
    title: "Learning Repository",
    category: "Learning",
    description: "A growing collection of daily practice projects covering web fundamentals, JavaScript, Node.js, Git and application development.",
    stack: ["HTML", "CSS", "JS", "Node.js", "Git"],
    github: "",
    demo: ""
  }
];

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", ...new Set(projects.map(project => project.category))];
  const visible = filter === "All" ? projects : projects.filter(project => project.category === filter);

  return (
    <section className="page-section">
      <div className="container">
        <p className="kicker">SELECTED WORK</p>
        <div className="projects-heading">
          <div>
            <h1 className="page-title">Projects that document my journey.</h1>
            <p className="page-lead">A selection of academic, internship and personal projects. More will be added as the learning repository grows.</p>
          </div>
        </div>

        <div className="filter-row">
          {categories.map(category => (
            <button key={category} className={filter === category ? "filter active" : "filter"} onClick={() => setFilter(category)}>
              {category}
            </button>
          ))}
        </div>

        <div className="project-grid">
          {visible.map((project, index) => (
            <article className="project-card" key={project.title}>
              <div className="project-number">0{index + 1}</div>
              <div className="project-icon"><FolderGit2 size={25} /></div>
              <span className="project-category">{project.category}</span>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <div className="stack-list">{project.stack.map(item => <span key={item}>{item}</span>)}</div>
              <div className="project-links">
                {project.github ? <a href={project.github} target="_blank" rel="noreferrer">GitHub <Github size={15} /></a> : <span>GitHub link pending <Github size={15} /></span>}
                {project.demo ? <a href={project.demo} target="_blank" rel="noreferrer">Live demo <ExternalLink size={15} /></a> : <span>Demo link pending <ExternalLink size={15} /></span>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
