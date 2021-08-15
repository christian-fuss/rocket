import chai from 'chai';
import chalk from 'chalk';
import { executeCli } from './test-helpers.js';

const { expect } = chai;

describe('presets', () => {
  before(() => {
    // ignore colors in tests as most CIs won't support it
    chalk.level = 0;
  });

  it('breadcrumb', async () => {
    const { readOutput } = await executeCli({ docsDir: 'fixtures/preset-breadcrumb' });

    const buttonBlue = await readOutput('components/button-blue/index.html');
    expect(buttonBlue).to.equal(
      [
        '<html>',
        '  <head>',
        '    <title>Button Blue</title>',
        '  </head>',
        '  <body>',
        '    <nav aria-label="Breadcrumb" class="web-menu-breadcrumb">',
        '      <ol>',
        '        <li class="web-menu-active"><a href="/">Home</a></li>',
        '        <li class="web-menu-active"><a href="/components/">Components</a></li>',
        '        <li class="web-menu-current">',
        '          <a href="/components/button-blue/" aria-current="page">Button Blue</a>',
        '        </li>',
        '      </ol>',
        '    </nav>',
        '  </body>',
        '</html>',
        '',
      ].join('\n'),
    );

    const buttonRed = await readOutput('components/button-red/index.html');
    expect(buttonRed).to.equal(
      [
        '<html>',
        '  <head>',
        '    <title>Button Red</title>',
        '  </head>',
        '  <body>',
        '    <nav aria-label="Breadcrumb" class="web-menu-breadcrumb">',
        '      <ol>',
        '        <li class="web-menu-active"><a href="/">Home</a></li>',
        '        <li class="web-menu-active"><a href="/components/">Components</a></li>',
        '        <li class="web-menu-current">',
        '          <a href="/components/button-red/" aria-current="page">Button Red</a>',
        '        </li>',
        '      </ol>',
        '    </nav>',
        '  </body>',
        '</html>',
        '',
      ].join('\n'),
    );

    const components = await readOutput('components/index.html');
    expect(components).to.equal(
      [
        '<html>',
        '  <head>',
        '    <title>Components</title>',
        '  </head>',
        '  <body>',
        '    <nav aria-label="Breadcrumb" class="web-menu-breadcrumb">',
        '      <ol>',
        '        <li class="web-menu-active"><a href="/">Home</a></li>',
        '        <li class="web-menu-current"><a href="/components/" aria-current="page">Components</a></li>',
        '      </ol>',
        '    </nav>',
        '  </body>',
        '</html>',
        '',
      ].join('\n'),
    );

    const home = await readOutput('index.html');
    expect(home).to.equal(
      [
        '<html>',
        '  <head>',
        '    <title>Preset Breadcrumb</title>',
        '    <meta name="web-menu-title" content="Home" />',
        '  </head>',
        '  <body>',
        '    <nav aria-label="Breadcrumb" class="web-menu-breadcrumb">',
        '      <ol>',
        '        <li class="web-menu-current"><a href="/" aria-current="page">Home</a></li>',
        '      </ol>',
        '    </nav>',
        '  </body>',
        '</html>',
        '',
      ].join('\n'),
    );
  });

  it('header', async () => {
    const { readOutput } = await executeCli({ docsDir: 'fixtures/preset-header' });

    const buttonRed = await readOutput('components/button-red/index.html');
    expect(buttonRed).to.equal(
      [
        '<html>',
        '  <head>',
        '    <title>Button Red</title>',
        '  </head>',
        '  <body>',
        '    <nav role="navigation" aria-label="Header" class="web-menu-header">',
        '      <a href="/about/">About</a>',
        '      <a href="/components/">Components</a>',
        '    </nav>',
        '  </body>',
        '</html>',
        '',
      ].join('\n'),
    );

    const components = await readOutput('components/index.html');
    expect(components).to.equal(
      [
        '<html>',
        '  <head>',
        '    <title>Components</title>',
        '  </head>',
        '  <body>',
        '    <nav role="navigation" aria-label="Header" class="web-menu-header">',
        '      <a href="/about/">About</a>',
        '      <a href="/components/" aria-current="page">Components</a>',
        '    </nav>',
        '  </body>',
        '</html>',
        '',
      ].join('\n'),
    );
  });
});
