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
  // main: {
  //   render: ({ node, link }) => {

  //   }
  // }
};
