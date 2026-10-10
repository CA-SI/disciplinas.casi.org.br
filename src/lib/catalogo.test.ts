import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { carregarCatalogo, listarMateriais, localizarPasta, resumir, urlGithub } from './catalogo.ts'

const base = {
  catalogo: 2026,
  pdf: 'https://catalogo.ufv.br/pdf.php?x=1',
  creditos: 4,
  horas: 60,
  extensao: 0,
  teorica: 2,
  pratica: 2,
  semestres: 'I e II',
  objetivos: ['Objetivo.'],
  ementa: ['Ponteiros. Listas.'],
  prerequisitos: 'SIN 111',
  oferecimentos: [['Sistemas de Informação', 2]],
  conteudo: [{ titulo: 'Listas', horas: 60, itens: [[1, 'Lista estática']] }],
  bibliografia_basica: ['ZIVIANI, N. Projeto de Algoritmos.'],
  bibliografia_complementar: [],
}

function montar(disciplinas: Record<string, unknown>) {
  const raiz = mkdtempSync(path.join(tmpdir(), 'conteudo-'))
  mkdirSync(path.join(raiz, 'dados'))
  writeFileSync(
    path.join(raiz, 'dados', 'catalogo-2026.json'),
    JSON.stringify({ ano: 2026, fonte: 'https://catalogo.ufv.br/matriz.php', disciplinas }),
  )
  writeFileSync(
    path.join(raiz, 'dados', 'referencias.json'),
    JSON.stringify({ SIN215: [{ titulo: 'VisuAlgo', url: 'https://visualgo.net/', nota: '' }] }),
  )
  mkdirSync(path.join(raiz, 'SIN215-Programação e Estruturas de Dados I', 'Listas'), { recursive: true })
  writeFileSync(path.join(raiz, 'SIN215-Programação e Estruturas de Dados I', 'README.md'), '# x')
  writeFileSync(path.join(raiz, 'SIN215-Programação e Estruturas de Dados I', 'keep'), '')
  writeFileSync(path.join(raiz, 'SIN215-Programação e Estruturas de Dados I', 'Listas', 'Aula 1.pdf'), 'pdf')
  mkdirSync(path.join(raiz, 'Z-Matrizes Anteriores', 'SIN211-Algoritmos e Estruturas de Dados'), { recursive: true })
  mkdirSync(path.join(raiz, 'SIN213-Projeto de Algoritmos', '3929'), { recursive: true })
  writeFileSync(
    path.join(raiz, '.gitmodules'),
    '[submodule "x"]\n\tpath = SIN213-Projeto de Algoritmos/3929\n\turl = https://github.com/MatheusRV/Analysis-of-Algorithms-Course\n',
  )
  return raiz
}

test('localiza pastas na raiz e em matrizes anteriores', () => {
  const raiz = montar({})
  assert.equal(localizarPasta(raiz, 'SIN215'), 'SIN215-Programação e Estruturas de Dados I')
  assert.equal(localizarPasta(raiz, 'SIN211'), 'Z-Matrizes Anteriores/SIN211-Algoritmos e Estruturas de Dados')
  assert.equal(localizarPasta(raiz, 'SIN999'), null)
})

test('materiais ignoram README e keep, descem em subpastas e mostram submódulos como externos', () => {
  const raiz = montar({})
  assert.deepEqual(listarMateriais(raiz, 'SIN215-Programação e Estruturas de Dados I'), [
    {
      nome: 'Listas/Aula 1.pdf',
      url: urlGithub('SIN215-Programação e Estruturas de Dados I/Listas/Aula 1.pdf', 'blob'),
      externo: false,
    },
  ])
  assert.deepEqual(listarMateriais(raiz, 'SIN213-Projeto de Algoritmos'), [
    { nome: '3929', url: 'https://github.com/MatheusRV/Analysis-of-Algorithms-Course', externo: true },
  ])
})

test('url do GitHub codifica espaços e acentos', () => {
  assert.equal(
    urlGithub('SIN215-Programação e Estruturas de Dados I', 'tree'),
    'https://github.com/CA-SI/Sistemas-de-Informacao_UFV-CRP/tree/master/SIN215-Programa%C3%A7%C3%A3o%20e%20Estruturas%20de%20Dados%20I',
  )
})

test('carrega catálogo com referências, materiais e resumo pesquisável', () => {
  const raiz = montar({
    SIN215: { ...base, codigo: 'SIN215', nome: 'Programação e Estruturas de Dados I', tipo: 'obrigatoria', periodo: 2 },
  })
  const cat = carregarCatalogo(raiz)
  const d = cat.disciplinas[0]
  assert.equal(cat.ano, 2026)
  assert.equal(d.referencias[0].titulo, 'VisuAlgo')
  assert.equal(d.materiais.length, 1)
  const r = resumir(d)
  assert.ok(r.indice.includes('programacao'))
  assert.ok(r.indice.includes('sin 215'))
  assert.ok(r.indice.includes('ponteiros'))
  assert.equal(r.temMaterial, true)
})

test('disciplina fora do esquema quebra com código e campo', () => {
  const raiz = montar({ SIN215: { ...base, codigo: 'SIN215', nome: 'X', tipo: 'eletiva', periodo: 2 } })
  assert.throws(() => carregarCatalogo(raiz), /disciplina SIN215: tipo/)
})

test('sem submodule inicializado, a mensagem diz o que fazer', () => {
  assert.throws(() => carregarCatalogo(path.join(tmpdir(), 'nao-existe')), /git submodule update --init/)
})
