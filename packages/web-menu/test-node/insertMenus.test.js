import chai from 'chai';
import TreeModel from 'tree-model';
import { insertMenus } from '../src/insertMenus.js';
import { format } from './test-helpers.js';

const { expect } = chai;
const treeModel = new TreeModel({});

describe('insertMenus', () => {
  it('will adjust the fileString of the tree', async () => {
    const onePage = treeModel.parse({
      fileString:
        '<html>\n  <head>\n    <title>Single Menu Header</title>\n  </head>\n  <body>\n    <header>\n      <!-- [INSERT-WEB-MENU-PRESET-WITH-NAME="header"] -->\n    </header>\n  </body>\n</html>\n',
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
      level: 0,
      name: 'Single Menu Header',
      title: 'Single Menu Header',
      children: [
        { name: 'Getting Started', url: '#', level: 1 },
        { name: 'Components', url: '#', level: 1 },
        { name: 'Blog', url: '#', level: 1 },
      ]
    });

    await insertMenus(onePage);

    expect(format(onePage.model.fileString)).to.equal([
      '<html>',
      '  <head>',
      '    <title>Single Menu Header</title>',
      '  </head>',
      '  <body>',
      '    <header>',
      '      <nav role="navigation" aria-label="Header" class="web-menu-header">',
      '        <a href="#">Getting Started</a>',
      '        <a href="#">Components</a>',
      '        <a href="#">Blog</a>',
      '      </nav>',
      '    </header>',
      '  </body>',
      '</html>',
      '',
    ].join('\n'));
  });
});
