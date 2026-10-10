import { dadosArea, rotuloTipo, type Area, type Tipo } from '@/lib/disciplina'

const COR_TIPO: Record<Tipo, string> = {
  obrigatoria: 'bg-marca/10 text-marca-escura',
  optativa: 'bg-destaque/10 text-destaque-escura',
  anterior: 'bg-borda text-suave',
}

export function SeloTipo({ tipo, periodo }: { tipo: Tipo; periodo?: number | null }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-normal ${COR_TIPO[tipo]}`}>
      {rotuloTipo(tipo)}
      {tipo === 'obrigatoria' && periodo ? ` · ${periodo}º período` : ''}
    </span>
  )
}

/** Círculo colorido com a sigla do departamento, como o selo de categoria do guia. */
export function SeloArea({ codigo, area, className = '' }: { codigo: string; area: Area; className?: string }) {
  return (
    <span
      className={`inline-flex size-12 shrink-0 items-center justify-center rounded-full text-xs font-medium tracking-wide text-white shadow-md ring-4 ring-white ${className}`}
      style={{ backgroundColor: dadosArea(area).cor }}
      title={dadosArea(area).rotulo}
    >
      {codigo.slice(0, 3)}
    </span>
  )
}
