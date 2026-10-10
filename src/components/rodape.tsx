import Link from 'next/link'
import { navegacao, site } from '@/lib/site'
import { Logo } from './logo'

const externos = [
  { href: site.repoConteudo, rotulo: 'Conteúdo no GitHub' },
  { href: site.repoSite, rotulo: 'Código do site' },
  { href: site.guia, rotulo: 'Guia CASI' },
  { href: 'https://sin.crp.ufv.br/', rotulo: 'Site do curso' },
  { href: 'https://catalogo.ufv.br/', rotulo: 'Catálogo de Graduação UFV' },
]

export function Rodape() {
  return (
    <footer className="mt-auto bg-noite text-white/70">
      <div className="container-guia grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo claro />
          <p className="mt-4 max-w-sm leading-relaxed">
            Catálogo aberto das disciplinas de Sistemas de Informação da UFV – Campus Rio Paranaíba, feito e mantido por
            estudantes do CASI. Ementas e bibliografias vêm dos programas analíticos oficiais da UFV.
          </p>
          <a href={site.repoConteudo} className="botao-destaque mt-6">
            Contribuir com material
          </a>
        </div>
        <nav aria-label="Navegação do site">
          <p className="mb-4 font-normal uppercase tracking-wider text-white">O site</p>
          <ul className="space-y-2">
            {navegacao.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Links externos">
          <p className="mb-4 font-normal uppercase tracking-wider text-white">Links</p>
          <ul className="space-y-2">
            {externos.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-white">
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="container-guia py-5 text-sm">© {new Date().getFullYear()} CASI · UFV – Campus Rio Paranaíba</p>
      </div>
    </footer>
  )
}
