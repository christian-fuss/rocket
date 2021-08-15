/**
 * @param {object} options
 * @param {string} options.content
 * @param {Position} options.start
 * @param {Position} options.end
 * @param {string} options.replacement
 */
export function replaceBetween({ content, start, end, replacement = '' }) {
  const lines = content.split('\n');
  const i = start.line;
  const line = lines[i];
  const upToChange = line.slice(0, start.character - 1);
  const afterChange = line.slice(end.character + 2);

  lines[i] = `${upToChange}${replacement}${afterChange}`;
  return lines.join('\n');
}
