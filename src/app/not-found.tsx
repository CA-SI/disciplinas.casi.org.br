import Link from 'next/link'

export default function NaoEncontrado() {
  return (
    <div className="container-guia flex flex-col items-center py-24 text-center">
      <p className="text-7xl font-light text-marca-forte">404</p>
      <h1 className="mt-4 text-3xl">Página não encontrada</h1>
      <p className="mt-3 max-w-md text-suave">O endereço pode ter mudado. Procure a disciplina pela busca.</p>
      <Link href="/disciplinas/" className="botao-marca mt-8">
        Buscar disciplinas
      </Link>
    </div>
  )
}
