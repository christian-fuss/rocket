import chai from 'chai';

// import { parseHtmlFile } from '../src/parseHtmlFile.js';
import { executeParse } from './test-helpers.js';

const { expect } = chai;

describe('parseHtmlFile', () => {
  it('extracts meta data for a single menu', async () => {
    const metaData = await executeParse('fixtures/single-menu-header.html');

    expect(metaData).to.deep.equal({
      __tocElements: [],
      fileString:
        '<html>\n  <head>\n    <title>Single Menu Header</title>\n  </head>\n  <body>\n    <header>\n      <html-include src="menu:header"></html-include>\n    </header>\n  </body>\n</html>\n',
      menus: [
        {
          end: {
            character: 53,
            line: 6,
          },
          name: 'header',
          start: {
            character: 6,
            line: 6,
          },
        },
      ],
      name: 'Single Menu Header',
      title: 'Single Menu Header',
      relPath: 'single-menu-header.html',
    });
  });

  it('extracts meta data for multiple menus', async () => {
    const metaData = await executeParse('fixtures/two-pages/index.html', { rootDir: 'fixtures' });

    expect(metaData).to.deep.equal({
      __tocElements: [],
      title: 'Welcome to two pages | My Page',
      metaTitle: 'Home',
      h1: 'Welcome to two pages',
      name: 'Home',
      fileString:
        '<html>\n  <head>\n    <title>Welcome to two pages | My Page</title>\n    <meta name="web-menu-title" content="Home">\n  </head>\n  <body>\n    <header>\n      <html-include src="menu:header"></html-include>\n    </header>\n    <main>\n      <h1>Welcome to two pages</h1>\n      Content\n    </main>\n  </body>\n</html>\n',
      menus: [
        {
          end: {
            character: 53,
            line: 7,
          },
          name: 'header',
          start: {
            character: 6,
            line: 7,
          },
        },
      ],
      relPath: 'two-pages/index.html',
    });
  });
});
