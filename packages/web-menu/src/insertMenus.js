import { defaultPresets } from './defaultPresets.js';
import { renderMenu } from './renderMenu.js';
import { replaceBetween } from './sax-helpers.js';

function setCurrent(tree, node) {
  const currentNode = tree.first(entry => entry.model.relPath === node.model.relPath);
  if (currentNode) {
    currentNode.model.current = true;
    for (const parent of currentNode.getPath()) {
      parent.model.active = true;
    }
  }
}

function removeCurrent(tree) {
  const currentNode = tree.first(entry => entry.model.current === true);
  if (currentNode) {
    currentNode.model.current = false;
    for (const parent of currentNode.getPath()) {
      parent.model.active = false;
    }
  }
}

export async function insertMenus(tree, options = {}) {
  let counter = 0;
  const presets = { ...defaultPresets, ...options.presets };

  for (const node of tree.all()) {
    if (node.model.menus && node.model.menus.length > 0) {
      setCurrent(tree, node);

      for (const menu of node.model.menus.reverse()) {
        counter += 1;
        if (!presets[menu.name]) {
          throw new Error(`Unknown menu preset: ${menu.name}`);
        }
        const menuString = await renderMenu({ node: tree, ...presets[menu.name] });
        node.model.fileString = replaceBetween({
          content: node.model.fileString,
          start: menu.start,
          end: menu.end,
          replacement: menuString,
        });
      }

      removeCurrent(tree);
    }
  }
  return { counter, tree };
}
