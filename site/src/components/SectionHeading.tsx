export function SectionHeading({
  index,
  label,
  title,
  description,
}: {
  index: string;
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <div className="section-label">
        <span>{index}</span>
        {label}
      </div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
