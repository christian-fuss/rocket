/* eslint-disable @typescript-eslint/ban-ts-comment */
import fs from 'fs-extra';
import TreeModel from 'tree-model';
import path from 'path';
import { parseHtmlFile } from './parseHtmlFile.js';

export function modelComparatorFn(a, b) {
  const aOrder = a.order || 0;
  const bOrder = b.order || 0;
  return aOrder > bOrder;
}

const tree = new TreeModel({
  modelComparatorFn,
});

let initialRootDir;

function processTocElements(metaData) {
  let node;
  let currentLevel;
  if (metaData.__tocElements.length > 0) {
    for (const tocElement of metaData.__tocElements) {
      const { id, text, level } = tocElement;
      const child = tree.parse({
        name: text,
        url: `#${id}`,
        level,
      });
      if (node) {
        if (level <= currentLevel) {
          node = node
            .getPath()
            .reverse()
            .find(n => n.model.level < child.model.level);
        }
        node.addChild(child);
      }
      currentLevel = level;
      node = child;
    }
  }

  delete metaData.__tocElements;
  const root = node?.getPath()[0];
  if (root) {
    metaData.tableOfContentsNode = root;
  }
  return metaData;
}

export async function buildTree(
  inRootDir,
  node,
  { mode = 'indexFile', level = 0, url = '/', ...options } = {},
) {
  const rootDir = path.resolve(inRootDir);
  if (level === 0) {
    initialRootDir = rootDir;
  }
  let currentNode = node;

  if (mode === 'indexFile') {
    const indexFilePath = path.join(rootDir, 'index.html');
    if (indexFilePath && fs.existsSync(indexFilePath)) {
      const metaData = await parseHtmlFile(indexFilePath, { rootDir: initialRootDir });
      if (!metaData.exclude) {
        const treeEntry = tree.parse({ level, url, ...processTocElements(metaData) });
        if (currentNode) {
          currentNode.addChild(treeEntry);
        } else {
          currentNode = treeEntry;
        }
        await buildTree(rootDir, treeEntry, { ...options, level: level + 1, url, mode: 'scan' });
      }
    }
  }

  if (mode === 'scan') {
    const entries = await fs.readdir(rootDir, { withFileTypes: true });
    for (const entry of entries) {
      const { name: folderName } = entry;
      const currentPath = path.join(rootDir, folderName);
      if (entry.isDirectory()) {
        await buildTree(currentPath, currentNode, {
          ...options,
          level,
          url: `${url}${folderName}/`,
          mode: 'indexFile',
        });
      } else if (entry.name !== 'index.html') {
        // const metaData = await parseHtmlFile(currentPath);
        // const treeEntry = tree.parse({ name: fileName, path: currentPath, ...metaData });
        // node.addChild(treeEntry);
        // console.log({ filePath });
      }
    }
  }
  return currentNode;
}
