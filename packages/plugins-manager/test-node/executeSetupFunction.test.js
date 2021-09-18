import chai from 'chai';

import { executeSetupFunctions, addPlugin } from '../index.js';

const { expect } = chai;

describe('executeSetupFunctions', () => {
  const firstPlugin = () => 'firstPlugin';
  const secondPlugin = () => 'secondPlugin';
  const thirdPlugin = () => 'thirdPlugin';

  /**
   * @type {import('../types/main').MetaPlugin<() => void>[]} plugins
   */
  const threeExistingPlugin = [
    { plugin: firstPlugin },
    { plugin: secondPlugin },
    { plugin: thirdPlugin },
  ];

  it('executes and returns a new array not adjusting the original', async () => {
    const metaPlugins = executeSetupFunctions(
      [addPlugin(() => 'a'), addPlugin(() => 'b')],
      threeExistingPlugin,
    );
    expect(metaPlugins.length).to.equal(5);

    // does not change original array
    expect(threeExistingPlugin).to.deep.equal([
      { plugin: firstPlugin },
      { plugin: secondPlugin },
      { plugin: thirdPlugin },
    ]);
  });
});
