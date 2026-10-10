# Plano — 002 Guias do curso no site

- `src/lib/guias.ts` (só build): lê `conteudo/guias/*.md` (exceto `README.md`), separa o frontmatter, valida com zod
  e converte links no `walkTokens` do `marked`. O renderizador de HTML cru escapa o texto, como no Guia CASI.
- Ícones aceitos: lista fechada em `ICONES_GUIA`, mapeada para componentes lucide em `src/components/icone-guia.tsx`.
- Visual: `CardGuia` e a página de guia seguem o Guia CASI (selo `bg-marca-clara`, `texto-corrido` com listas e
  tabelas do tema `c695df0`, rodapé de fontes tracejado).
- `src/app/sitemap.ts` e `src/app/robots.ts` com `dynamic = 'force-static'`.
