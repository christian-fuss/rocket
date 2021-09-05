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
  render: (options: PresetFn) => string;
  list: (options: PresetFn) => string;
  listItem: (options: PresetFn) => string;
  link: (options: PresetFn) => string;
  childCondition: (node: Node<Page>) => boolean;
  listTag: string;
}

export interface PresetFn extends Preset {
  node: Node<Page>;
  currentNode: Node<Page>;
}

export interface WebMenuCliOptions {
  configFile: string;
  docsDir: string;
  outputDir?: string;
  presets?: Preset[];
}
