import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: false,
  breaks: false,
})

// Wrap tables so wide ones scroll horizontally instead of breaking the layout.
md.renderer.rules.table_open = () => '<div class="tw"><table>'
md.renderer.rules.table_close = () => '</table></div>'

export function marked(markdown: string): string {
  return md.render(markdown)
}
