/* eslint-disable @typescript-eslint/ban-ts-comment */

/** @typedef {import('../types/main').WebMenuCliOptions} WebMenuCliOptions */

import path from 'path';
import chalk from 'chalk';

import commandLineArgs from 'command-line-args';
import { buildTree } from './buildTree.js';
import { insertMenus } from './insertMenus.js';
import { writeTreeToFileSystem } from './writeTreeToFileSystem.js';

export class WebMenuCli {
  /** @type {WebMenuCliOptions} */
  options;

  constructor({ argv } = { argv: undefined }) {
    const mainDefinitions = [
      { name: 'docs-dir', type: String, defaultOption: true },
      { name: 'config-file', alias: 'c', type: String },
    ];
    const options = commandLineArgs(mainDefinitions, {
      stopAtFirstUnknown: true,
      argv,
    });
    this.options = {
      configFile: options['config-file'],
      docsDir: options['docs-dir'],
    };
  }

  /**
   * @param {Partial<WebMenuCliOptions>} newOptions
   */
  setOptions(newOptions) {
    this.options = {
      ...this.options,
      ...newOptions,
      presets: {
        ...this.options.presets,
        ...newOptions.presets,
      },
    };
  }

  async applyConfigFile() {
    const configFilePath = path.resolve(this.options.configFile);
    const fileOptions = (await import(configFilePath)).default;
    if (fileOptions.docsDir) {
      fileOptions.docsDir = path.join(path.dirname(configFilePath), fileOptions.docsDir);
    }
    this.setOptions(fileOptions);
  }

  async run() {
    if (this.options.configFile) {
      await this.applyConfigFile();
    }

    const { docsDir: userDocsDir, outputDir: userOutputDir } = this.options;
    this.docsDir = userDocsDir ? path.resolve(userDocsDir) : process.cwd();
    this.outputDir = userOutputDir
      ? path.resolve(userOutputDir)
      : path.join(this.docsDir, '..', '_site');
    const performanceStart = process.hrtime();

    console.log('👀 Analyzing file tree...');
    const tree = await buildTree(this.docsDir);
    if (!tree) {
      console.error(
        chalk.red(`💥 Error: Could not find any pages at ${chalk.cyanBright(this.docsDir)}.`),
      );
      process.exit(1);
    }

    console.log(`📖 Found ${chalk.green(tree.all().length)} pages`);

    const { counter } = await insertMenus(tree, this.options);
    console.log(`📝 Inserted ${chalk.green(counter)} menus!`);

    console.log(
      `✍️  Writing files to ${chalk.cyanBright(path.relative(process.cwd(), this.outputDir))} ...`,
    );
    await writeTreeToFileSystem(tree, this.outputDir);

    const performance = process.hrtime(performanceStart);
    console.log(
      `✅ Menus inserted and written to filesystem. (executed in ${performance[0]}s ${
        performance[1] / 1000000
      }ms)`,
    );
  }
}
