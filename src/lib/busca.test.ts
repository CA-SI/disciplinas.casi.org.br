import { test } from 'node:test'
import assert from 'node:assert/strict'
import { filtrar, normalizar } from './busca.ts'
import type { Resumo } from './disciplina.ts'

const r = (codigo: string, nome: string, tipo: Resumo['tipo'], periodo: number | null, extra = ''): Resumo => ({
  codigo,
  nome,
  tipo,
  periodo,
  horas: 60,
  area: codigo.startsWith('SIN') ? 'computacao' : 'matematica',
  indice: normalizar(`${codigo} ${nome} ${extra}`),
  temMaterial: false,
})

const lista = [
  r('SIN430', 'Teoria dos Grafos', 'optativa', null),
  r('SIN216', 'Programação e Estruturas de Dados II', 'obrigatoria', 3),
  r('SIN215', 'Programação e Estruturas de Dados I', 'obrigatoria', 2, 'Ponteiros e alocação dinâmica'),
  r('MAP112', 'Álgebra Linear', 'obrigatoria', 2),
  r('SIN211', 'Algoritmos e Estruturas de Dados', 'anterior', null),
]

test('normaliza acento e caixa', () => {
  assert.equal(normalizar('Álgebra LINEAR'), 'algebra linear')
})

test('busca sem acento e por palavras soltas', () => {
  assert.deepEqual(filtrar(lista, { q: 'algebra' }).map((d) => d.codigo), ['MAP112'])
  assert.deepEqual(filtrar(lista, { q: 'estrutura dados' }).map((d) => d.codigo), ['SIN215', 'SIN216', 'SIN211'])
})

test('busca na ementa', () => {
  assert.deepEqual(filtrar(lista, { q: 'ponteiros' }).map((d) => d.codigo), ['SIN215'])
})

test('filtros combinados', () => {
  assert.deepEqual(filtrar(lista, { q: '', tipo: 'obrigatoria', periodo: 2 }).map((d) => d.codigo), ['MAP112', 'SIN215'])
  assert.deepEqual(filtrar(lista, { q: '', area: 'matematica' }).map((d) => d.codigo), ['MAP112'])
})

test('ordem: obrigatórias por período, optativas, anteriores', () => {
  assert.deepEqual(filtrar(lista, { q: '' }).map((d) => d.codigo), ['MAP112', 'SIN215', 'SIN216', 'SIN430', 'SIN211'])
})
