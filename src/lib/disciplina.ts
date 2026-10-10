// Tipos e funções puras sobre disciplinas. Não lê arquivos: pode ir para o cliente.

export type Tipo = 'obrigatoria' | 'optativa' | 'anterior'

export type Unidade = { titulo: string; horas: number; itens: [number, string][] }

export type Referencia = { titulo: string; url: string; nota: string }

export type Material = { nome: string; url: string; externo: boolean }

export type Disciplina = {
  codigo: string
  nome: string
  tipo: Tipo
  periodo: number | null
  catalogo: number
  pdf: string
  creditos: number | null
  horas: number | null
  extensao: number | null
  teorica: number | null
  pratica: number | null
  semestres: string | null
  objetivos: string[]
  ementa: string[]
  prerequisitos: string
  oferecimentos: [string, number][]
  conteudo: Unidade[]
  bibliografia_basica: string[]
  bibliografia_complementar: string[]
  referencias: Referencia[]
  materiais: Material[]
  /** Pasta da disciplina no repositório de conteúdo, relativa à raiz dele. */
  pasta: string | null
}

/** Versão enxuta usada na lista e na busca (vai embutida na página). */
export type Resumo = Pick<Disciplina, 'codigo' | 'nome' | 'tipo' | 'periodo' | 'horas'> & {
  area: Area
  /** Texto normalizado para busca: código, nome e ementa. */
  indice: string
  temMaterial: boolean
}

export const TIPOS: { valor: Tipo; rotulo: string; plural: string }[] = [
  { valor: 'obrigatoria', rotulo: 'Obrigatória', plural: 'Obrigatórias' },
  { valor: 'optativa', rotulo: 'Optativa', plural: 'Optativas' },
  { valor: 'anterior', rotulo: 'Matriz anterior', plural: 'Matrizes anteriores' },
]

export function rotuloTipo(tipo: Tipo) {
  return TIPOS.find((t) => t.valor === tipo)!.rotulo
}

export type Area = 'computacao' | 'dados' | 'matematica' | 'gestao' | 'humanidades'

/** Áreas pelo prefixo do código. As cores vêm dos tokens do tema (ADR 0003). */
export const AREAS: { valor: Area; rotulo: string; prefixos: string[]; cor: string }[] = [
  { valor: 'computacao', rotulo: 'Computação e SI', prefixos: ['SIN'], cor: 'var(--color-marca)' },
  { valor: 'dados', rotulo: 'Ciência de Dados e IA', prefixos: ['CDP'], cor: 'var(--color-destaque)' },
  { valor: 'matematica', rotulo: 'Matemática, Estatística e Física', prefixos: ['MAP', 'ESP', 'FRP'], cor: 'var(--color-alerta)' },
  { valor: 'gestao', rotulo: 'Gestão e Economia', prefixos: ['ADE', 'CIC'], cor: 'var(--color-aberto)' },
  { valor: 'humanidades', rotulo: 'Humanidades e Linguagens', prefixos: ['CRP', 'NUR'], cor: 'var(--color-fechado)' },
]

export function areaDe(codigo: string): Area {
  const prefixo = codigo.slice(0, 3)
  return AREAS.find((a) => a.prefixos.includes(prefixo))?.valor ?? 'computacao'
}

export function dadosArea(area: Area) {
  return AREAS.find((a) => a.valor === area)!
}

export function slug(codigo: string) {
  return codigo.toLowerCase()
}

export function caminho(codigo: string) {
  return `/disciplinas/${slug(codigo)}/`
}

const CODIGO = /\b([A-Z]{3}) ?(\d{3})(\*?)/g

export type TrechoPre = { texto: string } | { codigo: string; rotulo: string; correquisito: boolean }

/**
 * Quebra o texto de pré-requisitos do catálogo ("(MAP 191 ou MAP 195) e SIN 216*") em trechos de texto e códigos.
 * "1800 OBR" vira texto legível.
 */
export function trechosPrerequisito(texto: string): TrechoPre[] {
  const legivel = texto.replace(/\b(\d+) OBR\b/g, '$1 h de disciplinas obrigatórias concluídas')
  const trechos: TrechoPre[] = []
  let ultimo = 0
  for (const m of legivel.matchAll(CODIGO)) {
    if (m.index > ultimo) trechos.push({ texto: legivel.slice(ultimo, m.index) })
    trechos.push({ codigo: m[1] + m[2], rotulo: `${m[1]} ${m[2]}`, correquisito: m[3] === '*' })
    ultimo = m.index + m[0].length
  }
  if (ultimo < legivel.length) trechos.push({ texto: legivel.slice(ultimo) })
  return trechos
}

export function codigosPrerequisito(texto: string): string[] {
  return [...texto.matchAll(CODIGO)].map((m) => m[1] + m[2])
}

/** Disciplinas da matriz vigente que citam `codigo` como pré-requisito. */
export function liberadas(codigo: string, todas: Pick<Disciplina, 'codigo' | 'tipo' | 'prerequisitos'>[]) {
  return todas
    .filter((d) => d.tipo !== 'anterior' && codigosPrerequisito(d.prerequisitos).includes(codigo))
    .map((d) => d.codigo)
}
