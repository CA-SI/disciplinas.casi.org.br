import type { MetadataRoute } from 'next'
import { disciplinas, guias } from '@/lib/conteudo'
import { caminho } from '@/lib/disciplina'
import { site } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const fixas = ['/', '/disciplinas/', '/matriz/', '/guias/', '/sobre/']
  return [
    ...fixas.map((p) => ({ url: `${site.url}${p}` })),
    ...guias().map((g) => ({ url: `${site.url}/guias/${g.slug}/`, lastModified: g.atualizado_em })),
    ...disciplinas().map((d) => ({ url: `${site.url}${caminho(d.codigo)}` })),
  ]
}
