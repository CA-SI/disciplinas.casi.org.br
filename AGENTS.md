# AGENTS.md — disciplinas.casi.org.br

Catálogo estático das disciplinas de Sistemas de Informação da UFV-CRP. Este arquivo é a fonte de verdade de stack,
convenções e comandos para pessoas e agentes.

## Stack

- Next 16.3.8 com `output: 'export'` (sem servidor), React 19, Tailwind 4, lucide-react, zod 4.
- Yarn 4 (`nodeLinker: node-modules`), Node >= 22.18. Os testes rodam TypeScript direto com `node --test`.
- Deploy: `out/` como assets de um Worker do Cloudflare (`wrangler.jsonc`), via GitHub Actions.

## Conteúdo

- `conteudo/` é um submodule de CA-SI/Sistemas-de-Informacao_UFV-CRP (branch `master`). **Nunca edite dados de
  disciplina aqui**: altere o repositório de conteúdo. Atualize o ponteiro com `yarn conteudo:atualizar`.
- Leitura e validação: `src/lib/catalogo.ts` (só build). Funções puras que vão ao cliente: `src/lib/disciplina.ts` e
  `src/lib/busca.ts`. Não importe `catalogo.ts` nem `conteudo.ts` em componente `'use client'`.

## Visual

- `src/app/tema.css` é cópia do Guia CASI (ADR 0003). Não edite: mude no guia e copie.
- Use os tokens (`bg-marca`, `text-suave`, `shadow-card`...) e as classes `.container-guia`, `.botao-*`, `.campo`.
- Contraste (regra do tema): a cor base (`marca`, `destaque`, `aberto`...) é só para decoração e preenchimento grande.
  Texto, botão e selo com texto usam a variante `-forte`; `-clara` é fundo suave; hero e rodapé usam `noite`. Nas
  áreas (`src/lib/disciplina.ts`), `cor` é decoração e `corForte` vai com texto. `src/lib/contraste.test.ts` verifica.
- Textos de interface em português do Brasil, identificadores em português (como no guia).

## Comandos

```bash
git clone --recurse-submodules https://github.com/CA-SI/disciplinas.casi.org.br
yarn install
yarn dev            # http://localhost:3000
yarn test           # node --test
yarn lint && yarn typecheck
yarn build          # gera out/
yarn preview        # build + wrangler dev
```

## Documentação

- Specs: `docs/specs/<NNN>-<feature>/` (spec, plan, tasks). Contrato público de `/api/disciplinas.json`:
  `docs/specs/001-site-disciplinas/spec.md`.
- Decisões: `docs/adr/`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
