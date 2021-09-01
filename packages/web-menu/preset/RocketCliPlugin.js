/* eslint-disable @typescript-eslint/ban-ts-comment */

/** @typedef {import('../types/main').RocketCliOptions} RocketCliOptions */

import { WebMenuCli } from '@web/menu';

export class RocketCliPlugin {
  static pluginName = 'RocketMenu';
  commands = ['start', 'build', 'lint'];

  /**
   * @param {object} options
   * @param {RocketCliOptions} options.config
   * @param {any} options.argv
   */
  async setup({ config, argv }) {
    this.__argv = argv;
    this.webMenu = new WebMenuCli();
    this.webMenu.setOptions({
      docsDir: config.outputDevDir,
      outputDir: config.outputDevDir,
    });
  }

  async updated() {
    await this.webMenu.run();
  }
}
