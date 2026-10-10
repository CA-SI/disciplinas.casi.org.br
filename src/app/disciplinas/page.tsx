import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CabecalhoPagina } from '@/components/cabecalho-pagina'
import { CardDisciplina } from '@/components/card-disciplina'
import { Explorador } from '@/components/explorador'
import { catalogo, resumos } from '@/lib/conteudo'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Disciplinas',
  description: 'Busque as disciplinas de Sistemas de Informação da UFV-CRP por nome, código, assunto, período, tipo e área.',
}

export default function Disciplinas() {
  const lista = resumos()
  const periodos = [...new Set(lista.flatMap((d) => (d.periodo ? [d.periodo] : [])))].sort((a, b) => a - b)

  return (
    <>
      <CabecalhoPagina sobretitulo={`Catálogo ${catalogo().ano}`} titulo="Disciplinas">
        Obrigatórias, optativas e disciplinas de matrizes anteriores. A busca também procura nas ementas.
      </CabecalhoPagina>
      <div className="container-guia pb-20">
        {/* useSearchParams exige Suspense no export estático. O fallback (lista completa) é o que vai no HTML:
            aparece antes da hidratação e para quem navega sem JavaScript. */}
        <Suspense
          fallback={
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {lista.map((d) => (
                <li key={d.codigo}>
                  <CardDisciplina d={d} />
                </li>
              ))}
            </ul>
          }
        >
          <Explorador disciplinas={lista} periodos={periodos} />
        </Suspense>
      </div>
    </>
  )
}
