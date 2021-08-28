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
    const { readOutput } = await executeCli(
      { docsDir: 'fixtures/preset-breadcrumb' },
      { captureLog: true },
    );

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
    const { readOutput } = await executeCli(
      { docsDir: 'fixtures/preset-header' },
      { captureLog: true },
    );

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

  it('main', async () => {
    const { readOutput } = await executeCli(
      { docsDir: 'fixtures/preset-main' },
      { captureLog: true },
    );

    const accordion = await readOutput('components/content/accordion/index.html');
    expect(accordion).to.equal(
      [
        '<html>',
        '  <head>',
        '    <title>Accordion</title>',
        '  </head>',
        '  <body>',
        '    <nav role="navigation" aria-label="main" class="web-menu-main">',
        '      <ul class="lvl-2">',
        '        <li class="web-menu-active">',
        '          <span>Content</span>',
        '          <ul class="lvl-3">',
        '            <li class="web-menu-current">',
        '              <a href="/components/content/accordion/" aria-current="page">Accordion</a>',
        '            </li>',
        '          </ul>',
        '        </li>',
        '        <li>',
        '          <span>Inputs</span>',
        '          <ul class="lvl-3">',
        '            <li><a href="/components/inputs/input-text/">Input Text</a></li>',
        '            <li><a href="/components/inputs/textarea/">Textarea</a></li>',
        '          </ul>',
        '        </li>',
        '      </ul>',
        '    </nav>',
        '  </body>',
        '</html>',
        '',
      ].join('\n'),
    );

    const installCli = await readOutput('getting-started/setup/install-cli/index.html');
    expect(installCli).to.equal(
      [
        '<html>',
        '  <head>',
        '    <title>Install Cli</title>',
        '  </head>',
        '  <body>',
        '    <nav role="navigation" aria-label="main" class="web-menu-main">',
        '      <ul class="lvl-2">',
        '        <li class="web-menu-active">',
        '          <span>Setup</span>',
        '          <ul class="lvl-3">',
        '            <li class="web-menu-current">',
        '              <a href="/getting-started/setup/install-cli/" aria-current="page">Install Cli</a>',
        '            </li>',
        '          </ul>',
        '        </li>',
        '      </ul>',
        '    </nav>',
        '  </body>',
        '</html>',
        '',
      ].join('\n'),
    );
  });
});
