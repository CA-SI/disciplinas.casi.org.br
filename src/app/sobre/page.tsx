import type { Metadata } from 'next'
import { CabecalhoPagina } from '@/components/cabecalho-pagina'
import { urlGithub } from '@/lib/catalogo'
import { site } from '@/lib/site'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Sobre e contribuição',
  description: 'O que é o Disciplinas CASI, de onde vêm os dados e como enviar materiais.',
}

export default function Sobre() {
  return (
    <>
      <CabecalhoPagina sobretitulo="Disciplinas CASI" titulo="Sobre e contribuição" />
      <div className="container-guia py-12 lg:py-16">
        <div className="texto-corrido max-w-3xl rounded-md bg-white p-6 shadow-card sm:p-10">
          <p>
            O <strong className="font-normal text-texto">Disciplinas CASI</strong> reúne, para cada disciplina de
            Sistemas de Informação da UFV – Campus Rio Paranaíba, o programa oficial, referências abertas e materiais
            compartilhados por estudantes. É mantido pelo CASI, o centro acadêmico do curso, junto com o{' '}
            <a href={site.guia}>Guia CASI</a>.
          </p>

          <h2>De onde vêm os dados</h2>
          <p>
            Ementa, objetivos, conteúdo programático, carga horária, pré-requisitos e bibliografia são transcritos dos
            programas analíticos do <a href="https://catalogo.ufv.br/">Catálogo de Graduação da UFV</a>. Cada página
            tem link para o PDF oficial, que prevalece em caso de divergência. As referências úteis e os materiais são
            da comunidade.
          </p>
          <p>
            Todo o conteúdo fica no repositório <a href={site.repoConteudo}>CA-SI/Sistemas-de-Informacao_UFV-CRP</a>,
            e este site é gerado a partir dele. Uma contribuição aceita lá aparece aqui no próximo deploy, que roda
            todos os dias.
          </p>

          <h2>Como contribuir</h2>
          <ol className="list-decimal space-y-2 pl-6">
            <li>
              Faça um fork de <a href={site.repoConteudo}>Sistemas-de-Informacao_UFV-CRP</a>.
            </li>
            <li>
              Coloque o material (PDF, listas, resumos) na pasta da disciplina, por exemplo{' '}
              <code className="rounded bg-fundo px-1">SIN215-Programação e Estruturas de Dados I/</code>. O botão
              &ldquo;Enviar material&rdquo; em cada página leva à pasta certa.
            </li>
            <li>
              Para sugerir um livro, curso ou ferramenta, edite{' '}
              <a href={urlGithub('dados/referencias.json', 'blob')}>dados/referencias.json</a>.
            </li>
            <li>Abra um pull request. A equipe do CASI revisa.</li>
          </ol>
          <p>
            Envie apenas material que você tem direito de compartilhar. Não envie provas sem autorização do professor.
          </p>

          <h2>Para desenvolvedores</h2>
          <p>
            O código do site está em <a href={site.repoSite}>CA-SI/disciplinas.casi.org.br</a>. A lista de disciplinas
            também é publicada em JSON em <a href="/api/disciplinas.json">/api/disciplinas.json</a>, com contrato
            descrito na especificação do repositório.
          </p>
        </div>
      </div>
    </>
  )
}
