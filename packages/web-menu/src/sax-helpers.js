/** @typedef {import('sax-wasm').Text} Text */
/** @typedef {import('sax-wasm').Tag} Tag */
/** @typedef {import('sax-wasm').Position} Position */

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
  const upToChange = line.slice(0, start.character);
  const afterChange = line.slice(end.character);

  lines[i] = `${upToChange}${replacement}${afterChange}`;
  return lines.join('\n');
}

/**
 * @param {Tag} data
 * @param {string} name
 */
export function getAttribute(data, name) {
  if (data.attributes) {
    const { attributes } = data;
    const foundIndex = attributes.findIndex(entry => entry.name.value === name);
    if (foundIndex !== -1) {
      return attributes[foundIndex].value.value;
    }
  }
  return undefined;
}

/**
 * @param {Tag} data
 */
export function getText(data) {
  if (data.textNodes) {
    return data.textNodes.map(textNode => textNode.value).join('');
  }
  return undefined;
}

/**
 * @param {Tag} data
 */
export function getCommentText(data) {
  // NOTE: we NEED to access data internal value so sax-wasm does not reuse it's value
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tmp = data.start.line + data.end.line;
  let value = data.value.trim();
  return value.startsWith('-->') ? value.substring(3) : value;
}
