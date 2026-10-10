// Guias do curso: conteudo/guias/*.md (formato na spec 002 do repositório de conteúdo). Roda só no build.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { Marked, type Tokens } from 'marked'
import { parse } from 'yaml'
import { z } from 'zod'
import { localizarPasta, urlGithub } from './catalogo.ts'
import { REPO_CONTEUDO } from './site.ts'
import { caminho } from './disciplina.ts'

/** Ícones aceitos no frontmatter; cada um tem componente em src/components/icone-guia.tsx. */
export const ICONES_GUIA = ['map', 'graduation-cap', 'hand-heart', 'compass', 'history', 'book-open', 'users', 'calendar'] as const

const esquemaFrontmatter = z.object({
  titulo: z.string().min(1),
  resumo: z.string().min(1).max(160),
  icone: z.enum(ICONES_GUIA),
  ordem: z.number().int(),
  atualizado_em: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'use AAAA-MM-DD'),
  fontes: z.array(z.object({ titulo: z.string().min(1), url: z.url() })).min(1),
})

export type Guia = z.infer<typeof esquemaFrontmatter> & { slug: string; corpo: string }

const PASTA = 'guias'

export function caminhoGuia(slug: string) {
  return `/guias/${slug}/`
}

export function lerGuias(raiz: string): Guia[] {
  const dir = path.join(raiz, PASTA)
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .map((arquivo) => {
      const slug = arquivo.replace(/\.md$/, '')
      const origem = `${PASTA}/${arquivo}`
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) throw new Error(`${origem}: nome de arquivo fora do padrão slug`)
      const texto = readFileSync(path.join(dir, arquivo), 'utf-8')
      const m = texto.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
      if (!m) throw new Error(`${origem}: frontmatter ausente`)
      let dados: unknown
      try {
        dados = parse(m[1])
      } catch (e) {
        throw new Error(`${origem}: frontmatter não é YAML válido: ${(e as Error).message.split('\n')[0]}`)
      }
      const fm = esquemaFrontmatter.safeParse(dados)
      if (!fm.success) {
        throw new Error(`${origem}: ${fm.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`)
      }
      return { ...fm.data, slug, corpo: m[2] }
    })
    .sort((a, b) => a.ordem - b.ordem || a.titulo.localeCompare(b.titulo))
}

/**
 * Converte um link do Markdown do guia. Externos e âncoras passam direto; relativos são resolvidos a partir de
 * `guias/` dentro do repositório de conteúdo e precisam existir.
 */
export function resolverLink(href: string, raiz: string): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
    // O HTML vai por dangerouslySetInnerHTML: só esquemas seguros passam (bloqueia javascript:, data: etc.).
    if (/^(https?|mailto):/i.test(href)) return href
    throw new Error(`esquema de link não permitido: ${href}`)
  }
  if (href.startsWith('#')) return href
  if (href.startsWith('/')) return validarRotaInterna(href, raiz)
  const [alvo, ancora = ''] = href.split('#')
  const relativo = path.posix.normalize(path.posix.join(PASTA, decodeURI(alvo))).replace(/\/$/, '')
  if (relativo.startsWith('..')) throw new Error(`link sai do repositório de conteúdo: ${href}`)
  const absoluto = path.join(raiz, relativo)
  if (!existsSync(absoluto)) throw new Error(`link quebrado: ${href}`)
  const sufixo = ancora ? `#${ancora}` : ''

  const ultimo = relativo.split('/').at(-1)!
  const disciplina = ultimo.match(/^([A-Z]{3}\d{3})-/)
  if (disciplina && statSync(absoluto).isDirectory()) return caminho(disciplina[1]) + sufixo
  if (relativo.startsWith(`${PASTA}/`) && relativo.endsWith('.md') && ultimo !== 'README.md') {
    return caminhoGuia(ultimo.replace(/\.md$/, '')) + sufixo
  }
  return urlGithub(relativo, statSync(absoluto).isDirectory() ? 'tree' : 'blob') + sufixo
}

/**
 * Caminho absoluto só é aceito se for rota real do site. Isso barra URL relativa ao protocolo ("//evil.com",
 * "/\\evil.com"), que o navegador trata como externa.
 */
const ROTA_INTERNA = /^\/(?:disciplinas\/(?:([a-z]{3}\d{3})\/)?|guias\/(?:([a-z0-9-]+)\/)?|matriz\/|sobre\/)?(?:#[\w-]*)?$/

function validarRotaInterna(href: string, raiz: string) {
  const m = href.match(ROTA_INTERNA)
  if (!m) throw new Error(`link interno fora das rotas do site: ${href}`)
  const [, codigo, slug] = m
  if (codigo && !localizarPasta(raiz, codigo.toUpperCase())) throw new Error(`disciplina inexistente: ${href}`)
  if (slug && !existsSync(path.join(raiz, PASTA, `${slug}.md`))) throw new Error(`guia inexistente: ${href}`)
  return href
}

/** Imagem: só https externa ou arquivo do repositório de conteúdo (servido pelo raw do GitHub). */
export function resolverImagem(src: string, raiz: string): string {
  if (/^https:\/\//i.test(src)) return src
  if (/^[a-z][a-z0-9+.-]*:/i.test(src) || src.startsWith('/')) throw new Error(`imagem não permitida: ${src}`)
  const relativo = path.posix.normalize(path.posix.join(PASTA, decodeURI(src)))
  if (relativo.startsWith('..') || !existsSync(path.join(raiz, relativo))) throw new Error(`imagem quebrada: ${src}`)
  const raw = REPO_CONTEUDO.replace('https://github.com/', 'https://raw.githubusercontent.com/')
  return `${raw}/master/${relativo.split('/').map(encodeURIComponent).join('/')}`
}

const escaparHtml = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Markdown → HTML. HTML cru vira texto (como no Guia CASI); link quebrado lança erro com o guia. */
export function renderizarGuia(guia: Guia, raiz: string): string {
  const markdown = new Marked({
    gfm: true,
    async: false,
    renderer: { html: ({ text }) => escaparHtml(text) },
    walkTokens(token) {
      // Links por referência e destinos entre <> também chegam aqui como tokens link/image.
      if (token.type !== 'link' && token.type !== 'image') return
      const t = token as Tokens.Link | Tokens.Image
      try {
        t.href = token.type === 'link' ? resolverLink(t.href, raiz) : resolverImagem(t.href, raiz)
      } catch (e) {
        throw new Error(`${PASTA}/${guia.slug}.md: ${(e as Error).message}`)
      }
    },
  })
  return markdown.parse(guia.corpo) as string
}
