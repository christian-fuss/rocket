export const defaultPresets = {
  header: {
    render: ({ node, link, ...options }) => {
      return `
        <nav role="navigation" aria-label="Header" class="web-menu-header">
          ${node.children.map(child => link({ node: child, ...options })).join('\n')}
        </nav>
      `;
    },
  },
  headerWithoutNav: {
    render: ({ node, link, ...options }) =>
      node.children.map(child => link({ node: child, ...options })).join('\n'),
  },
  breadcrumb: {
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
    render: async ({ list, node, currentNode, ...options }) => {
      const activeLevelTwo = currentNode.getPath()[1] || node;
      return `
        <nav role="navigation" aria-label="main" class="web-menu-main">
          ${list({ node: activeLevelTwo, list, currentNode, ...options })}
        </nav>
      `;
    },
    link: ({ node, currentNode }) => {
      if (node.children.length > 0) {
        return `<span>${node.model.name}</span>`;
      }
      const current = node === currentNode ? ' aria-current="page" ' : '';
      return `<a href="${node.model.url}"${current}>${node.model.name}</a>`;
    },
  },
};
