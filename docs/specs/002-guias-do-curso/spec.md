# 002 — Guias do curso no site

## Contexto

O repositório de conteúdo ganhou guias transversais em `guias/*.md`, com formato definido na
[spec 002 de lá](https://github.com/CA-SI/Sistemas-de-Informacao_UFV-CRP/blob/master/docs/specs/002-guias-do-curso/spec.md).
O Guia CASI tem o mesmo padrão de guias (Markdown com fontes), e este site o acompanha.

## Requisitos

1. `/guias/`: lista dos guias por `ordem`. `/guias/<slug>/`: texto, fontes e data de atualização.
2. Seção "Comece por aqui" na home e "Guias" na navegação.
3. Links do Markdown:
   - pasta de disciplina (`../SIN488-.../`) → `/disciplinas/sin488/`;
   - outro guia (`outro-guia.md`) → `/guias/outro-guia/`;
   - outro arquivo ou pasta do repositório de conteúdo → link para o GitHub;
   - link relativo que não existe no conteúdo quebra o build, com guia e link na mensagem.
   - link externo só com `http`, `https` ou `mailto`; caminho absoluto só se for rota real do site (disciplina ou
     guia existentes, `/matriz/`, `/sobre/`), o que barra URL relativa ao protocolo (`//host`);
   - imagens: só `https` externa ou arquivo do conteúdo (servido pelo raw do GitHub);
   - links por referência e destinos entre `<` e `>` passam pela mesma validação.
4. HTML cru no Markdown vira texto (só a sintaxe Markdown é aceita).
5. Na página de disciplina: trilha de navegação (Disciplinas › período › código) e "Viu algo errado?" com link para
   abrir issue no repositório de conteúdo.
6. `sitemap.xml` e `robots.txt`.

## Critérios de aceite

- Frontmatter inválido quebra o build com arquivo e campo.
- Testes de leitura, validação e conversão de links.
- Páginas de guia geradas no export estático e listadas no sitemap.

## Fora de escopo

- Edição de guias pelo site.
