/**
 * The hero's signature element: the path every project of mine follows, from a user's request
 * to a finished interface. A yellow dot travels down the track and lights each stage in turn.
 * Tech names are the ones actually used in NEXUS Agent OS and my web projects.
 */
const stages = [
  { name: 'Request', tag: 'chat, form or API' },
  { name: 'Retrieval', tag: 'Qdrant · embeddings' },
  { name: 'Reasoning', tag: 'LLMs via OpenRouter, Ollama' },
  { name: 'Tools', tag: 'Python · FastAPI' },
  { name: 'Interface', tag: 'React · Tailwind' },
]

const NODE = 84
const GAP = 20

export function Pipeline() {
  return (
    <figure className="m-0" aria-label="How I build: a request flows through retrieval, reasoning and tools to an interface">
      <ol className="pipe m-0 list-none p-0" style={{ ['--span' as string]: (stages.length - 1) * (NODE + GAP) }}>
        <span className="pipe-dot" aria-hidden />
        {stages.map((s, k) => (
          <li key={s.name} className="pipe-node" style={{ ['--k' as string]: k }} tabIndex={0}>
            <span aria-hidden className="relative z-[1] ml-2 h-3 w-3 shrink-0 rounded-full border-2 border-current opacity-60" />
            <span className="display text-[1.55rem] leading-none">{s.name}</span>
            <span className="tag ml-auto text-right font-mono text-[0.78rem] leading-snug">{s.tag}</span>
          </li>
        ))}
      </ol>
      <figcaption className="mt-5 max-w-[34ch] text-[0.95rem] text-white/75">
        Every project I build follows this path. I design each stage so it can be swapped, tested and scaled.
      </figcaption>
    </figure>
  )
}
