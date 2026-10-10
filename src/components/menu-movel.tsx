'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { GitPullRequest, Menu, X } from 'lucide-react'
import { navegacao, site } from '@/lib/site'

export function MenuMovel() {
  const [aberto, setAberto] = useState(false)
  const caminho = usePathname()

  useEffect(() => {
    if (!aberto) return
    const fechar = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false)
    document.addEventListener('keydown', fechar)
    return () => document.removeEventListener('keydown', fechar)
  }, [aberto])

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="inline-flex size-11 items-center justify-center rounded-full text-texto hover:bg-fundo"
        aria-expanded={aberto}
        aria-controls="menu-movel"
        aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
        onClick={() => setAberto(!aberto)}
      >
        {aberto ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {aberto && (
        <nav
          id="menu-movel"
          className="absolute inset-x-0 top-full border-t border-borda bg-white shadow-card-hover animate-surgir"
        >
          <ul className="container-guia flex flex-col py-2">
            {navegacao.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setAberto(false)}
                  aria-current={caminho === item.href ? 'page' : undefined}
                  className="block py-3 text-lg text-texto aria-[current=page]:text-marca"
                >
                  {item.rotulo}
                </Link>
              </li>
            ))}
            <li className="py-3">
              <a href={site.repoConteudo} className="botao-destaque w-full">
                <GitPullRequest className="size-4" /> Contribuir no GitHub
              </a>
            </li>
          </ul>
        </nav>
      )}
    </div>
  )
}
