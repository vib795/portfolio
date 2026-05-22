export default function SectionTag({
  index,
  label,
  tone = "ink",
}: {
  index: string;
  label: string;
  tone?: "ink" | "cream";
}) {
  const cream = tone === "cream";
  return (
    <div className="inline-flex flex-col gap-3">
      <span
        className={`h-px w-16 ${cream ? "bg-dark-line" : "bg-line-strong"}`}
      />
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.24em]">
        <span className={cream ? "text-cream-soft" : "text-ink-faint"}>
          {index} /{" "}
        </span>
        <span className={cream ? "text-cream" : "text-ink"}>{label}</span>
      </span>
    </div>
  );
}
