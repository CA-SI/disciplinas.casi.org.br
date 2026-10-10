import Link from 'next/link'
import { ArrowRight, BookOpen, GitPullRequest, Layers, Library } from 'lucide-react'
import { BuscaHero } from '@/components/busca-hero'
import { CardDisciplina } from '@/components/card-disciplina'
import { AREAS } from '@/lib/disciplina'
import { catalogo, resumos } from '@/lib/conteudo'
import { site } from '@/lib/site'

export const dynamic = 'force-static'

export default function Inicio() {
  const cat = catalogo()
  const todas = resumos()
  const obrigatorias = todas.filter((d) => d.tipo === 'obrigatoria')
  const optativas = todas.filter((d) => d.tipo === 'optativa')
  const periodos = [...new Set(obrigatorias.map((d) => d.periodo!))].sort((a, b) => a - b)
  const comMaterial = todas.filter((d) => d.temMaterial)
  const totalHoras = cat.quadro.horas_total

  const numeros = [
    { valor: obrigatorias.length, rotulo: 'obrigatórias' },
    { valor: optativas.length, rotulo: 'optativas' },
    { valor: totalHoras ? `${totalHoras} h` : '—', rotulo: 'de curso' },
    { valor: `${cat.quadro.anos_padrao ?? '4'} anos`, rotulo: 'duração padrão' },
  ]

  return (
    <>
      <section className="relative isolate overflow-hidden bg-noite text-white">
        {/* Aurora com as cores das áreas, como no hero do guia. */}
        <div aria-hidden className="absolute inset-0 -z-10 opacity-70">
          {AREAS.map((a, i) => (
            <span
              key={a.valor}
              className="absolute size-[38rem] rounded-full blur-3xl animate-aurora"
              style={{
                backgroundColor: a.cor,
                left: `${((i * 23) % 90) - 15}%`,
                top: `${((i * 37) % 70) - 30}%`,
                opacity: 0.35,
                animationDelay: `${i * -3}s`,
              }}
            />
          ))}
          <div className="absolute inset-0 bg-noite/40" />
        </div>

        <div className="container-guia flex flex-col items-center py-20 text-center sm:py-28">
          <p className="mb-4 rounded-full border border-white/25 px-4 py-1 text-sm uppercase tracking-[0.2em] text-white/80">
            Sistemas de Informação · UFV-CRP · Catálogo {cat.ano}
          </p>
          <h1 className="max-w-3xl text-4xl font-light leading-tight sm:text-6xl">
            Todas as disciplinas do curso, num só lugar
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/80">
            Ementas, conteúdo programático, bibliografia, referências abertas e materiais compartilhados por quem já
            cursou.
          </p>
          <div className="mt-10 flex w-full justify-center">
            <BuscaHero />
          </div>
          <dl className="mt-10 grid w-full max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
            {numeros.map((n) => (
              <div key={n.rotulo}>
                <dt className="sr-only">{n.rotulo}</dt>
                <dd className="text-3xl font-light">{n.valor}</dd>
                <dd className="text-sm text-white/60">{n.rotulo}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container-guia py-16 sm:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl sm:text-4xl">Explore por período</h2>
          <Link href="/matriz/" className="inline-flex items-center gap-1 text-marca-forte hover:underline">
            Ver a matriz completa <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {periodos.map((p, i) => {
            const doPeriodo = obrigatorias.filter((d) => d.periodo === p)
            return (
              <li key={p} className="animate-surgir" style={{ animationDelay: `${i * 50}ms` }}>
                <Link
                  href={`/disciplinas/?periodo=${p}`}
                  className="group flex h-full flex-col rounded-md bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-marca-forte text-lg text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                    {p}º
                  </span>
                  <span className="mt-5 text-xl text-texto">{p}º período</span>
                  <span className="mt-2 line-clamp-3 text-sm leading-relaxed text-suave">
                    {doPeriodo.map((d) => d.nome).join(' · ')}
                  </span>
                  <span className="mt-auto pt-5 text-sm text-suave">
                    {doPeriodo.length} disciplinas · {doPeriodo.reduce((s, d) => s + (d.horas ?? 0), 0)} h
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-guia">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl">Optativas</h2>
            <Link href="/disciplinas/?tipo=optativa" className="inline-flex items-center gap-1 text-marca-forte hover:underline">
              Ver as {optativas.length} optativas <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {optativas.slice(0, 6).map((d) => (
              <li key={d.codigo}>
                <CardDisciplina d={d} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-guia grid gap-6 py-16 sm:grid-cols-3 sm:py-20">
        {[
          {
            icone: BookOpen,
            titulo: 'Programa oficial',
            texto: 'Ementa, objetivos, conteúdo e bibliografia transcritos do programa analítico da UFV, com link para o PDF.',
          },
          {
            icone: Library,
            titulo: 'Referências abertas',
            texto: 'Livros abertos, cursos, documentação e ferramentas selecionados para cada disciplina.',
          },
          {
            icone: Layers,
            titulo: 'Materiais da comunidade',
            texto: `Slides, listas e resumos enviados por estudantes. Hoje ${comMaterial.length} disciplinas têm materiais.`,
          },
        ].map(({ icone: Icone, titulo, texto }) => (
          <div key={titulo} className="rounded-md bg-white p-6 shadow-card">
            <Icone className="size-8 text-marca-forte" aria-hidden />
            <h3 className="mt-4 text-xl">{titulo}</h3>
            <p className="mt-2 leading-relaxed text-suave">{texto}</p>
          </div>
        ))}
      </section>

      <section className="bg-destaque-forte text-white">
        <div className="container-guia flex flex-col items-center gap-6 py-16 text-center">
          <h2 className="text-3xl sm:text-4xl">Tem material de alguma disciplina?</h2>
          <p className="max-w-xl text-lg text-white/85">
            Slides, listas resolvidas, resumos, indicações de livros e vídeos: envie por pull request no repositório do
            curso. A equipe do CASI revisa e o site atualiza sozinho.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={site.repoConteudo} className="botao bg-white px-7 py-3 text-destaque-forte hover:bg-white/90">
              <GitPullRequest className="size-4" aria-hidden /> Contribuir no GitHub
            </a>
            <Link href="/sobre/" className="botao-contorno px-7 py-3 text-white hover:bg-white/10">
              Como contribuir
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
