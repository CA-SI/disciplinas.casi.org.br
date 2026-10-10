// Leitura do conteúdo do submodule `conteudo/` (ADR 0001). Roda só no build.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import { normalizar } from './busca.ts'
import { areaDe, type Disciplina, type Material, type Referencia, type Resumo } from './disciplina.ts'
import { REPO_CONTEUDO } from './site.ts'

export { REPO_CONTEUDO }

const BRANCH = 'master'
const PASTA_ANTERIORES = 'Z-Matrizes Anteriores'
const IGNORAR = new Set(['README.md', 'keep', '.DS_Store'])

const numero = z.number().nullable()

const esquemaDisciplina = z.object({
  codigo: z.string().regex(/^[A-Z]{3}\d{3}$/),
  nome: z.string().min(1),
  tipo: z.enum(['obrigatoria', 'optativa', 'anterior']),
  periodo: z.number().int().min(1).max(10).nullable(),
  catalogo: z.number().int(),
  pdf: z.url(),
  creditos: numero,
  horas: numero,
  extensao: numero,
  teorica: numero,
  pratica: numero,
  semestres: z.string().nullable(),
  objetivos: z.array(z.string()),
  ementa: z.array(z.string()),
  prerequisitos: z.string(),
  oferecimentos: z.array(z.tuple([z.string(), z.number()])),
  conteudo: z.array(
    z.object({ titulo: z.string(), horas: z.number(), itens: z.array(z.tuple([z.number(), z.string()])) }),
  ),
  bibliografia_basica: z.array(z.string()),
  bibliografia_complementar: z.array(z.string()),
})

const esquemaCatalogo = z.object({
  ano: z.number().int(),
  fonte: z.url(),
  quadro: z.record(z.string(), z.string().nullable()).optional(),
  disciplinas: z.record(z.string(), z.unknown()),
})

const esquemaReferencias = z.record(
  z.string(),
  z.array(z.object({ titulo: z.string(), url: z.url(), nota: z.string() })),
)

export type Catalogo = {
  ano: number
  fonte: string
  quadro: Record<string, string | null>
  disciplinas: Disciplina[]
}

function lerJson(arquivo: string): unknown {
  return JSON.parse(readFileSync(arquivo, 'utf-8'))
}

function descreverErro(erro: z.ZodError) {
  return erro.issues.map((i) => `${i.path.join('.') || '(raiz)'}: ${i.message}`).join('; ')
}

/** Catálogo mais recente em `dados/` (`catalogo-2026.json`, `catalogo-2027.json`...). */
export function arquivoCatalogo(raiz: string) {
  const dados = path.join(raiz, 'dados')
  if (!existsSync(dados)) {
    throw new Error(`Conteúdo não encontrado em ${dados}. Rode \`git submodule update --init\`.`)
  }
  const arquivos = readdirSync(dados).filter((f) => /^catalogo-\d{4}\.json$/.test(f)).sort()
  if (!arquivos.length) throw new Error(`Nenhum catalogo-<ano>.json em ${dados}`)
  return path.join(dados, arquivos.at(-1)!)
}

/** Pasta `<CODIGO>-*` na raiz ou em `Z-Matrizes Anteriores/`. Não reconstrói o nome: renomear não quebra. */
export function localizarPasta(raiz: string, codigo: string): string | null {
  for (const base of ['', PASTA_ANTERIORES]) {
    const dir = path.join(raiz, base)
    if (!existsSync(dir)) continue
    const achada = readdirSync(dir).find((nome) => nome.startsWith(`${codigo}-`) && statSync(path.join(dir, nome)).isDirectory())
    if (achada) return base ? `${base}/${achada}` : achada
  }
  return null
}

function codificar(caminhoRelativo: string) {
  return caminhoRelativo.split('/').map(encodeURIComponent).join('/')
}

export function urlGithub(caminhoRelativo: string, tipo: 'blob' | 'tree') {
  return `${REPO_CONTEUDO}/${tipo}/${BRANCH}/${codificar(caminhoRelativo)}`
}

/** Submódulos do repositório de conteúdo: caminho → URL. */
function submodulos(raiz: string): Map<string, string> {
  const arquivo = path.join(raiz, '.gitmodules')
  if (!existsSync(arquivo)) return new Map()
  const texto = readFileSync(arquivo, 'utf-8')
  return new Map([...texto.matchAll(/path = (.+)\n\s*url = (.+)/g)].map((m) => [m[1].trim(), m[2].trim()]))
}

export function listarMateriais(raiz: string, pasta: string): Material[] {
  const subs = submodulos(raiz)
  const materiais: Material[] = []
  const percorrer = (relativo: string) => {
    for (const nome of readdirSync(path.join(raiz, relativo)).sort((a, b) => a.localeCompare(b))) {
      if (IGNORAR.has(nome)) continue
      const filho = `${relativo}/${nome}`
      const externo = subs.get(filho)
      if (externo) {
        materiais.push({ nome: filho.slice(pasta.length + 1), url: externo.replace(/\.git$/, ''), externo: true })
      } else if (statSync(path.join(raiz, filho)).isDirectory()) {
        percorrer(filho)
      } else {
        materiais.push({ nome: filho.slice(pasta.length + 1), url: urlGithub(filho, 'blob'), externo: false })
      }
    }
  }
  percorrer(pasta)
  return materiais
}

export function carregarCatalogo(raiz: string): Catalogo {
  const arquivo = arquivoCatalogo(raiz)
  const bruto = esquemaCatalogo.safeParse(lerJson(arquivo))
  if (!bruto.success) throw new Error(`${arquivo}: ${descreverErro(bruto.error)}`)

  const arqRefs = path.join(raiz, 'dados', 'referencias.json')
  let referencias: Record<string, Referencia[]> = {}
  if (existsSync(arqRefs)) {
    const r = esquemaReferencias.safeParse(lerJson(arqRefs))
    if (!r.success) throw new Error(`${arqRefs}: ${descreverErro(r.error)}`)
    referencias = r.data
  }

  const disciplinas = Object.entries(bruto.data.disciplinas).map(([codigo, valor]) => {
    const d = esquemaDisciplina.safeParse(valor)
    if (!d.success) throw new Error(`${arquivo}: disciplina ${codigo}: ${descreverErro(d.error)}`)
    const pasta = localizarPasta(raiz, d.data.codigo)
    return {
      ...d.data,
      referencias: referencias[d.data.codigo] ?? [],
      materiais: pasta ? listarMateriais(raiz, pasta) : [],
      pasta,
    } satisfies Disciplina
  })

  return { ano: bruto.data.ano, fonte: bruto.data.fonte, quadro: bruto.data.quadro ?? {}, disciplinas }
}

export function resumir(d: Disciplina): Resumo {
  return {
    codigo: d.codigo,
    nome: d.nome,
    tipo: d.tipo,
    periodo: d.periodo,
    horas: d.horas,
    area: areaDe(d.codigo),
    indice: normalizar([d.codigo, `${d.codigo.slice(0, 3)} ${d.codigo.slice(3)}`, d.nome, ...d.ementa].join(' ')),
    temMaterial: d.materiais.length > 0,
  }
}
