import chai from 'chai';
import { renderMenu } from '@web/menu';

import TreeModel from 'tree-model';

import { format } from './test-helpers.js';

const { expect } = chai;

const tree = new TreeModel({});

const twoLevels = tree.parse({
  name: 'Root',
  level: 0,
  children: [
    { name: 'Home', url: '#', level: 1 },
    { name: 'About', url: '#', level: 1, children: [{ name: 'Career', url: '#', level: 2 }] },
  ],
});

describe('renderMenu', () => {
  it('can build a menu only for the first level', async () => {
    const htmlNavigation = await renderMenu({
      node: twoLevels,
      childCondition: node => node.model.level === 0,
    });
    expect(format(htmlNavigation)).to.equal(
      [
        '<nav aria-label="Main" class="web-menu-main">',
        '  <ul class="lvl-1">',
        '    <li><a href="#">Home</a></li>',
        '    <li><a href="#">About</a></li>',
        '  </ul>',
        '</nav>',
        '',
      ].join('\n'),
    );
  });

  it('can customize the render function completely', async () => {
    const htmlNavigation = await renderMenu({
      node: twoLevels,
      render: ({ node, link }) => node.children.map(child => link({ node: child })).join('\n'),
    });
    expect(htmlNavigation).to.equal(
      [
        //
        '<a href="#">Home</a>',
        '<a href="#">About</a>',
      ].join('\n'),
    );
  });

  it('can build a nested tree', async () => {
    const components = tree.parse({
      name: 'Root',
      level: 0,
      children: [
        { name: 'Home', url: '#', level: 1 },
        {
          name: 'Components',
          url: '#',
          level: 1,
          children: [
            { name: 'Accordion', url: '#', level: 2 },
            { name: 'Button', url: '#', level: 2 },
          ],
        },
      ],
    });
    const htmlNavigation = await renderMenu({ node: components });
    expect(format(htmlNavigation)).to.equal(
      [
        '<nav aria-label="Main" class="web-menu-main">',
        '  <ul class="lvl-1">',
        '    <li><a href="#">Home</a></li>',
        '    <li>',
        '      <a href="#">Components</a>',
        '      <ul class="lvl-2">',
        '        <li><a href="#">Accordion</a></li>',
        '        <li><a href="#">Button</a></li>',
        '      </ul>',
        '    </li>',
        '  </ul>',
        '</nav>',
        '',
      ].join('\n'),
    );
  });

  it('puts classes for the active "path" and the current page', async () => {
    const componentsActive = tree.parse({
      name: 'Root',
      level: 0,
      children: [
        { name: 'Home', url: '#', level: 1 },
        {
          name: 'Components',
          url: '#',
          level: 1,
          active: true,
          children: [
            { name: 'Accordion', url: '#', level: 2 },
            { name: 'Button', url: '#', level: 2, current: true },
          ],
        },
      ],
    });
    const htmlNavigation = await renderMenu({ node: componentsActive });
    expect(format(htmlNavigation)).to.equal(
      [
        '<nav aria-label="Main" class="web-menu-main">',
        '  <ul class="lvl-1">',
        '    <li><a href="#">Home</a></li>',
        '    <li class="web-menu-active">',
        '      <a href="#">Components</a>',
        '      <ul class="lvl-2">',
        '        <li><a href="#">Accordion</a></li>',
        '        <li class="web-menu-current"><a href="#" aria-current="page">Button</a></li>',
        '      </ul>',
        '    </li>',
        '  </ul>',
        '</nav>',
        '',
      ].join('\n'),
    );
  });
});
