/** Extracts the H1 title or falls back to a formatted filename */
export function extractTitle(content: string, path: string): string {
  const lines = content.split('\n');
  const firstLine = lines[0]?.trim();

  if (firstLine && firstLine.startsWith('# ')) {
    return firstLine.substring(2).trim();
  }

  // Fallback: format the filename
  return path
    .replace(/\.(md|mdx)$/, '')
    .replace(/[-_]/g, ' ')
    .split('/')
    .pop() || path;
}

/** Extracts the first paragraph as a summary/description */
export function extractDescription(content: string): string {
  const contentWithoutTitle = content.replace(/^#[^\n]*\n/, '');
  const firstParagraph = contentWithoutTitle.split('\n\n').find(p => p.trim() && !p.startsWith('#')) || '';
  let description = firstParagraph.slice(0, 300).trim();

  // If description is too short, try to get more content
  if (description.length < 100) {
    const secondParagraph = contentWithoutTitle.split('\n\n').filter(p => p.trim() && !p.startsWith('#'))[1] || '';
    description = (firstParagraph + ' ' + secondParagraph).slice(0, 300).trim();
  }

  // Truncate at sentence boundary if possible, aim for ~155 chars
  if (description.length > 155) {
    const sentenceEnd = description.slice(0, 155).lastIndexOf('.');
    if (sentenceEnd > 100) {
      description = description.slice(0, sentenceEnd + 1);
    } else {
      description = description.slice(0, 155) + '...';
    }
  }
  return description;
}

/** Check if a file path is a markdown file */
export function isMarkdownFile(path: string): boolean {
  return path.endsWith('.md') || path.endsWith('.mdx');
}
