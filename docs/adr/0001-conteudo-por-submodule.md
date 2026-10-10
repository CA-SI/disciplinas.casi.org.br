# 0001 — Conteúdo por submodule

## Status

Aceito.

## Contexto

O conteúdo das disciplinas (catálogo, referências, materiais) já vive em CA-SI/Sistemas-de-Informacao_UFV-CRP, com
gerador próprio (`scripts/catalogo.py`) e fluxo de contribuição por pull request. O site precisa desses dados no
build, sem criar uma segunda fonte.

## Decisão

O repositório de conteúdo entra como submodule em `conteudo/`, rastreando a branch `master`. O build de produção roda
`git submodule update --remote` antes de compilar, então publica sempre o `master` mais recente do conteúdo. O
ponteiro gravado no repositório do site serve para desenvolvimento local reproduzível.

## Consequências

- Uma contribuição aceita no repositório de conteúdo aparece no site no próximo deploy (diário ou manual), sem PR no
  site.
- Mudança de formato no JSON do conteúdo pode quebrar o build. A validação zod aponta disciplina e campo, e o
  deploy anterior continua no ar.
- Clonar exige `git clone --recurse-submodules` (ou `git submodule update --init`).
