# 0003 — Tema compartilhado com o Guia CASI

## Status

Aceito.

## Contexto

Os dois sites da CA-SI devem ter a mesma identidade. O Guia CASI é o dono do tema (`src/app/tema.css`: tokens
`@theme` e classes `.container-guia`, `.botao*`, `.campo`, `.rotulo`, `.texto-corrido`). O repositório do guia é
privado, então o build público deste site não consegue importá-lo por submodule.

## Decisão

`src/app/tema.css` é uma cópia idêntica do arquivo do guia, com um cabeçalho que registra a origem. Mudanças de
identidade são feitas no guia e copiadas para cá. Os nomes de token e de classe são os mesmos, para que componentes
possam migrar entre os sites sem adaptação.

## Consequências

- Divergência é possível se alguém editar a cópia. O cabeçalho do arquivo proíbe isso.
- Se o guia ficar público, a cópia pode virar submodule ou pacote.
