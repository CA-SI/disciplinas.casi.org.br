'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navegacao } from '@/lib/site'

export function NavegacaoPrincipal() {
  const caminho = usePathname()
  const ativo = (href: string) => (href === '/' ? caminho === '/' : caminho.startsWith(href))

  return (
    <nav aria-label="Principal" className="hidden lg:block">
      <ul className="flex items-center gap-8">
        {navegacao.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={ativo(item.href) ? 'page' : undefined}
              className="relative py-2 text-[15px] text-texto transition-colors hover:text-marca aria-[current=page]:text-marca after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-marca after:transition-transform hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
            >
              {item.rotulo}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
