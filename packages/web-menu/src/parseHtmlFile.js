import fs from 'fs';
import path from 'path';
import saxWasm from 'sax-wasm';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { SaxEventType, SAXParser } = saxWasm;

const streamOptions = { highWaterMark: 256 * 1024 };

const saxPath = require.resolve('sax-wasm/lib/sax-wasm.wasm');
const saxWasmBuffer = fs.readFileSync(saxPath);
const parser = new SAXParser(SaxEventType.CloseTag | SaxEventType.Comment, streamOptions);

await parser.prepareWasm(saxWasmBuffer);

/**
 * @param {Tag} data
 * @param {string} name
 */
 function getAttribute(data, name) {
  if (data.attributes) {
    const { attributes } = data;
    const foundIndex = attributes.findIndex(entry => entry.name.value === name);
    if (foundIndex !== -1) {
      return attributes[foundIndex].value.value;
    }
  }
  return null;
}

/**
 * @param {Tag} data
 */
function getText(data) {
  if (data.textNodes) {
    return data.textNodes.map(textNode => textNode.value).join('');
  }
  return null;
}

function getCommentText(data) {
  // NOTE: we NEED to access data internal value so sax-wasm does not reuse it's value
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tmp = data.start.line + data.end.line;
  let value = data.value.trim();
  return value.startsWith('-->') ? value.substring(3) : value;
}

export function parseHtmlFile(htmlFilePath, options) {
  const relPath = path.relative(options.rootDir, htmlFilePath);
  const metaData = {
    menus: [],
    relPath
  };

  parser.eventHandler = (ev, _data) => {
    if (ev === SaxEventType.CloseTag) {
      const data = /** @type {Tag} */ (/** @type {any} */ (_data));
      if (data.name === 'meta') {
        const metaName = getAttribute(data, 'name');
        if (metaName === 'web-menu-title') {
          metaData.metaTitle = getAttribute(data, 'content');
        }
      }
      if (data.name === 'title') {
        metaData.title = getText(data);
      }
      if (data.name === 'h1') {
        metaData.h1 = getText(data);
      }

      if (data.name === 'html-include') {
        const src = getAttribute(data, 'src');
        if (src && src.startsWith('webmenu:')) {
          const parts = src.split(':');
          // console.log(data.toJSON());
          metaData.menus.push({ name: parts[1],  start: data.openStart, end: data.closeEnd });
        }
      }
    }

    // if (ev === SaxEventType.Comment) {
    //   const data = /** @type {Text} */ (/** @type {any} */ (_data));
    //   const commentText = getCommentText(data);
    //   if (commentText.startsWith('[INSERT-WEB-MENU-PRESET-WITH-NAME="')) {
    //     const parts = commentText.split('"');
    //     metaData.menus.push({ name: parts[1],  start: data.start, end: data.end });
    //   }
    // }
  };

  return new Promise(resolve => {
    const chunks = [];
    const readable = fs.createReadStream(htmlFilePath, streamOptions);
    readable.on('data', chunk => {
      // @ts-expect-error
      parser.write(chunk);
      chunks.push(Buffer.from(chunk));
    });
    readable.on('end', () => {
      parser.end();
      metaData.name = metaData.metaTitle || metaData.h1 || metaData.title;
      metaData.fileString = Buffer.concat(chunks).toString('utf8');

      resolve(metaData);
    });
  });
}
