export function FeatureCard({ icon: Icon, title, text }) {
  return (
    <article className="feature-card">
      <Icon size={20} />
      <strong>{title}</strong>
      <span>{text}</span>
    </article>
  );
}
