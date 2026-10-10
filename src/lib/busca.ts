import type { Area, Resumo, Tipo } from './disciplina.ts'

export type Filtros = {
  q: string
  tipo?: Tipo
  periodo?: number
  area?: Area
}

/** Minúsculas e sem acento, para a busca não depender de digitação. */
export function normalizar(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

/** Ordem: obrigatórias por período, depois optativas e matrizes anteriores, cada grupo por código. */
const ORDEM_TIPO: Record<Tipo, number> = { obrigatoria: 0, optativa: 1, anterior: 2 }

export function ordenar(a: Resumo, b: Resumo) {
  return (
    ORDEM_TIPO[a.tipo] - ORDEM_TIPO[b.tipo] ||
    (a.periodo ?? 99) - (b.periodo ?? 99) ||
    a.codigo.localeCompare(b.codigo)
  )
}

export function filtrar(lista: Resumo[], f: Filtros): Resumo[] {
  // Cada palavra precisa aparecer em algum lugar: "estrutura dados" acha "Estruturas de Dados".
  const termos = normalizar(f.q).split(/\s+/).filter(Boolean)
  return lista
    .filter(
      (d) =>
        (!f.tipo || d.tipo === f.tipo) &&
        (!f.periodo || d.periodo === f.periodo) &&
        (!f.area || d.area === f.area) &&
        termos.every((t) => d.indice.includes(t)),
    )
    .sort(ordenar)
}
