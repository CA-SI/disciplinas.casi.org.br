import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { IconeGuia } from '@/components/icone-guia'
import { Trilha } from '@/components/trilha'
import { urlGithub } from '@/lib/catalogo'
import { guia, guias, htmlGuia } from '@/lib/conteudo'
import { site } from '@/lib/site'

export const dynamic = 'force-static'
export const dynamicParams = false

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return guias().map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = guia((await params).slug)
  return g ? { title: g.titulo, description: g.resumo, alternates: { canonical: `/guias/${g.slug}/` } } : {}
}

export default async function PaginaGuia({ params }: Props) {
  const g = guia((await params).slug)
  if (!g) notFound()
  // Conteúdo do repositório de conteúdo, revisado em PR e renderizado no build (spec 002).
  const html = htmlGuia(g)
  const outros = guias().filter((o) => o.slug !== g.slug)
  const editar = urlGithub(`guias/${g.slug}.md`, 'blob')
  const issue = `${site.repoConteudo}/issues/new?title=${encodeURIComponent(`Guia "${g.titulo}": correção`)}`

  return (
    <article className="container-guia max-w-3xl py-12 lg:py-14">
      <Trilha itens={[{ href: '/guias/', rotulo: 'Guias do curso' }, { rotulo: g.titulo }]} />
      <header className="mt-4 flex items-start gap-4">
        <span className="mt-1 inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-marca-clara text-marca-forte">
          <IconeGuia icone={g.icone} className="size-6" />
        </span>
        <div>
          <h1 className="text-3xl sm:text-4xl">{g.titulo}</h1>
          <p className="mt-2 text-lg text-suave">{g.resumo}</p>
        </div>
      </header>

      <div className="texto-corrido mt-8 rounded-md bg-white p-6 shadow-card sm:p-10" dangerouslySetInnerHTML={{ __html: html }} />

      <footer className="mt-8 rounded-md border border-dashed border-borda p-6 text-sm text-suave">
        <p className="font-normal text-texto">Fontes</p>
        <ul className="mt-2 space-y-1">
          {g.fontes.map((f) => (
            <li key={f.url}>
              <a href={f.url} className="inline-flex items-center gap-1 text-marca-forte underline underline-offset-2">
                {f.titulo} <ExternalLink className="size-3.5 shrink-0" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          Atualizado em {new Date(`${g.atualizado_em}T12:00:00`).toLocaleDateString('pt-BR')}. Viu algo errado?{' '}
          <a href={issue} className="text-marca-forte underline underline-offset-2">
            Abra uma issue
          </a>{' '}
          ou{' '}
          <a href={editar} className="text-marca-forte underline underline-offset-2">
            edite o guia no GitHub
          </a>
          .
        </p>
      </footer>

      {outros.length > 0 && (
        <nav aria-label="Outros guias" className="mt-10">
          <p className="mb-3 text-sm uppercase tracking-wider text-suave">Outros guias</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {outros.map((o) => (
              <li key={o.slug}>
                <Link href={`/guias/${o.slug}/`} className="flex items-center gap-3 rounded-md bg-white p-4 shadow-card transition hover:shadow-card-hover">
                  <IconeGuia icone={o.icone} className="size-5 shrink-0 text-marca-forte" />
                  <span className="text-texto">{o.titulo}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </article>
  )
}
