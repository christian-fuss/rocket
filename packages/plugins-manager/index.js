/**
 * @template T
 * @typedef {import('./types/main').MetaPlugin<T>} MetaPlugin
 **/
/** @typedef {import('./types/main').Plugin} Plugin */

export { addPlugin } from './src/addPlugin.js';
export { applyPlugins } from './src/applyPlugins.js';
export { adjustPluginOptions } from './src/adjustPluginOptions.js';
// export { metaConfigToWebDevServerConfig } from './src/metaConfigToWebDevServerConfig.js';
export { executeSetupFunctions } from './src/executeSetupFunctions.js';
