import { useState } from "react";
import { Mail, Github, Linkedin, Send } from "lucide-react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  function submit(event) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <section className="page-section">
      <div className="container contact-grid">
        <div>
          <p className="kicker">CONTACT</p>
          <h1 className="page-title">Let's build something useful.</h1>
          <p className="page-lead">
            Whether it is a project, collaboration, internship opportunity or simply a conversation about technology, feel free to reach out.
          </p>
          <div className="contact-details">
            <a href="mailto:your-email@example.com"><Mail /> your-email@example.com</a>
            <a href="https://github.com/" target="_blank" rel="noreferrer"><Github /> GitHub</a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer"><Linkedin /> LinkedIn</a>
          </div>
        </div>

        <form className="contact-form" onSubmit={submit}>
          <label>Name<input required type="text" placeholder="Your name" /></label>
          <label>Email<input required type="email" placeholder="you@example.com" /></label>
          <label>Message<textarea required rows="7" placeholder="Tell me what you have in mind..."></textarea></label>
          <button className="button primary" type="submit"><Send size={16} /> Send message</button>
          {sent && <p className="form-success">Your message form is ready. Connect it to your preferred email service or backend to receive submissions.</p>}
        </form>
      </div>
    </section>
  );
}
