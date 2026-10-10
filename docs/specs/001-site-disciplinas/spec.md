# 001 — Site de disciplinas

## Contexto

O repositório [CA-SI/Sistemas-de-Informacao_UFV-CRP](https://github.com/CA-SI/Sistemas-de-Informacao_UFV-CRP)
guarda, por disciplina, o programa analítico oficial (catálogo UFV 2026), referências úteis e materiais da
comunidade. No GitHub isso é navegável, mas não pesquisável. Este site publica esse conteúdo como um catálogo
no estilo JKAN (lista com busca e filtros, página por item), com a identidade visual do
[Guia CASI](https://guia.casi.org.br).

## Requisitos

1. O conteúdo vem do submodule `conteudo/` (o repositório acima). O site não duplica nem edita dados das disciplinas.
2. Página inicial com busca, números da matriz (disciplinas, carga horária) e atalhos por período.
3. `/disciplinas/`: lista com busca (código, nome, ementa; sem acento e sem diferenciar maiúsculas) e filtros por
   tipo (obrigatória, optativa, matriz anterior), período e área. O estado dos filtros fica na URL.
4. `/disciplinas/<codigo>/`: tipo, período, carga, créditos, pré-requisitos com link, disciplinas que libera, ementa,
   objetivos, conteúdo programático, bibliografia, referências úteis, materiais da pasta (com link para o GitHub) e
   link para o programa analítico oficial.
5. `/matriz/`: as disciplinas obrigatórias organizadas por período, com os pré-requisitos de cada uma.
6. `/sobre/`: o que é o site e como contribuir.
7. Contrato JSON público em `/api/disciplinas.json` (seção abaixo).
8. Visual: tokens e classes de componente do Guia CASI (`src/app/tema.css`), Roboto 300/400/500, lucide-react.
9. Site 100% estático, publicado no Cloudflare em `disciplinas.casi.org.br`.
10. Acessível: navegação por teclado, foco visível, `prefers-reduced-motion`, contraste dos tokens do guia.

## Contrato `/api/disciplinas.json`

Este repositório é o dono do contrato; consumidores (por exemplo, o Guia CASI) apenas o referenciam.

```json
{
  "versao": 1,
  "catalogo": 2026,
  "fonte": "https://catalogo.ufv.br/matriz.php?...",
  "disciplinas": [
    {
      "codigo": "SIN215",
      "nome": "Programação e Estruturas de Dados I",
      "tipo": "obrigatoria",
      "periodo": 2,
      "horas": 60,
      "url": "https://disciplinas.casi.org.br/disciplinas/sin215/"
    }
  ]
}
```

- `tipo`: `obrigatoria` | `optativa` | `anterior` (fora da matriz vigente).
- `periodo`: inteiro de 1 a 8 para obrigatórias; `null` nos demais tipos.
- `url`: estável. O caminho é `/disciplinas/<codigo em minúsculas>/`.
- Mudança incompatível (remover ou renomear campo, mudar tipo) incrementa `versao`. Campo novo não incrementa.

## Critérios de aceite

- `yarn build` gera `out/` com uma página para cada disciplina do JSON do submodule (90 no catálogo 2026).
- Um JSON do submodule fora do esquema quebra o build com a disciplina e o campo na mensagem.
- `yarn test` cobre busca, filtros, pré-requisitos e localização das pastas no submodule.
- Os links internos de `out/` resolvem.
- `/api/disciplinas.json` segue o contrato acima.

## Fora de escopo

- Edição de conteúdo pelo site. Contribuições continuam por pull request no repositório de conteúdo.
- Professores, departamentos e entidades estudantis (domínio do Guia CASI).
- Login, comentários e qualquer back-end.
