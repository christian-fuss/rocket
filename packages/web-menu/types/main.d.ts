import { Position } from 'sax-wasm';
import { Node } from 'tree-model';

//
// PARSING
//

class Page {
  level: string;
  url: string;
  children: Node<Page>;
  order?: number;
  // tableOfContentsNode
}

export interface ParseMetaData {
  metaLinkText?: string;
  relPath?: string;
  name?: string;
  fileString?: string;
  menus: Array<{
    name: string;
    start: Position;
    end: Position;
  }>;
  order?: number;
  exclude?: boolean;
  h1?: string;
  title?: string;
  __tocElements?: Array<{
    text: string;
    id: string;
    level: number;
  }>;
}

//
// renderMenu
//

export interface Preset {
  render: (options: renderFn) => string;
  list: (options: renderFn) => string;
  listItem: (options: renderFn) => string;
  link: (options: renderFn) => string;
  childCondition: (node: Node<Page>) => boolean;
  listTag: string;
}

export interface renderFn extends Preset {
  node: Node<Page>;
  currentNode: Node<Page>;
}

export interface ConfigOptions {
  docsDir: string;
  outputDir?: string;
  presets?: {
    [key: string]: Preset
  }
}

export interface WebMenuCliOptions extends ConfigOptions {
  configFile: string;
}
