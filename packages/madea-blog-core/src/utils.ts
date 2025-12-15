/** Extracts the title from the first heading or falls back to a formatted filename */
export function extractTitle(content: string, path: string): string {
  const lines = content.split('\n');
  const firstLine = lines[0]?.trim();

  // Match any heading level (# through ######)
  const match = firstLine?.match(/^#{1,6}\s+(.+)$/);
  if (match) {
    return match[1].trim();
  }

  // Fallback: format the filename
  return path
    .replace(/\.(md|mdx)$/, '')
    .replace(/[-_]/g, ' ')
    .split('/')
    .pop() || path;
}

/** Strips the first heading from content (to avoid duplicate titles) */
export function stripTitle(content: string): string {
  const lines = content.split('\n');
  const firstLine = lines[0]?.trim();

  // Match any heading level (# through ######)
  if (firstLine && /^#{1,6}\s/.test(firstLine)) {
    // Remove first line and any following blank lines
    let i = 1;
    while (i < lines.length && lines[i].trim() === '') {
      i++;
    }
    return lines.slice(i).join('\n');
  }

  return content;
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
