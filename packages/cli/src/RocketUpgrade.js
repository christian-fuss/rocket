/* eslint-disable @typescript-eslint/ban-ts-comment */

import { existsSync, fstat } from 'fs';
import { mkdir, readdir, rename, writeFile } from 'fs/promises';
import path from 'path';

import { promisify } from 'util';
import { exec as execCallback } from 'child_process';

import { upgrade202109menu } from './upgrades/upgrade202109menu.js';
import { copy } from 'fs-extra';

const exec = promisify(execCallback);

/** @typedef {import('../types/main').RocketCliOptions} RocketCliOptions */
/** @typedef {import('../types/upgrade').UpgradeFile} UpgradeFile */

/**
 * @param {UpgradeFile} options
 * @returns {boolean}
 */
function filterMerged({ relPath }) {
  return relPath.startsWith('_merged');
}

/**
 *
 * @param {object} options
 * @param {string} options.rootDir
 * @param {string} options.currentDir
 * @param {(options: UpgradeFile) => Boolean} [options.filter]
 * @returns
 */
async function getAllFiles(options) {
  const { rootDir, currentDir, filter = filterMerged } = options;
  const entries = await readdir(currentDir, { withFileTypes: true });
  /** @type {UpgradeFile[]} */
  let files = [];
  for (const entry of entries) {
    const { name: folderName } = entry;
    const currentPath = path.join(currentDir, folderName);

    if (entry.isFile()) {
      const relPath = path.relative(rootDir, currentPath);
      /** @type {UpgradeFile} */
      const data = {
        path: currentPath,
        relPath,
        extName: path.extname(relPath),
      };
      if (!filter(data)) {
        files.push(data);
      }
    }
  }
  for (const entry of entries) {
    const { name: folderName } = entry;
    const currentPath = path.join(currentDir, folderName);

    if (entry.isDirectory()) {
      files = [...files, ...(await getAllFiles({ ...options, currentDir: currentPath }))];
    }
  }
  return files;
}

/**
 * @param {UpgradeFile[]} files
 */
async function updateFileSystem({ files, folderRenames }) {
  for (const renameObj of folderRenames) {
    await rename(renameObj.fromAbsolute, renameObj.toAbsolute);
  }
  for (const file of files) {
  //   if (file.path) {
  //     // const dirName = path.dirname(file.updatedPath);
  //     // await mkdir(dirName, { recursive: true });
  //     await rename(file.path, file.updatedPath);
  //   }
    if (file.updatedContent) {
      console.log({ file });
      await writeFile(file.path, file.updatedContent);
    }
  }
}

function applyFolderRenames(relPath, modifications) {
  let newRelPath = relPath;
  for (const modification of modifications) {
    if (newRelPath.startsWith(modification.from)) {
      newRelPath = modification.to + newRelPath.slice(modification.from.length);
    }
  }
  return newRelPath;
}

export class RocketUpgrade {
  static pluginName = 'RocketUpgrade';
  commands = ['upgrade'];

  /**
   * @param {object} options
   * @param {RocketCliOptions} options.config
   * @param {any} options.argv
   */
  async setup({ config, argv }) {
    this.__argv = argv;
    this.config = config;
  }

  async upgradeCommand() {
    if (!this?.config?._inputDirCwdRelative) {
      return;
    }

    if (existsSync(`.git`)) {
      const { stdout } = await exec('git status --porcelain');
      if (stdout !== '') {
        throw new Error(
          [
            'Open git changes detected - are you sure you wanna do irreversible automated adjustments your files?',
            "  yes - set `upgradeMode: 'force-replace'` in your rocket.config.js",
            "  no - setup git or change to `upgradeMode: 'copy'` in your rocket.config.js",
          ].join('\n'),
        );
      }
    } else {
      const backupPath = path.join(this.config._inputDirCwdRelative, '..', 'docs_backup');
      await copy(this.config._inputDirCwdRelative, backupPath);
    }

    let files = await getAllFiles({
      rootDir: this.config._inputDirCwdRelative,
      currentDir: this.config._inputDirCwdRelative,
    });
    let folderRenames = [];

    const upgrade = await upgrade202109menu({ files, folderRenames });
    files = upgrade.files;
    folderRenames = upgrade.folderRenames;

    const orderedFolderRenames = [...folderRenames].sort((a, b) => {
      return b.from.split('/').length - a.from.split('/').length;
    });

    // adjust relPath with folder renames
    let i = 0;
    for (const fileData of files) {
      const modifiedPath = applyFolderRenames(fileData.relPath, orderedFolderRenames);
      if (modifiedPath !== fileData.relPath) {
        files[i].updatedRelPath = modifiedPath;
      }
      i += 1;
    }

    // add an updatedPath if needed
    i = 0;
    for (const file of files) {
      if (file.updatedRelPath) {
        files[i].updatedPath = path.join(this.config._inputDirCwdRelative, file.updatedRelPath);
      }
      i += 1;
    }


    i = 0;
    for (const renameObj of folderRenames) {
      folderRenames[i].fromAbsolute = path.join(this.config._inputDirCwdRelative, renameObj.from);
      folderRenames[i].toAbsolute = path.join(this.config._inputDirCwdRelative, renameObj.to);
      i += 1;
    }

    console.log({ files, orderedFolderRenames });


    await updateFileSystem({
      files,
      folderRenames: orderedFolderRenames
    });

    // console.log({ updatedFiles });

    // console.log(this.config)

    // const entries = await readdir(this.config._inputDirCwdRelative, { withFileTypes: true });
    // for (const entry of entries) {
    //   const { name: folderName } = entry;
    //   const currentPath = path.join(this.config._inputDirCwdRelative, folderName);

    //   if (entry.isDirectory()) {
    //     //
    //   } else {
    //     const relPath = path.relative(this.config._inputDirCwdRelative, currentPath);
    //     const outputPath = path.join(this.config.outputDir, relPath);
    //     console.log({ currentPath, relPath, outputPath });
    //   }
    // }
    // this.config?.inputDir
  }
}
