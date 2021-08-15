export function renderBreadcrumb({ node, listItem, ...options }) {
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
}
