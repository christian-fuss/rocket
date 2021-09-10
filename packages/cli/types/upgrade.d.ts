export interface UpgradeFile {
  path: string;
  relPath: string;
  extName: string;
  updatedContent?: string;
  updatedPath?: string;
  updatedRelPath?: string;
}

export interface upgrade {
  files: UpgradeFile[];
}
