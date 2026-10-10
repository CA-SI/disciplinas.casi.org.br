import { Search } from 'lucide-react'

/** Busca grande do hero: envia para /disciplinas/?q=. */
export function BuscaHero() {
  return (
    <form action="/disciplinas/" role="search" className="flex w-full max-w-2xl overflow-hidden rounded-md bg-white shadow-card-hover">
      <label htmlFor="busca-hero" className="sr-only">
        Qual disciplina você procura?
      </label>
      <input
        id="busca-hero"
        name="q"
        type="search"
        placeholder="Banco de dados, SIN215, grafos, estatística…"
        className="min-w-0 flex-1 px-5 py-4 text-base font-normal text-texto placeholder:font-light placeholder:text-suave/70 focus:outline-none"
      />
      <button
        type="submit"
        className="flex items-center gap-2 bg-destaque-forte px-5 text-sm uppercase tracking-wider text-white transition-colors hover:bg-destaque-escura sm:px-8"
      >
        <Search className="size-5" aria-hidden />
        <span className="hidden sm:inline">Buscar</span>
      </button>
    </form>
  )
}
