import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  BookMarked,
  Clock,
  ExternalLink,
  FileText,
  FolderGit2,
  GitPullRequest,
  Library,
  ListTree,
  Paperclip,
  Target,
} from 'lucide-react'
import { CabecalhoPagina } from '@/components/cabecalho-pagina'
import { Prerequisitos } from '@/components/prerequisitos'
import { SeloTipo } from '@/components/selos'
import { urlGithub } from '@/lib/catalogo'
import { disciplinas, liberadasPor, porCodigo } from '@/lib/conteudo'
import { areaDe, caminho, dadosArea, slug } from '@/lib/disciplina'

export const dynamicParams = false

export function generateStaticParams() {
  return disciplinas().map((d) => ({ codigo: slug(d.codigo) }))
}

type Props = { params: Promise<{ codigo: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = porCodigo((await params).codigo)
  if (!d) return {}
  return {
    title: `${d.codigo} · ${d.nome}`,
    description: d.ementa.join(' ').slice(0, 160),
    alternates: { canonical: caminho(d.codigo) },
  }
}

function Secao({ id, icone: Icone, titulo, children }: { id: string; icone: typeof FileText; titulo: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-md bg-white p-6 shadow-card sm:p-8">
      <h2 className="mb-4 flex items-center gap-3 text-2xl">
        <Icone className="size-6 text-marca" aria-hidden /> {titulo}
      </h2>
      {children}
    </section>
  )
}

export default async function PaginaDisciplina({ params }: Props) {
  const d = porCodigo((await params).codigo)
  if (!d) notFound()

  const existentes = new Set(disciplinas().map((x) => x.codigo))
  const libera = liberadasPor(d.codigo)
  const area = dadosArea(areaDe(d.codigo))
  const outrosCursos = d.oferecimentos.filter(([curso]) => curso !== 'Sistemas de Informação')
  const biblio = [
    { titulo: 'Básica', itens: d.bibliografia_basica.filter((r) => !/^Não definid/.test(r)) },
    { titulo: 'Complementar', itens: d.bibliografia_complementar.filter((r) => !/^Não definid/.test(r)) },
  ].filter((b) => b.itens.length)

  const indice = [
    d.ementa.length && { id: 'ementa', rotulo: 'Ementa' },
    d.objetivos.length && { id: 'objetivos', rotulo: 'Objetivos' },
    d.conteudo.length && { id: 'conteudo', rotulo: 'Conteúdo programático' },
    biblio.length && { id: 'bibliografia', rotulo: 'Bibliografia' },
    d.referencias.length && { id: 'referencias', rotulo: 'Referências úteis' },
    { id: 'materiais', rotulo: 'Materiais' },
  ].filter(Boolean) as { id: string; rotulo: string }[]

  const ficha: [string, React.ReactNode][] = [
    ['Carga horária', d.horas != null ? `${d.horas} h` : '—'],
    ['Por semana', d.teorica != null ? `${d.teorica} h teóricas + ${d.pratica} h práticas` : '—'],
    ['Créditos', d.creditos ?? '—'],
    ['Oferecimento', d.semestres ? `Semestre ${d.semestres}` : '—'],
    ...(d.extensao ? ([['Extensão', `${d.extensao} h`]] as [string, React.ReactNode][]) : []),
    ['Pré-requisitos', <Prerequisitos key="pre" texto={d.prerequisitos} existentes={existentes} />],
  ]

  return (
    <>
      <CabecalhoPagina
        sobretitulo={
          <span className="inline-flex flex-wrap items-center gap-3">
            <span className="font-mono tracking-normal text-white">{d.codigo}</span>
            <span className="inline-flex items-center gap-1.5 normal-case tracking-normal">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: area.cor }} aria-hidden />
              {area.rotulo}
            </span>
          </span>
        }
        titulo={d.nome}
      >
        <div className="flex flex-wrap items-center gap-3 text-base">
          <span className="rounded-full bg-white px-1">
            <SeloTipo tipo={d.tipo} periodo={d.periodo} />
          </span>
          {d.horas != null && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden /> {d.horas} h
            </span>
          )}
          <span className="text-white/60">Programa do Catálogo UFV {d.catalogo}</span>
        </div>
      </CabecalhoPagina>

      <div className="container-guia grid gap-8 py-10 lg:grid-cols-[1fr_20rem] lg:py-14">
        <div className="min-w-0 space-y-6">
          <Link href="/disciplinas/" className="inline-flex items-center gap-1 text-sm text-marca hover:underline">
            <ArrowLeft className="size-4" aria-hidden /> Todas as disciplinas
          </Link>

          {d.tipo === 'anterior' && (
            <p className="rounded-md border-l-4 border-alerta bg-white p-4 text-suave shadow-card">
              Esta disciplina não faz parte da matriz curricular vigente. A página guarda o programa e os materiais de
              quem cursou matrizes anteriores. Aproveitamento de estudos e equivalências são definidos pela coordenação.
            </p>
          )}

          {d.ementa.length > 0 && (
            <Secao id="ementa" icone={FileText} titulo="Ementa">
              <div className="texto-corrido">{d.ementa.map((p, i) => <p key={i}>{p}</p>)}</div>
            </Secao>
          )}

          {d.objetivos.length > 0 && (
            <Secao id="objetivos" icone={Target} titulo="Objetivos">
              <div className="texto-corrido">{d.objetivos.map((p, i) => <p key={i}>{p}</p>)}</div>
            </Secao>
          )}

          {d.conteudo.length > 0 && (
            <Secao id="conteudo" icone={ListTree} titulo="Conteúdo programático">
              <ol className="space-y-2">
                {d.conteudo.map((u, i) => (
                  <li key={i}>
                    <details className="group rounded-md border border-borda" open={d.conteudo.length <= 3}>
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 marker:hidden">
                        <span className="text-texto">
                          <span className="mr-2 text-suave">{i + 1}.</span>
                          {u.titulo}
                        </span>
                        <span className="shrink-0 rounded-full bg-fundo px-2.5 py-0.5 text-xs text-suave">{u.horas} h</span>
                      </summary>
                      {u.itens.length > 0 && (
                        <ul className="space-y-1 border-t border-borda px-4 py-3 text-sm text-suave">
                          {u.itens.map(([nivel, texto], j) => (
                            <li key={j} className="flex gap-2" style={{ paddingLeft: `${(nivel - 1) * 1.25}rem` }}>
                              <span className="text-marca" aria-hidden>
                                {nivel > 1 ? '◦' : '•'}
                              </span>
                              {texto}
                            </li>
                          ))}
                        </ul>
                      )}
                    </details>
                  </li>
                ))}
              </ol>
            </Secao>
          )}

          {biblio.length > 0 && (
            <Secao id="bibliografia" icone={BookMarked} titulo="Bibliografia">
              <div className="space-y-6">
                {biblio.map((b) => (
                  <div key={b.titulo}>
                    <h3 className="mb-2 text-sm uppercase tracking-wider text-suave">{b.titulo}</h3>
                    <ul className="space-y-2 text-[15px] leading-relaxed">
                      {b.itens.map((r, i) => (
                        <li key={i} className="border-l-2 border-borda pl-3">
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Secao>
          )}

          {d.referencias.length > 0 && (
            <Secao id="referencias" icone={Library} titulo="Referências úteis">
              <ul className="grid gap-3 sm:grid-cols-2">
                {d.referencias.map((r) => (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      className="group flex h-full flex-col rounded-md border border-borda p-4 transition hover:border-marca hover:shadow-card"
                    >
                      <span className="flex items-start justify-between gap-2 text-texto group-hover:text-marca">
                        {r.titulo}
                        <ExternalLink className="mt-1 size-3.5 shrink-0 text-suave" aria-hidden />
                      </span>
                      {r.nota && <span className="mt-1 text-sm text-suave">{r.nota}</span>}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-suave">
                Selecionadas pela comunidade em{' '}
                <a href={urlGithub('dados/referencias.json', 'blob')} className="text-marca hover:underline">
                  dados/referencias.json
                </a>
                . Sugira outras por pull request.
              </p>
            </Secao>
          )}

          <Secao id="materiais" icone={Paperclip} titulo="Materiais da comunidade">
            {d.materiais.length > 0 ? (
              <ul className="divide-y divide-borda">
                {d.materiais.map((m) => (
                  <li key={m.url}>
                    <a href={m.url} className="flex items-center gap-3 py-3 text-texto hover:text-marca">
                      {m.externo ? <FolderGit2 className="size-5 shrink-0 text-suave" aria-hidden /> : <FileText className="size-5 shrink-0 text-suave" aria-hidden />}
                      <span className="min-w-0 break-words">{m.nome}</span>
                      {m.externo && <span className="ml-auto shrink-0 text-xs text-suave">repositório externo</span>}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-suave">
                Esta disciplina ainda não tem slides, listas ou resumos compartilhados. Se você tem algum, envie para a
                pasta da disciplina no GitHub.
              </p>
            )}
            {d.pasta && (
              <a href={urlGithub(d.pasta, 'tree')} className="botao-destaque mt-6">
                <GitPullRequest className="size-4" aria-hidden /> Enviar material para esta disciplina
              </a>
            )}
          </Secao>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-md bg-white p-6 shadow-card">
            <dl className="space-y-3 text-sm">
              {ficha.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-suave">{k}</dt>
                  <dd className="text-texto">{v}</dd>
                </div>
              ))}
              {libera.length > 0 && (
                <div>
                  <dt className="text-suave">É pré-requisito de</dt>
                  <dd className="mt-1 flex flex-wrap gap-1.5">
                    {libera.map((c) => (
                      <Link key={c} href={caminho(c)} className="rounded-full bg-fundo px-2.5 py-0.5 font-mono text-xs text-texto hover:bg-marca hover:text-white">
                        {c}
                      </Link>
                    ))}
                  </dd>
                </div>
              )}
              {outrosCursos.length > 0 && (
                <div>
                  <dt className="text-suave">Obrigatória também em</dt>
                  <dd className="text-texto">{outrosCursos.map(([c, p]) => `${c} (${p}º)`).join(', ')}</dd>
                </div>
              )}
            </dl>
            <a href={d.pdf} className="botao-marca mt-6 w-full">
              <FileText className="size-4" aria-hidden /> Programa oficial (PDF)
            </a>
          </div>

          <nav aria-label="Nesta página" className="hidden rounded-md bg-white p-6 shadow-card lg:block">
            <p className="mb-3 text-sm uppercase tracking-wider text-suave">Nesta página</p>
            <ul className="space-y-2 text-sm">
              {indice.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-texto hover:text-marca">
                    {s.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </>
  )
}
