/** Faixa de título das páginas internas, no padrão do guia. */
export function CabecalhoPagina({
  sobretitulo,
  titulo,
  children,
}: {
  sobretitulo?: React.ReactNode
  titulo: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <section className="bg-texto text-white">
      <div className="container-guia py-12 sm:py-16">
        {sobretitulo && <p className="mb-3 text-sm uppercase tracking-[0.2em] text-white/60">{sobretitulo}</p>}
        <h1 className="max-w-4xl text-3xl font-light leading-tight sm:text-5xl">{titulo}</h1>
        {children && <div className="mt-4 max-w-2xl text-lg text-white/75">{children}</div>}
      </div>
    </section>
  )
}
