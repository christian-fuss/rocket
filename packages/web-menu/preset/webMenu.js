import path from 'path';
import { fileURLToPath } from 'url';
import { addPlugin } from 'plugins-manager';
import { RocketCliPlugin } from './RocketCliPlugin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const eleventyPluginWebMenu = {
  configFunction: eleventyConfig => {
    eleventyConfig.addFilter('menu', function (menuName) {
      return `<web-menu preset="${menuName}"></web-menu>`;
    });
  },
};

export function webMenu() {
  return {
    path: path.resolve(__dirname),
    setupEleventyPlugins: [addPlugin({ name: 'web-menu', plugin: eleventyPluginWebMenu })],
    setupCliPlugins: [addPlugin({ name: 'web-menu', plugin: RocketCliPlugin })],
  };
}
