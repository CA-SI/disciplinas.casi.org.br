// Guias do curso: conteudo/guias/*.md (formato na spec 002 do repositório de conteúdo). Roda só no build.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { Marked, type Tokens } from 'marked'
import { parse } from 'yaml'
import { z } from 'zod'
import { urlGithub } from './catalogo.ts'
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
  if (href.startsWith('#') || href.startsWith('/')) return href
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

const escaparHtml = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Markdown → HTML. HTML cru vira texto (como no Guia CASI); link quebrado lança erro com o guia. */
export function renderizarGuia(guia: Guia, raiz: string): string {
  const markdown = new Marked({
    gfm: true,
    async: false,
    renderer: { html: ({ text }) => escaparHtml(text) },
    walkTokens(token) {
      if (token.type === 'link') {
        const link = token as Tokens.Link
        try {
          link.href = resolverLink(link.href, raiz)
        } catch (e) {
          throw new Error(`${PASTA}/${guia.slug}.md: ${(e as Error).message}`)
        }
      }
    },
  })
  return markdown.parse(guia.corpo) as string
}
