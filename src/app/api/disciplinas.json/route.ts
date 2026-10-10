import { catalogo } from '@/lib/conteudo'
import { caminho } from '@/lib/disciplina'
import { site } from '@/lib/site'

// Contrato público definido em docs/specs/001-site-disciplinas/spec.md. Mudança incompatível incrementa `versao`.
export const dynamic = 'force-static'

export function GET() {
  const cat = catalogo()
  return Response.json({
    versao: 1,
    catalogo: cat.ano,
    fonte: cat.fonte,
    disciplinas: cat.disciplinas.map((d) => ({
      codigo: d.codigo,
      nome: d.nome,
      tipo: d.tipo,
      periodo: d.periodo,
      horas: d.horas,
      url: `${site.url}${caminho(d.codigo)}`,
    })),
  })
}
