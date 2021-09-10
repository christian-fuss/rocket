import chai from 'chai';
import chalk from 'chalk';
import path from 'path';
import { executeStart, executeUpgrade, readStartOutput, setFixtureDir } from '@rocket/cli/test-helpers';
import { move, remove } from 'fs-extra';
import { existsSync } from 'fs';

const { expect } = chai;

describe('Upgrade System', () => {
  let cli;

  before(() => {
    // ignore colors in tests as most CIs won't support it
    chalk.level = 0;
    setFixtureDir(import.meta.url);
  });

  afterEach(async () => {
    if (cli?.cleanup) {
      await cli.cleanup();
    }
  });

  it.only('2021-09-menu', async () => {
    const run = await executeUpgrade('fixtures-upgrade/2021-09-menu/rocket.config.js');
    cli = run.cli;
    expect(run.outputExists('index.md')).to.be.true;
    expect(run.outputExists('10--components/index.md')).to.be.true;
    expect((await run.readOutput('10--components/index.md'))).to.equal('# Components\n');
  });
});
