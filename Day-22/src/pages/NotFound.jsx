import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="page-section">
      <div className="container narrow-page not-found">
        <p className="kicker">404</p>
        <h1 className="page-title">Page not found.</h1>
        <Link to="/" className="button primary">Back home</Link>
      </div>
    </section>
  );
}
