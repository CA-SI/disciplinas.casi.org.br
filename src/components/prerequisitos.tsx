import Link from 'next/link'
import { caminho, trechosPrerequisito } from '@/lib/disciplina'

/** Texto de pré-requisitos com os códigos que existem no catálogo virando link. */
export function Prerequisitos({ texto, existentes }: { texto: string; existentes: Set<string> }) {
  const trechos = trechosPrerequisito(texto)
  if (!trechos.length) return <span className="text-suave">Nenhum</span>
  return (
    <span>
      {trechos.map((t, i) =>
        'texto' in t ? (
          <span key={i}>{t.texto}</span>
        ) : existentes.has(t.codigo) ? (
          <Link key={i} href={caminho(t.codigo)} className="font-normal text-marca hover:underline" title={t.correquisito ? 'Correquisito: pode ser cursada no mesmo semestre' : undefined}>
            {t.rotulo}
            {t.correquisito && '*'}
          </Link>
        ) : (
          <span key={i} className="font-normal">
            {t.rotulo}
            {t.correquisito && '*'}
          </span>
        ),
      )}
    </span>
  )
}
