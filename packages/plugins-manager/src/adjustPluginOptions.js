/** @typedef {import('../types/main').Plugin} Plugin */

/**
 * @param {any} obj
 */
function isObject(obj) {
  return typeof obj === 'object' && !!obj && !Array.isArray(obj);
}

/**
 * @template {import('../types/main').Plugin} T
 * @param {T} plugin
 * @param {import('../types/main').GetPluginOptions<T>} mergeOptions
 */
export function adjustPluginOptions(plugin, mergeOptions) {
  /**
   * @template {Function} T
   * @param {import('../types/main').MetaPlugin<T>[]} plugins
   */
  const adjustPluginOptionsFn = plugins => {
    const index = plugins.findIndex(pluginObj => pluginObj.plugin === plugin);

    if (index === -1) {
      throw new Error(
        `Could not find a plugin with the name "${plugin.name}" to adjust its options.`,
      );
    }

    if (typeof mergeOptions === 'function') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      plugins[index].options = mergeOptions(plugins[index].options);
    } else if (isObject(plugins[index].options)) {
      plugins[index].options = { ...plugins[index].options, ...mergeOptions };
    } else {
      plugins[index].options = mergeOptions;
    }

    return plugins;
  };
  return adjustPluginOptionsFn;
}
