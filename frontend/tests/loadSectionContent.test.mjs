/* eslint-env node */
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'

test('loading a section replaces its content without emitting a user update', async () => {
  const source = await readFile(
    new URL('../src/pages/ram/loadSectionContent.ts', import.meta.url),
    'utf8'
  )
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 }
  })
  const { loadSectionContent } = await import(
    'data:text/javascript,' + encodeURIComponent(outputText)
  )
  const originalRequestAnimationFrame = global.requestAnimationFrame
  global.requestAnimationFrame = () => 0
  const editor = new Editor({
    extensions: [StarterKit],
    element: null,
    content: { type: 'doc', content: [{ type: 'paragraph' }] }
  })
  try {
    let updates = 0
    editor.on('update', () => {
      updates++
    })

    loadSectionContent(editor, {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Loaded section' }] }]
    })

    assert.equal(editor.state.doc.textContent, 'Loaded section')
    assert.equal(updates, 0, 'Loading server content should not emit an update')
  } finally {
    editor.destroy()
    global.requestAnimationFrame = originalRequestAnimationFrame
  }
})
