# Plano — 001 Site de disciplinas

## Arquitetura

```
conteudo/ (submodule, branch master)
  dados/catalogo-<ano>.json ─┐
  dados/referencias.json ────┼─> src/lib/catalogo.ts (fs + zod, só no build)
  <CODIGO>-<Nome>/ arquivos ─┘          │
                                         ├─> páginas estáticas (app router, output: export)
src/lib/busca.ts (puro, cliente) <───────┘─> /api/disciplinas.json (route handler force-static)
```

- `src/lib/catalogo.ts`: lê o catálogo mais recente (`catalogo-*.json`), valida com zod, junta referências e
  materiais. Erro de esquema vira exceção com código e campo.
- `src/lib/disciplina.ts`: tipos e funções puras (área pelo prefixo, pré-requisitos, rótulos). Pode ir ao cliente.
- `src/lib/busca.ts`: normalização (sem acento, minúsculas) e filtro. Pode ir ao cliente.
- Pastas no submodule: procura `<CODIGO>-*` na raiz e em `Z-Matrizes Anteriores/`, sem reconstruir o nome. Assim
  renomear uma pasta não quebra o site.
- Materiais: arquivos da pasta, exceto `README.md`, `keep` e `.DS_Store`. Submódulos do repositório de conteúdo
  (lidos de `conteudo/.gitmodules`) aparecem como link externo.

## Decisões

- [ADR 0001](../../adr/0001-conteudo-por-submodule.md): conteúdo por submodule; o build usa o `master` mais recente.
- [ADR 0002](../../adr/0002-next-estatico-no-cloudflare.md): Next estático (`output: 'export'`) servido como assets
  de um Worker.
- [ADR 0003](../../adr/0003-tema-compartilhado-com-o-guia.md): tema copiado do Guia CASI, com a origem registrada.

## Rotas

| Rota | Arquivo |
|---|---|
| `/` | `src/app/page.tsx` |
| `/disciplinas/` | `src/app/disciplinas/page.tsx` + `src/components/explorador.tsx` (cliente) |
| `/disciplinas/<codigo>/` | `src/app/disciplinas/[codigo]/page.tsx` (`generateStaticParams`, `dynamicParams = false`) |
| `/matriz/` | `src/app/matriz/page.tsx` |
| `/sobre/` | `src/app/sobre/page.tsx` |
| `/api/disciplinas.json` | `src/app/api/disciplinas.json/route.ts` |

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`): checkout com submodule, `git submodule update --remote`,
`yarn test`, `yarn build` e, se houver `CLOUDFLARE_API_TOKEN`, `wrangler deploy`. Roda em push no `main`, uma vez
por dia (para pegar conteúdo novo) e manualmente.
