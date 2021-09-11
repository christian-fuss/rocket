/** @typedef {import('../types/main').renderFn} renderFn */

export const defaultPresets = {
  header: {
    /**
     * @param {renderFn} options
     * @returns {string}
     */
    render: ({ node, link, ...options }) => {
      return `
        <nav aria-label="Header" class="web-menu-header">
          ${node.children.map(child => link({ node: child, ...options })).join('\n')}
        </nav>
      `;
    },
  },
  headerWithoutNav: {
    /**
     * @param {renderFn} options
     * @returns {string}
     */
    render: ({ node, link, ...options }) =>
      node.children.map(child => link({ node: child, ...options })).join('\n'),
  },
  breadcrumb: {
    /**
     * @param {renderFn} options
     * @returns {string}
     */
    render: ({ node, listItem, ...options }) => {
      const current = node.first(node => node.model.current === true);
      const nodePath = current.getPath();
      const breadcrumbItem = node =>
        listItem({ node, listItem, ...options, childCondition: () => false });
      return `
        <nav aria-label="Breadcrumb" class="web-menu-breadcrumb">
          <ol>
            ${nodePath.map(node => breadcrumbItem(node)).join('\n')}
          </ol>
        </nav>
      `;
    },
  },
  main: {
    label: 'Main',
    /**
     * @param {renderFn} options
     * @returns {Promise<string>}
     */
    render: async ({ list, node, currentNode, ...options }) => {
      const activeLevelTwo = currentNode.getPath()[1] || node;
      return `
        <nav aria-label="main" class="web-menu-main">
          ${list({ node: activeLevelTwo, list, currentNode, ...options })}
        </nav>
      `;
    },
    /**
     * @param {renderFn} options
     * @returns {string}
     */
    link: ({ node, currentNode }) => {
      if (node.children.length > 0) {
        const lvl = node.model.level;
        return lvl < 3 ? `<span>${node.model.name}</span>` : '';
      }
      const current = node === currentNode ? ' aria-current="page" ' : '';
      return `<a href="${node.model.url}"${current}>${node.model.name}</a>`;
    },
    /**
     * @param {renderFn} options
     * @returns {string}
     */
    list: options => {
      const { node, listItem, childCondition, listTag, currentNode } = options;
      const open = currentNode.getPath().includes(node) ? 'open' : '';

      if (childCondition(node) && node.children) {
        const lvl = node.model.level;
        return `
          ${lvl > 2 ? `<details ${open}><summary>${node.model.name}</summary>` : ''}
            <${listTag} class="lvl-${lvl + 1}">
              ${node.children.map(child => listItem({ ...options, node: child })).join('')}
            </${listTag}>
          ${lvl > 2 ? `</details>` : ''}
        `;
      }
      return '';
    },
  },
  tableOfContents: {
    navLabel: 'Table of Contents',
    navHeader: '<h2>Contents</h2>',
    /** @param {string} nav */
    navWrapper: nav => `<aside>${nav}</aside>`,
    /**
     * @param {renderFn} options
     * @returns {Promise<string>}
     */
    render: async ({ list, currentNode, navHeader, navLabel, navWrapper, ...options }) => {
      if (
        currentNode.model.tableOfContentsNode &&
        currentNode.model.tableOfContentsNode.children.length > 0
      ) {
        const navString = `
          ${navHeader}
          <nav aria-label="${navLabel}" class="web-menu-tableOfContents">
            ${list({
              ...options,
              node: currentNode.model.tableOfContentsNode,
              list,
              currentNode,
              listTag: 'ol',
            })}
          </nav>
        `;
        return navWrapper(navString);
      }
      return '';
    },
  },
  blog: {
    ordering: 'descending',
    renderDescription: node => {
      if (node.model.subHeading) {
        return `
          <div class="description">
            <a href="${node.model.url}" tabindex="-1">
              <p>${node.model.subHeading}</p>
            </a>
          </div>        
        `;
      }
      return '';
    },
    /**
     * @param {renderFn} options
     * @returns {string}
     */
    render: ({ currentNode, renderDescription }) => {
      return `
        <div class="web-menu-blog">
          ${currentNode.children
            .map(
              child => `
                <article class="post">
                  <a href="${child.model.url}">
                    <h2>${child.model.name}</h2>
                  </a>
                  ${renderDescription(child)}
                </article>
              `,
            )
            .join('')}
        </div>
      `;
    },
  },
};
