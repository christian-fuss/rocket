import chai from 'chai';
import { executeBuildTree, cleanup } from './test-helpers.js';
import TreeModel from 'tree-model';

const { expect } = chai;
const treeModel = new TreeModel({});

describe('buildTree', () => {
  it('builds a tree for one nested page', async () => {
    const tree = await executeBuildTree('fixtures/two-pages');

    const twoLevels = treeModel.parse({
      name: 'Home',
      level: 0,
      h1: 'Welcome to two pages',
      metaTitle: 'Home',
      title: 'Welcome to two pages | My Page',
      url: '/',
      menus: [
        {
          end: {
            character: 56,
            line: 7,
          },
          name: 'header',
          start: {
            character: 7,
            line: 7,
          },
        },
      ],
      relPath: 'index.html',
      fileString:
        '<html>\n  <head>\n    <title>Welcome to two pages | My Page</title>\n    <meta name="web-menu-title" content="Home">\n  </head>\n  <body>\n    <header>\n      <!-- [INSERT-WEB-MENU-PRESET-WITH-NAME="header"] -->\n    </header>\n    <main>\n      <h1>Welcome to two pages</h1>\n      Content\n    </main>\n  </body>\n</html>\n',
      children: [
        {
          name: 'About Us',
          url: '/about/',
          level: 1,
          title: 'About Us',
          menus: [
            {
              end: {
                character: 56,
                line: 6,
              },
              name: 'header',
              start: {
                character: 7,
                line: 6,
              },
            },
          ],
          relPath: 'about/index.html',
          fileString:
            '<html>\n  <head>\n    <title>About Us</title>\n  </head>\n  <body>\n    <header>\n      <!-- [INSERT-WEB-MENU-PRESET-WITH-NAME="header"] -->\n    </header>\n    <main>\n      Content\n    </main>\n  </body>\n</html>\n',
        },
      ],
    });

    expect(tree).to.deep.equal(twoLevels);
  });

  it('builds a tree for multiple nested page', async () => {
    const tree = await executeBuildTree('fixtures/nested-pages');

    const nested = treeModel.parse({
      name: 'Home',
      level: 0,
      h1: 'Welcome to two pages',
      metaTitle: 'Home',
      title: 'Welcome to two pages | My Page',
      url: '/',
      relPath: 'index.html',
      children: [
        {
          name: 'About Us',
          url: '/about/',
          relPath: 'about/index.html',
          level: 1,
          title: 'About Us',
          children: [{ name: 'Career', url: '/about/career/', relPath: 'about/career/index.html', level: 2, title: 'Career' }],
        },
        {
          name: 'Components',
          url: '/components/',
          relPath: 'components/index.html',
          level: 1,
          title: 'Components',
          children: [
            {
              name: 'Button Blue',
              url: '/components/button-blue/',
              relPath: 'components/button-blue/index.html',
              level: 2,
              title: 'Button Blue',
            },
            { name: 'Button Red', url: '/components/button-red/', relPath: 'components/button-red/index.html', level: 2, title: 'Button Red' },
          ],
        },
      ],
    });

    expect(cleanup(tree)).to.deep.equal(nested);
  });
});
