export default function About() {
  return (
    <section className="about-page">
      <div className="about-hero">
        <p className="eyebrow">ABOUT LVYVN</p>
        <h1>Smarter outfit decisions, built around your own wardrobe.</h1>
        <p className="page-text">
          LVYVN is a virtual wardrobe and outfit recommendation app designed to help
          users save clothing items, organize them clearly, and receive outfit
          suggestions based on weather, occasion, and personal feedback.
        </p>
      </div>

      <div className="about-grid">
        <div className="feature-card">
          <p className="mini-label">PURPOSE</p>
          <h3>Make daily dressing easier</h3>
          <p>
            Instead of randomly choosing outfits, users can rely on a system that
            considers context and existing wardrobe pieces.
          </p>
        </div>

        <div className="feature-card">
          <p className="mini-label">CORE IDEA</p>
          <h3>Use wardrobe + weather together</h3>
          <p>
            Recommendations are generated using saved clothing items and external
            context like temperature, city, and occasion.
          </p>
        </div>

        <div className="feature-card">
          <p className="mini-label">USER FEEDBACK</p>
          <h3>Learn from preferences</h3>
          <p>
            The like and dislike system helps improve future suggestions and create a
            more personalized experience.
          </p>
        </div>
      </div>
    </section>
  );
}