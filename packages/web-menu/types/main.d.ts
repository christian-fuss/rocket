export interface Link {
  value: string;
  attribute: string;
  htmlFilePath: string;
  line: number;
  character: number;
}

export interface Usage {
  attribute: string;
  value: string;
  anchor: string;
  file: string;
  line: number;
  character: number;
}

export interface LocalFile {
  filePath: string;
  usage: Usage[];
}

export interface Error {
  filePath: string;
  onlyAnchorMissing: boolean;
  usage: Usage[];
}

export interface Preset {
  render: () => string;
  list: () => string;
  listItem: () => string;
  link: () => string;
  childCondition: () => boolean;
  listTag: string;
}

export interface WebMenuCliOptions {
  configFile: string;
  docsDir: string;
  presets?: Preset[];
}
