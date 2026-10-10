import type { Metadata } from 'next'
import { CabecalhoPagina } from '@/components/cabecalho-pagina'
import { CardGuia } from '@/components/card-guia'
import { guias } from '@/lib/conteudo'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Guias do curso',
  description: 'Como funciona a matriz, o TCC, a extensão, as optativas e a mudança de matriz em Sistemas de Informação da UFV-CRP.',
}

export default function Guias() {
  return (
    <>
      <CabecalhoPagina sobretitulo="Comece por aqui" titulo="Guias do curso">
        O que vale saber sobre o curso além de cada disciplina, escrito a partir do catálogo oficial e com as fontes de
        cada informação.
      </CabecalhoPagina>
      <div className="container-guia py-12 lg:py-16">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guias().map((g, i) => (
            <li key={g.slug} className="animate-surgir" style={{ animationDelay: `${i * 60}ms` }}>
              <CardGuia guia={g} />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
