import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { CabecalhoPagina } from '@/components/cabecalho-pagina'
import { catalogo, disciplinas } from '@/lib/conteudo'
import { areaDe, caminho, codigosPrerequisito, dadosArea, trechosPrerequisito } from '@/lib/disciplina'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Matriz curricular',
  description: 'Disciplinas obrigatórias de Sistemas de Informação da UFV-CRP por período, com pré-requisitos.',
}

export default function Matriz() {
  const cat = catalogo()
  const obrigatorias = disciplinas().filter((d) => d.tipo === 'obrigatoria')
  const periodos = [...new Set(obrigatorias.map((d) => d.periodo!))].sort((a, b) => a - b)
  const q = cat.quadro

  return (
    <>
      <CabecalhoPagina sobretitulo={`Catálogo de Graduação UFV ${cat.ano}`} titulo="Matriz curricular">
        As disciplinas obrigatórias por período. Os códigos abaixo de cada disciplina são os pré-requisitos; com{' '}
        <span className="font-mono">*</span>, correquisito (pode ser cursado no mesmo semestre).
      </CabecalhoPagina>

      <div className="container-guia py-10 lg:py-14">
        <dl className="mb-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ['Obrigatórias', q.horas_obrigatorias && `${q.horas_obrigatorias} h`],
            ['Optativas', q.horas_optativas && `${q.horas_optativas} h`],
            ['Total', q.horas_total && `${q.horas_total} h`],
            ['Prazo mínimo', q.anos_minimo && `${q.anos_minimo} anos`],
            ['Prazo padrão', q.anos_padrao && `${q.anos_padrao} anos`],
            ['Prazo máximo', q.anos_maximo && `${q.anos_maximo} anos`],
          ].map(([rotulo, valor]) => (
            <div key={rotulo} className="rounded-md bg-white p-4 shadow-card">
              <dt className="text-sm text-suave">{rotulo}</dt>
              <dd className="text-2xl font-light">{valor || '—'}</dd>
            </div>
          ))}
        </dl>

        <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6">
          <ol className="grid min-w-[72rem] grid-cols-8 gap-3">
            {periodos.map((p) => {
              const doPeriodo = obrigatorias.filter((d) => d.periodo === p)
              return (
                <li key={p} className="flex flex-col gap-3">
                  <h2 className="rounded-md bg-noite px-3 py-2 text-center text-white">
                    {p}º período
                    <span className="block text-xs text-white/60">{doPeriodo.reduce((s, d) => s + (d.horas ?? 0), 0)} h</span>
                  </h2>
                  {doPeriodo.map((d) => {
                    const area = dadosArea(areaDe(d.codigo))
                    const pre = trechosPrerequisito(d.prerequisitos).filter((t) => 'codigo' in t)
                    const semCodigo = !codigosPrerequisito(d.prerequisitos).length && d.prerequisitos
                    return (
                      <Link
                        key={d.codigo}
                        href={caminho(d.codigo)}
                        className="group flex flex-col rounded-md border-t-4 bg-white p-3 text-sm shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
                        style={{ borderTopColor: area.cor }}
                      >
                        <span className="font-mono text-xs text-suave">{d.codigo}</span>
                        <span className="mt-1 leading-snug text-texto group-hover:text-marca-forte">{d.nome}</span>
                        <span className="mt-2 text-xs text-suave">{d.horas} h</span>
                        {pre.length > 0 && (
                          <span className="mt-2 flex flex-wrap gap-1">
                            {pre.map((t) =>
                              'codigo' in t ? (
                                <span key={t.codigo} className="rounded bg-fundo px-1.5 py-0.5 font-mono text-[11px] text-suave">
                                  {t.codigo}
                                  {t.correquisito && '*'}
                                </span>
                              ) : null,
                            )}
                          </span>
                        )}
                        {semCodigo && <span className="mt-2 text-[11px] leading-snug text-suave">Requer 1800 h de obrigatórias</span>}
                      </Link>
                    )
                  })}
                </li>
              )
            })}
          </ol>
        </div>

        <p className="mt-8 text-sm text-suave">
          Fonte:{' '}
          <a href={cat.fonte} className="inline-flex items-center gap-1 text-marca-forte hover:underline">
            Catálogo de Graduação da UFV <ExternalLink className="size-3.5" aria-hidden />
          </a>
          . As optativas estão em{' '}
          <Link href="/disciplinas/?tipo=optativa" className="text-marca-forte hover:underline">
            Disciplinas › Optativas
          </Link>
          .
        </p>
      </div>
    </>
  )
}
