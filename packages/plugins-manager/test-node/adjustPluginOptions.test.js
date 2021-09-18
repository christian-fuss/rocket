import chai from 'chai';

import { adjustPluginOptions, applyPlugins } from '../index.js';

const { expect } = chai;

describe('adjustPluginOptions', () => {
  const firstPlugin = ({ flag = 'default-flag' } = {}) => `firstPlugin-${flag}`;
  const secondPlugin = ({ other = { nested: 'other.nested', nested2: 'other.nested2' } } = {}) =>
    `secondPlugin-${other.nested}-${other.nested2}`;
  const thirdPlugin = ({ name = 'name' }) => `thirdPlugin-${name}`;

  const defaultCurrentMetaPlugins = [
    { plugin: firstPlugin, options: { flag: 'firstSettings' } },
    {
      plugin: secondPlugin,
      options: { other: { nested: 'other.nested', nested2: 'other.nested2' } },
    },
    { plugin: thirdPlugin, options: { name: 'name' } },
  ];
  function newCurrentMetaPlugins() {
    return defaultCurrentMetaPlugins.map(obj => ({ ...obj }));
  }

  it('will merge options objects (flatly)', async () => {
    const config = applyPlugins(
      {
        setupPlugins: [
          adjustPluginOptions(firstPlugin, { flag: '#mod#FirstSettings' }),
          adjustPluginOptions(secondPlugin, { other: { nested: '#mod#other.nested' } }),
        ],
      },
      newCurrentMetaPlugins(),
    );
    expect(config.plugins).to.deep.equal([
      'firstPlugin-#mod#FirstSettings',
      'secondPlugin-#mod#other.nested-undefined',
      'thirdPlugin-name',
    ]);
  });

  it('will override non object settings', async () => {
    const config = applyPlugins(
      {
        setupPlugins: [adjustPluginOptions(thirdPlugin, { name: '#mod#aString' })],
      },
      newCurrentMetaPlugins(),
    );
    expect(config.plugins).to.deep.equal([
      'firstPlugin-firstSettings',
      'secondPlugin-other.nested-other.nested2',
      'thirdPlugin-#mod#aString',
    ]);
  });

  it('accepts a function as a setting to manually merge objects', async () => {
    const config = applyPlugins(
      {
        setupPlugins: [
          adjustPluginOptions(secondPlugin, config => ({
            other: { ...config.other, nested: '#mod#other.nested' },
          })),
        ],
      },
      newCurrentMetaPlugins(),
    );
    expect(config.plugins).to.deep.equal([
      'firstPlugin-firstSettings',
      'secondPlugin-#mod#other.nested-other.nested2',
      'thirdPlugin-name',
    ]);
  });

  it('throws if given location does not exist', async () => {
    expect(() => {
      applyPlugins({
        setupPlugins: [adjustPluginOptions(firstPlugin, { name: 'newName' })],
      });
    }).to.throw('Could not find a plugin with the name "firstPlugin" to adjust its options.');
  });
});
