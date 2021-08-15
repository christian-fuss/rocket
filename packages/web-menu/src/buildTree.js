/* eslint-disable @typescript-eslint/ban-ts-comment */
import fs from 'fs-extra';
import TreeModel from 'tree-model';
import path from 'path';
import { parseHtmlFile } from './parseHtmlFile.js';


const tree = new TreeModel();
// const root = tree.parse({});

let initialRootDir;

export async function buildTree(inRootDir, node, { mode = 'indexFile', level = 0, url = '/', ...options } = {}) {
  const rootDir = path.resolve(inRootDir);
  if (level === 0) {
    initialRootDir = rootDir;
  }
  let currentNode = node;

  if (mode === 'indexFile') {
    const indexFilePath = path.join(rootDir, 'index.html');
    if (indexFilePath && fs.existsSync(indexFilePath)) {
      const metaData = await parseHtmlFile(indexFilePath, { rootDir: initialRootDir });
      const treeEntry = tree.parse({ level, url, ...metaData });
      if (currentNode) {
        currentNode.addChild(treeEntry);
      } else {
        currentNode = treeEntry;
      }
      await buildTree(rootDir, treeEntry, { ...options, level: level + 1, url, mode: 'scan' });
    }
  }

  if (mode === 'scan') {
    const entries = await fs.readdir(rootDir, { withFileTypes: true });
    for (const entry of entries) {
      const { name: folderName } = entry;
      const currentPath = path.join(rootDir, folderName);
      if (entry.isDirectory()) {
        await buildTree(currentPath, currentNode, { ...options, level, url: `${url}${folderName}/`,  mode: 'indexFile' });
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
