import 'server-only'
import path from 'node:path'
import { carregarCatalogo, resumir, type Catalogo } from './catalogo.ts'
import { caminho, liberadas, type Disciplina } from './disciplina.ts'
import { ordenar } from './busca.ts'

export const RAIZ_CONTEUDO = path.join(process.cwd(), 'conteudo')

let cache: Catalogo | undefined

/** Catálogo do submodule, lido uma vez por build. */
export function catalogo(): Catalogo {
  cache ??= carregarCatalogo(RAIZ_CONTEUDO)
  return cache
}

export function disciplinas(): Disciplina[] {
  return catalogo().disciplinas
}

export function resumos() {
  return disciplinas().map(resumir).sort(ordenar)
}

export function porCodigo(codigo: string): Disciplina | undefined {
  return disciplinas().find((d) => d.codigo === codigo.toUpperCase())
}

export function liberadasPor(codigo: string) {
  return liberadas(codigo, disciplinas())
}

export function nomeDe(codigo: string) {
  return porCodigo(codigo)?.nome
}

export function existe(codigo: string) {
  return Boolean(porCodigo(codigo))
}

export { caminho }
