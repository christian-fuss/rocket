import chai from 'chai';

import { applyPlugins, addPlugin } from '../index.js';

const { expect } = chai;

describe.only('applyPlugins', () => {
  const insertPlugin = () => `-- insertPlugin --`;
  const oneExistingPlugin = [{ plugin: () => 'firstPlugin' }];
  const threeExistingPlugin = [
    { plugin: () => 'firstPlugin' },
    { plugin: () => 'secondPlugin' },
    { plugin: () => 'thirdPlugin' },
  ];

  it('converts meta config by executing the plugins and assigning it to the config', async () => {
    const config = applyPlugins({}, threeExistingPlugin);
    expect(config.plugins).to.deep.equal(['firstPlugin', 'secondPlugin', 'thirdPlugin']);
  });

  it('incorporates "setupPlugin" functions in the config & removes "setupPlugins"', async () => {
    const config = applyPlugins(
      {
        setupPlugins: [addPlugin(insertPlugin)],
      },
      oneExistingPlugin,
    );
    expect(config.plugins).to.deep.equal(['firstPlugin', '-- insertPlugin --']);
    expect(config.setupPlugins).to.be.undefined;
  });

  it('prefers a user set config.plugins', async () => {
    const config = applyPlugins(
      {
        setupPlugins: [addPlugin(insertPlugin)],
        plugins: ['user-set'],
      },
      threeExistingPlugin,
    );
    expect(config.plugins).to.deep.equal(['user-set']);
    expect(config.setupPlugins).to.be.undefined;
  });

  it('works with classes', async () => {
    class FirstClass {
      name = '-- FirstClass --';
    }
    class SecondClass {
      name = '-- SecondClass --';
    }

    const config = applyPlugins({
      setupPlugins: [addPlugin(FirstClass), addPlugin(SecondClass)],
    });

    expect(
      config.plugins.map(/** @param {FirstClass | SecondClass} fn */ fn => fn.name),
    ).to.deep.equal(['-- FirstClass --', '-- SecondClass --']);
  });
});
