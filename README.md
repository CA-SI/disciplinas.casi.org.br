# Disciplinas CASI

Catálogo das disciplinas de **Sistemas de Informação da UFV – Campus Rio Paranaíba**: ementa, objetivos, conteúdo
programático, bibliografia, referências abertas e materiais da comunidade, com busca e filtros. Publicado em
<https://disciplinas.casi.org.br>.

O conteúdo vem do repositório
[CA-SI/Sistemas-de-Informacao_UFV-CRP](https://github.com/CA-SI/Sistemas-de-Informacao_UFV-CRP), incluído como
submodule em `conteudo/`. **Para enviar material ou corrigir dados, contribua lá**; este repositório só gera o site.
O visual segue o [Guia CASI](https://guia.casi.org.br).

## Desenvolvimento

```bash
git clone --recurse-submodules https://github.com/CA-SI/disciplinas.casi.org.br
cd disciplinas.casi.org.br
yarn install
yarn dev        # http://localhost:3000
```

| Comando | O que faz |
|---|---|
| `yarn test` | Testes (`node --test`) |
| `yarn lint` / `yarn typecheck` | ESLint e TypeScript |
| `yarn build` | Gera o site estático em `out/` |
| `yarn conteudo:atualizar` | Puxa o `master` mais recente do conteúdo |
| `yarn preview` | Build e servidor local do Cloudflare (`wrangler dev`) |

## Páginas

| Rota | Conteúdo |
|---|---|
| `/` | Busca, números da matriz, períodos e optativas |
| `/disciplinas/` | Lista com busca (inclusive na ementa) e filtros por tipo, período e área |
| `/disciplinas/<codigo>/` | Página completa da disciplina |
| `/matriz/` | Obrigatórias por período, com pré-requisitos |
| `/guias/` e `/guias/<slug>/` | Guias do curso (matriz, TCC, extensão, optativas, matrizes anteriores), de `conteudo/guias/` |
| `/sobre/` | Fontes e como contribuir |
| `/api/disciplinas.json` | Lista em JSON ([contrato](docs/specs/001-site-disciplinas/spec.md#contrato-apidisciplinasjson)) |

## Deploy

O workflow [`deploy.yml`](.github/workflows/deploy.yml) roda em push no `main`, uma vez por dia e manualmente. Ele
atualiza o submodule para o `master` do conteúdo, testa, gera o site e publica com `wrangler deploy` quando os
segredos `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` estão configurados.

## Documentação

- [Spec 001 — Site de disciplinas](docs/specs/001-site-disciplinas/spec.md)
- [ADRs](docs/adr/)
- [AGENTS.md](AGENTS.md)

## Licença

MIT.
