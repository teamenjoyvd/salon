// Simple markdown to HTML renderer
export function marked(markdown: string): string {
  let html = markdown

  // Escape HTML
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

  // Restore code blocks and inline code
  const codeBlocks: string[] = []
  const inlineCode: string[] = []

  // Extract code blocks
  html = html.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match)
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`
  })

  // Extract inline code
  html = html.replace(/`[^`]+`/g, (match) => {
    inlineCode.push(match)
    return `__INLINE_CODE_${inlineCode.length - 1}__`
  })

  // Headers
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.*?)$/gm, '<h2>$2</h2>')
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>')

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr />')

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>')

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  html = html.replace(/_(.*?)_/g, '<em>$1</em>')

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')

  // Blockquotes
  html = html.replace(/^&gt; (.*?)$/gm, '<blockquote><p>$1</p></blockquote>')

  // Tables
  html = html.replace(/\|(.+)\|/g, (match) => {
    const rows = html.split('\n').filter((line) => line.includes('|'))
    if (rows.length > 1) {
      let table = '<table><tbody>'
      rows.forEach((row, idx) => {
        const cells = row.split('|').filter((cell) => cell.trim())
        if (idx === 0) {
          table += '<thead><tr>'
          cells.forEach((cell) => (table += `<th>${cell.trim()}</th>`))
          table += '</tr></thead><tbody>'
        } else if (row.includes('-')) {
          // Skip separator row
        } else {
          table += '<tr>'
          cells.forEach((cell) => (table += `<td>${cell.trim()}</td>`))
          table += '</tr>'
        }
      })
      table += '</tbody></table>'
      return table
    }
    return match
  })

  // Lists
  html = html.replace(/^\* (.*?)$/gm, '<li>$1</li>')
  html = html.replace(/^- (.*?)$/gm, '<li>$1</li>')
  html = html
    .replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>')
    .replace(/<\/li>\n<li>/g, '</li>\n<li>')

  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>')
  html = '<p>' + html + '</p>'
  html = html.replace(/<p><\/p>/g, '')
  html = html.replace(/<p>(<h[1-3])/g, '$1')
  html = html.replace(/(<\/h[1-3]>)<\/p>/g, '$1')
  html = html.replace(/<p>(<ul>)/g, '$1')
  html = html.replace(/(<\/ul>)<\/p>/g, '$1')
  html = html.replace(/<p>(<table>)/g, '$1')
  html = html.replace(/(<\/table>)<\/p>/g, '$1')
  html = html.replace(/<p>(<blockquote>)/g, '$1')
  html = html.replace(/(<\/blockquote>)<\/p>/g, '$1')
  html = html.replace(/<p>(<hr)/g, '$1')
  html = html.replace(/(<hr[^>]*>)<\/p>/g, '$1')

  // Restore code blocks
  codeBlocks.forEach((block, idx) => {
    const content = block
      .replace(/```/g, '')
      .trim()
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
    html = html.replace(
      `__CODE_BLOCK_${idx}__`,
      `<pre><code>${content}</code></pre>`
    )
  })

  // Restore inline code
  inlineCode.forEach((code, idx) => {
    const content = code
      .slice(1, -1)
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
    html = html.replace(`__INLINE_CODE_${idx}__`, `<code>${content}</code>`)
  })

  return html
}
