import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { lerGuias, renderizarGuia, resolverLink } from './guias.ts'

const frontmatter = (extra = '') => `---
titulo: Trabalho de Conclusão de Curso
resumo: Como funciona o TCC.
icone: graduation-cap
ordem: 2
atualizado_em: 2026-10-10
fontes:
  - titulo: Programa SIN 488
    url: https://catalogo.ufv.br/pdf.php?x=1
${extra}---
`

function montar(guias: Record<string, string>) {
  const raiz = mkdtempSync(path.join(tmpdir(), 'conteudo-'))
  mkdirSync(path.join(raiz, 'guias'))
  mkdirSync(path.join(raiz, 'SIN488-Trabalho de Conclusão de Curso I'))
  mkdirSync(path.join(raiz, 'Z-Matrizes Anteriores', 'SIN498-Trabalho de Conclusão de Curso I'), { recursive: true })
  mkdirSync(path.join(raiz, 'Z-Outros'))
  writeFileSync(path.join(raiz, 'Z-Outros', 'Regulamento.pdf'), 'pdf')
  writeFileSync(path.join(raiz, 'guias', 'README.md'), '# índice')
  for (const [nome, texto] of Object.entries(guias)) writeFileSync(path.join(raiz, 'guias', nome), texto)
  return raiz
}

test('lê guias em ordem, ignora README e valida o frontmatter', () => {
  const raiz = montar({
    'tcc.md': frontmatter() + 'Texto do TCC.',
    'matriz.md': frontmatter().replace('ordem: 2', 'ordem: 1').replace('Trabalho de Conclusão de Curso', 'Matriz') + 'Matriz.',
  })
  const guias = lerGuias(raiz)
  assert.deepEqual(guias.map((g) => g.slug), ['matriz', 'tcc'])
  assert.equal(guias[1].atualizado_em, '2026-10-10')
  assert.equal(guias[1].corpo.trim(), 'Texto do TCC.')
})

test('frontmatter inválido quebra com arquivo e campo', () => {
  const raiz = montar({ 'tcc.md': frontmatter().replace('icone: graduation-cap', 'icone: foguete') + 'x' })
  assert.throws(() => lerGuias(raiz), /guias\/tcc\.md: icone/)
})

test('YAML inválido quebra com o nome do arquivo', () => {
  const raiz = montar({ 'tcc.md': frontmatter().replace('resumo: Como funciona o TCC.', 'resumo: Matriz 2026: o que conta') + 'x' })
  assert.throws(() => lerGuias(raiz), /guias\/tcc\.md: frontmatter não é YAML válido/)
})

test('sem pasta guias, não há guias', () => {
  assert.deepEqual(lerGuias(mkdtempSync(path.join(tmpdir(), 'vazio-'))), [])
})

test('links de pasta de disciplina viram página da disciplina, inclusive em matrizes anteriores', () => {
  const raiz = montar({})
  assert.equal(resolverLink('../SIN488-Trabalho de Conclusão de Curso I/', raiz), '/disciplinas/sin488/')
  assert.equal(resolverLink('../Z-Matrizes Anteriores/SIN498-Trabalho de Conclusão de Curso I/', raiz), '/disciplinas/sin498/')
})

test('link para outro guia vira página de guia; arquivo vira GitHub; externo passa direto', () => {
  const raiz = montar({ 'tcc.md': frontmatter() + 'x' })
  assert.equal(resolverLink('tcc.md#banca', raiz), '/guias/tcc/#banca')
  assert.match(resolverLink('../Z-Outros/Regulamento.pdf', raiz), /\/blob\/master\/Z-Outros\/Regulamento\.pdf$/)
  assert.equal(resolverLink('https://locus.ufv.br/', raiz), 'https://locus.ufv.br/')
})

test('link relativo inexistente quebra o render com o nome do guia', () => {
  const raiz = montar({ 'tcc.md': frontmatter() + '[x](<../SIN999-Nada/>)' })
  const [guia] = lerGuias(raiz)
  assert.throws(() => renderizarGuia(guia, raiz), /guias\/tcc\.md: link quebrado/)
})

test('render converte links e escapa HTML cru', () => {
  const raiz = montar({ 'tcc.md': frontmatter() + 'Veja [SIN 488](<../SIN488-Trabalho de Conclusão de Curso I/>).\n\n<script>x</script>' })
  const html = renderizarGuia(lerGuias(raiz)[0], raiz)
  assert.match(html, /href="\/disciplinas\/sin488\/"/)
  assert.doesNotMatch(html, /<script>/)
})

test('link com esquema perigoso quebra o build', () => {
  const raiz = montar({})
  assert.throws(() => resolverLink('javascript:alert(1)', raiz), /esquema de link não permitido/)
  assert.throws(() => resolverLink('data:text/html,x', raiz), /esquema de link não permitido/)
  assert.equal(resolverLink('mailto:casi@ufv.br', raiz), 'mailto:casi@ufv.br')
})
