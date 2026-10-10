import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

/** Trilha de navegação (breadcrumb). O último item é a página atual, sem link. */
export function Trilha({ itens }: { itens: { href?: string; rotulo: string }[] }) {
  return (
    <nav aria-label="Trilha" className="text-sm text-suave">
      <ol className="flex flex-wrap items-center gap-1">
        {itens.map((item, i) => (
          <li key={i} className="inline-flex items-center gap-1">
            {i > 0 && <ChevronRight className="size-3.5" aria-hidden />}
            {item.href ? (
              <Link href={item.href} className="hover:text-marca-forte hover:underline">
                {item.rotulo}
              </Link>
            ) : (
              <span aria-current="page" className="text-texto">
                {item.rotulo}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
