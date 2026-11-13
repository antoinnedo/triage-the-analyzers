import type { Content, Editor } from '@tiptap/vue-3'

export function loadSectionContent(editor: Editor, content: Content) {
  editor.commands.setContent(content, false)
}
