# 0002 — Next estático no Cloudflare

## Status

Aceito.

## Contexto

O pedido era um site no estilo JKAN (catálogo estático com busca e filtros). O Guia CASI usa Next 16, React 19,
Tailwind 4 e Cloudflare. Usar a mesma stack permite compartilhar tema e componentes entre os dois sites da CA-SI.
JKAN (Jekyll) exigiria reescrever o visual em Liquid/SCSS.

## Decisão

Next 16 com `output: 'export'` e `trailingSlash: true`. Todas as páginas são geradas no build; a busca e os filtros
rodam no navegador sobre um índice embutido na página. O diretório `out/` é publicado como assets estáticos de um
Worker (`wrangler.jsonc`), sem `@opennextjs/cloudflare`, porque não há código de servidor.

## Consequências

- Não há API dinâmica. O JSON público é gerado no build (`/api/disciplinas.json`).
- `next/image` funciona sem otimização (`images.unoptimized`).
- Se um dia houver formulário (como as sugestões do guia), será preciso migrar para OpenNext ou usar um Worker à parte.
