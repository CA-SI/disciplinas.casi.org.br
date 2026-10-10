import { test } from 'node:test'
import assert from 'node:assert/strict'
import { areaDe, caminho, codigosPrerequisito, liberadas, trechosPrerequisito } from './disciplina.ts'

test('área pelo prefixo do código', () => {
  assert.equal(areaDe('SIN215'), 'computacao')
  assert.equal(areaDe('CDP300'), 'dados')
  assert.equal(areaDe('ESP105'), 'matematica')
  assert.equal(areaDe('CIC100'), 'gestao')
  assert.equal(areaDe('CRP297'), 'humanidades')
})

test('caminho estável em minúsculas', () => {
  assert.equal(caminho('SIN215'), '/disciplinas/sin215/')
})

test('trechos de pré-requisito separam códigos, texto e correquisito', () => {
  assert.deepEqual(trechosPrerequisito('(MAP 191 ou MAP 195) e SIN 216*'), [
    { texto: '(' },
    { codigo: 'MAP191', rotulo: 'MAP 191', correquisito: false },
    { texto: ' ou ' },
    { codigo: 'MAP195', rotulo: 'MAP 195', correquisito: false },
    { texto: ') e ' },
    { codigo: 'SIN216', rotulo: 'SIN 216', correquisito: true },
  ])
})

test('"1800 OBR" vira texto legível', () => {
  assert.deepEqual(trechosPrerequisito('1800 OBR'), [{ texto: '1800 h de disciplinas obrigatórias concluídas' }])
})

test('pré-requisito vazio não gera trechos', () => {
  assert.deepEqual(trechosPrerequisito(''), [])
  assert.deepEqual(codigosPrerequisito(''), [])
})

test('liberadas ignora disciplinas de matrizes anteriores', () => {
  const todas = [
    { codigo: 'SIN215', tipo: 'obrigatoria' as const, prerequisitos: 'SIN 111' },
    { codigo: 'SIN211', tipo: 'anterior' as const, prerequisitos: 'SIN 111' },
    { codigo: 'SIN220', tipo: 'obrigatoria' as const, prerequisitos: 'SIN 111' },
  ]
  assert.deepEqual(liberadas('SIN111', todas), ['SIN215', 'SIN220'])
})
