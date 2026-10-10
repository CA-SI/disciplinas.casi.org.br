import Link from 'next/link'
import { GitPullRequest, Search } from 'lucide-react'
import { site } from '@/lib/site'
import { Logo } from './logo'
import { MenuMovel } from './menu-movel'
import { NavegacaoPrincipal } from './navegacao-principal'

export function Cabecalho() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 shadow-card backdrop-blur">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 botao-marca">
        Pular para o conteúdo
      </a>
      <div className="container-guia relative flex h-20 items-center justify-between gap-6">
        <Logo />
        <NavegacaoPrincipal />
        <div className="flex items-center gap-2">
          <Link
            href="/disciplinas/"
            aria-label="Buscar disciplinas"
            className="inline-flex size-11 items-center justify-center rounded-full bg-marca-forte text-white shadow-md transition-transform hover:scale-105"
          >
            <Search className="size-5" />
          </Link>
          <a
            href={site.repoConteudo}
            aria-label="Contribuir no GitHub"
            title="Contribuir no GitHub"
            className="inline-flex size-11 items-center justify-center rounded-full bg-destaque-forte text-white shadow-md transition-transform hover:scale-105 lg:w-auto lg:gap-2 lg:px-5"
          >
            <GitPullRequest className="size-5" />
            <span className="hidden text-sm font-normal lg:inline">Contribuir</span>
          </a>
          <MenuMovel />
        </div>
      </div>
    </header>
  )
}
