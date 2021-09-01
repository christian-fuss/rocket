const fs = require('fs');
const path = require('path');
const { createSocialImage: defaultCreateSocialImage } = require('./createSocialImage.cjs');
const { getComputedConfig } = require('./computedConfig.cjs');
const { executeSetupFunctions } = require('plugins-manager');

function sectionPlugin() {
  return async data => {
    if (data.section) {
      return data.section;
    }

    if (data.page.filePathStem) {
      // filePathStem: '/sub/subsub/index'
      // filePathStem: '/index',
      const parts = data.page.filePathStem.split('/');
      if (parts.length > 2) {
        return parts[1];
      }
    }
  };
}

function layoutPlugin({ defaultLayout = 'layout-default' } = {}) {
  return async data => {
    if (data.layout) {
      return data.layout;
    }
    if (data.page.filePathStem) {
      const parts = data.page.filePathStem.split('/');
      if (parts[parts.length - 1] === 'index') {
        return 'layout-index';
      }
    }
    return defaultLayout;
  };
}

function socialMediaImagePlugin(args = {}) {
  const { createSocialImage = defaultCreateSocialImage, rocketConfig = {} } = args;

  const cleanedUpArgs = { ...args };
  delete cleanedUpArgs.createSocialImage;

  return async data => {
    if (data.socialMediaImage) {
      return data.socialMediaImage;
    }

    if (rocketConfig.createSocialMediaImages === false) {
      return;
    }

    if (!data.title) {
      return;
    }

    const title = data.titleMeta.parts ? data.titleMeta.parts[0] : '';
    const subTitle =
      data.titleMeta.parts && data.titleMeta.parts[1] ? `in ${data.titleMeta.parts[1]}` : '';
    const section = data.section ? ' ' + data.section[0].toUpperCase() + data.section.slice(1) : '';
    const footer = `${data.site.name}${section}`;

    const imgUrl = await createSocialImage({
      title,
      subTitle,
      footer,
      section,
      ...cleanedUpArgs,
    });
    return imgUrl;
  };
}

function sortByOrder(a, b) {
  if (a.order > b.order) {
    return 1;
  }
  if (a.order < b.order) {
    return -1;
  }
  return 0;
}

async function dirToTree(sourcePath, extra = '') {
  const pattern = /(\d+)-(.*)/i;
  const dirPath = path.resolve(sourcePath, extra);
  const unsortedEntries = [];
  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const relativePath = path.join(extra, entry.name);
    const matches = entry.name.match(pattern);
    if (entry.isDirectory()) {
      const value = await dirToTree(sourcePath, relativePath);
      unsortedEntries.push({
        order: matches && matches.length > 0 ? parseInt(matches[1]) : 10000,
        name: entry.name,
        value,
      });
    } else {
      unsortedEntries.push({
        order: matches && matches.length > 0 ? parseInt(matches[1]) : 10000,
        name: entry.name,
        value: relativePath,
      });
    }
  }
  const sortedTree = {};
  for (const unsortedEntry of unsortedEntries.sort(sortByOrder)) {
    sortedTree[unsortedEntry.name] = unsortedEntry.value;
  }
  return sortedTree;
}

function joiningBlocksPlugin(rocketConfig) {
  const { _inputDirCwdRelative } = rocketConfig;
  const partialsSource = path.resolve(_inputDirCwdRelative, '_merged_includes');
  return async () => {
    const joiningBlocks = await dirToTree(partialsSource, '_joiningBlocks');
    return joiningBlocks;
  };
}

/**
 * Removes the `xx--` prefix that is used for ordering
 *
 * @returns {string}
 */
function permalinkPlugin() {
  return data => {
    if (data.permalink) {
      return data.permalink;
    }
    let filePath = data.page.filePathStem.replace(/[0-9]+--/g, '');
    return filePath.endsWith('index') ? `${filePath}.html` : `${filePath}/index.html`;
  };
}

/**
 * Extracts the `xx--` order number from the current file name
 *
 * @returns {Number}
 */
function menuOrderPlugin() {
  return data => {
    const matches = data.page.fileSlug.match(/([0-9]+)--/);
    if (matches) {
      return parseInt(matches[1]);
    }
    return 0;
  };
}

function generateEleventyComputed() {
  const rocketConfig = getComputedConfig();

  let metaPlugins = [
    { name: 'section', plugin: sectionPlugin },
    { name: 'socialMediaImage', plugin: socialMediaImagePlugin, options: { rocketConfig } },
    { name: '_joiningBlocks', plugin: joiningBlocksPlugin, options: rocketConfig },
    { name: 'layout', plugin: layoutPlugin },
    { name: 'permalink', plugin: permalinkPlugin },
    { name: 'menuOrder', plugin: menuOrderPlugin },
  ];

  const finalMetaPlugins = executeSetupFunctions(
    rocketConfig.setupEleventyComputedConfig,
    metaPlugins,
  );

  const eleventyComputed = {};
  for (const pluginObj of finalMetaPlugins) {
    if (pluginObj.options) {
      eleventyComputed[pluginObj.name] = pluginObj.plugin(pluginObj.options);
    } else {
      eleventyComputed[pluginObj.name] = pluginObj.plugin();
    }
  }

  return eleventyComputed;
}

module.exports = { generateEleventyComputed };
