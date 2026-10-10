import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Guia } from '@/lib/guias'
import { IconeGuia } from './icone-guia'

/** Mesmo card do Guia CASI (src/components/card-guia.tsx de lá). */
export function CardGuia({ guia }: { guia: Pick<Guia, 'slug' | 'titulo' | 'resumo' | 'icone'> }) {
  return (
    <article className="group relative flex h-full flex-col rounded-md bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-marca-clara text-marca-forte transition-transform duration-300 group-hover:scale-110">
        <IconeGuia icone={guia.icone} className="size-6" />
      </span>
      <h3 className="mt-5 text-xl text-texto">
        <Link href={`/guias/${guia.slug}/`} className="after:absolute after:inset-0 focus-visible:outline-none">
          {guia.titulo}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-suave">{guia.resumo}</p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm text-marca-forte">
        Ler guia <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </span>
    </article>
  )
}
