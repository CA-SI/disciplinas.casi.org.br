'use client'

import { useSearchParams } from 'next/navigation'
import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { filtrar, type Filtros } from '@/lib/busca'
import { AREAS, TIPOS, type Area, type Resumo, type Tipo } from '@/lib/disciplina'
import { CardDisciplina } from './card-disciplina'

function lerFiltros(params: URLSearchParams): Filtros {
  const tipo = params.get('tipo')
  const area = params.get('area')
  const periodo = Number(params.get('periodo'))
  return {
    q: params.get('q') ?? '',
    tipo: TIPOS.some((t) => t.valor === tipo) ? (tipo as Tipo) : undefined,
    area: AREAS.some((a) => a.valor === area) ? (area as Area) : undefined,
    // Período só faz sentido para obrigatórias.
    periodo: periodo >= 1 && periodo <= 10 ? periodo : undefined,
  }
}

function escreverUrl(f: Filtros) {
  const p = new URLSearchParams()
  if (f.q) p.set('q', f.q)
  if (f.tipo) p.set('tipo', f.tipo)
  if (f.periodo) p.set('periodo', String(f.periodo))
  if (f.area) p.set('area', f.area)
  const qs = p.toString()
  // replaceState não dispara navegação: a lista filtra sem recarregar.
  window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
}

const chip =
  'inline-flex shrink-0 items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-normal transition aria-pressed:border-texto aria-pressed:bg-texto aria-pressed:text-white border-borda'

export function Explorador({ disciplinas, periodos }: { disciplinas: Resumo[]; periodos: number[] }) {
  const params = useSearchParams()
  const [filtros, setFiltros] = useState<Filtros>(() => lerFiltros(params))
  const q = useDeferredValue(filtros.q)

  useEffect(() => escreverUrl(filtros), [filtros])

  const resultado = useMemo(() => filtrar(disciplinas, { ...filtros, q }), [disciplinas, filtros, q])
  const atualizar = (parcial: Partial<Filtros>) => setFiltros((f) => ({ ...f, ...parcial }))
  const temFiltro = Boolean(filtros.q || filtros.tipo || filtros.periodo || filtros.area)

  return (
    <div>
      <div className="sticky top-20 z-30 -mx-4 border-b border-borda bg-fundo/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-suave" aria-hidden />
          <label htmlFor="busca-disciplinas" className="sr-only">
            Buscar disciplinas
          </label>
          <input
            id="busca-disciplinas"
            type="search"
            value={filtros.q}
            onChange={(e) => atualizar({ q: e.target.value })}
            placeholder="Buscar por código, nome ou assunto da ementa…"
            className="campo rounded-full py-3.5 pl-12 pr-4 text-base shadow-card"
            autoComplete="off"
          />
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="group" aria-label="Tipo">
          {TIPOS.map((t) => {
            const ativo = filtros.tipo === t.valor
            return (
              <button
                key={t.valor}
                type="button"
                aria-pressed={ativo}
                onClick={() =>
                  atualizar({ tipo: ativo ? undefined : t.valor, periodo: t.valor === 'obrigatoria' ? filtros.periodo : undefined })
                }
                className={chip}
              >
                {t.plural}
              </button>
            )
          })}
          <span className="mx-1 w-px shrink-0 bg-borda" aria-hidden />
          {AREAS.map((a) => {
            const ativo = filtros.area === a.valor
            return (
              <button
                key={a.valor}
                type="button"
                aria-pressed={ativo}
                onClick={() => atualizar({ area: ativo ? undefined : a.valor })}
                className={chip}
                style={ativo ? { backgroundColor: a.cor, borderColor: a.cor, color: '#fff' } : undefined}
              >
                <span className="size-2.5 rounded-full" style={{ backgroundColor: ativo ? '#fff' : a.cor }} aria-hidden />
                {a.rotulo}
              </button>
            )
          })}
        </div>

        {filtros.tipo !== 'optativa' && filtros.tipo !== 'anterior' && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="group" aria-label="Período">
            {periodos.map((p) => {
              const ativo = filtros.periodo === p
              return (
                <button
                  key={p}
                  type="button"
                  aria-pressed={ativo}
                  onClick={() => atualizar({ periodo: ativo ? undefined : p, tipo: ativo ? filtros.tipo : 'obrigatoria' })}
                  className="shrink-0 rounded-full border border-borda bg-white px-3 py-1.5 text-[13px] text-suave transition aria-pressed:border-marca aria-pressed:bg-marca aria-pressed:text-white"
                >
                  {p}º período
                </button>
              )
            })}
          </div>
        )}

        <p className="mt-3 text-sm text-suave" aria-live="polite">
          <strong className="font-normal text-texto">{resultado.length}</strong>{' '}
          {resultado.length === 1 ? 'disciplina' : 'disciplinas'}
          {temFiltro && (
            <button
              type="button"
              onClick={() => setFiltros({ q: '' })}
              className="ml-3 inline-flex items-center gap-1 text-marca hover:underline"
            >
              <X className="size-3.5" aria-hidden /> limpar filtros
            </button>
          )}
        </p>
      </div>

      {resultado.length ? (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resultado.map((d, i) => (
            <li key={d.codigo} className="animate-surgir" style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}>
              <CardDisciplina d={d} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-12 rounded-md bg-white px-6 py-14 text-center shadow-card">
          <p className="text-xl text-texto">Nenhuma disciplina encontrada.</p>
          <p className="mx-auto mt-2 max-w-md text-suave">Tente outro termo ou limpe os filtros.</p>
          <button type="button" onClick={() => setFiltros({ q: '' })} className="botao-marca mt-6">
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  )
}
