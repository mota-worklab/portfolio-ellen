/** Preserve the project name's weight and soften the credit after the separator. */
export function ProjectTitle({ title }: { title: string }) {
  const separator = title.indexOf("|");
  if (separator === -1) return <>{title}</>;

  return (
    <>
      {title.slice(0, separator)}
      <span style={{ fontWeight: 400 }}>{title.slice(separator)}</span>
    </>
  );
}
