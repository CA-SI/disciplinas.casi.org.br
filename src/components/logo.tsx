import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export function Logo({ claro = false }: { claro?: boolean }) {
  return (
    <Link href="/" className="inline-flex shrink-0 items-center gap-2.5" aria-label="Disciplinas CASI, página inicial">
      <span className="inline-flex size-10 items-center justify-center rounded-full bg-marca-forte text-white shadow-md">
        <GraduationCap className="size-5" aria-hidden />
      </span>
      <span className={`leading-tight ${claro ? 'text-white' : 'text-texto'}`}>
        <span className="block text-lg font-normal">Disciplinas</span>
        <span className={`block text-xs uppercase tracking-[0.2em] ${claro ? 'text-white/60' : 'text-suave'}`}>
          CASI · SI UFV-CRP
        </span>
      </span>
    </Link>
  )
}
