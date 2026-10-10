/**
 * Contraste WCAG 2.2 dos pares de cor usados com texto. Adaptado de CA-SI/guia.casi.org.br:src/lib/contraste.test.ts
 * (sem a parte de categorias do guia; com as cores de área deste site). Lê os tokens direto do tema.css.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { AREAS } from './disciplina.ts'

const tema = readFileSync(new URL('../app/tema.css', import.meta.url), 'utf8')
const tokens = Object.fromEntries([...tema.matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]))
const cor = (nome: string) => {
  if (nome === 'branco') return '#ffffff'
  assert.ok(tokens[nome], `token --color-${nome} não encontrado no tema.css`)
  return tokens[nome]
}

function luminancia(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contraste(a: string, b: string) {
  const [x, y] = [luminancia(a), luminancia(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}

// [frente, fundo]: texto normal precisa de 4,5:1.
const paresDeTexto: [string, string][] = [
  ['branco', 'marca-forte'],
  ['branco', 'marca-escura'],
  ['branco', 'destaque-forte'],
  ['branco', 'destaque-escura'],
  ['branco', 'aberto-forte'],
  ['branco', 'noite'],
  ['marca-forte', 'branco'],
  ['marca-forte', 'fundo'],
  ['marca-forte', 'marca-clara'],
  ['destaque-forte', 'branco'],
  ['destaque-forte', 'destaque-clara'],
  ['fechado-forte', 'branco'],
  ['aberto-forte', 'branco'],
  ['alerta-forte', 'branco'],
  ['texto', 'branco'],
  ['texto', 'fundo'],
  ['suave', 'branco'],
  ['suave', 'fundo'],
  ['suave', 'borda'], // selo "Matriz anterior"
]

for (const [frente, fundo] of paresDeTexto) {
  test(`texto ${frente} sobre ${fundo} ≥ 4,5:1`, () => {
    const r = contraste(cor(frente), cor(fundo))
    assert.ok(r >= 4.5, `${frente} sobre ${fundo}: ${r.toFixed(2)}`)
  })
}

test('selo e chip de área (texto branco sobre corForte) ≥ 4,5:1', () => {
  for (const a of AREAS) {
    const nome = a.corForte.match(/--color-([\w-]+)/)![1]
    const r = contraste('#ffffff', cor(nome))
    assert.ok(r >= 4.5, `${a.valor} (${nome}): ${r.toFixed(2)}`)
  }
})
