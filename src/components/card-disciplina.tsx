import Link from 'next/link'
import { Clock, Paperclip } from 'lucide-react'
import { caminho, dadosArea, type Resumo } from '@/lib/disciplina'
import { SeloArea, SeloTipo } from './selos'

/** Card no estilo do guia: faixa colorida da área, selo circular sobreposto, código, nome e metadados. */
export function CardDisciplina({ d }: { d: Resumo }) {
  const area = dadosArea(d.area)
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-md bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative h-16" style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${area.cor} 15%, white), color-mix(in srgb, ${area.cor} 35%, white))` }}>
        <span className="absolute left-5 top-4 font-mono text-sm font-normal text-texto/70">{d.codigo}</span>
        <SeloArea codigo={d.codigo} area={d.area} className="absolute bottom-0 right-5 translate-y-1/2" />
      </div>
      <div className="flex flex-1 flex-col gap-2 px-5 pb-5 pt-6">
        <h3 className="pr-14 text-lg leading-snug text-texto">
          <Link href={caminho(d.codigo)} className="after:absolute after:inset-0 focus-visible:outline-none">
            {d.nome}
          </Link>
        </h3>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-3 text-sm text-suave">
          <SeloTipo tipo={d.tipo} periodo={d.periodo} />
          {d.horas != null && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden /> {d.horas} h
            </span>
          )}
          {d.temMaterial && (
            <span className="inline-flex items-center gap-1 text-aberto">
              <Paperclip className="size-3.5" aria-hidden /> materiais
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
