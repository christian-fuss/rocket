function defaultList(options) {
  const { node, listItem, childCondition, listTag } = options;

  if (childCondition(node) && node.children) {
    const lvl = node.model.level;
    return `
      <${listTag} class="lvl-${lvl + 1}">
        ${node.children.map(child => listItem({ ...options, node: child })).join('')}
      </${listTag}>
    `
  }
  return '';
}

function defaultListItem({ node, list, link, ...options }) {
  const passOn = { node, list, link, ...options };

  let cssClasses = '';
  if (node.model.active) {
    cssClasses = ' class="web-menu-active" ';
  }
  if (node.model.current) {
    cssClasses = ' class="web-menu-current" ';
  }

  return `<li${cssClasses}>${link(passOn)}${node.children.length > 0 ? list(passOn) : ''}</li>`;
}

function defaultLink({ node, currentNode }) {
  const current = node === currentNode ? ' aria-current="page" ' : '';
  return `<a href="${node.model.url}"${current}>${node.model.name}</a>`;
}

async function defaultRender({ list, ...options }) {
  return `
    <nav aria-label="Main" class="web-menu-main">
      ${list({ list, ...options })}
    </nav>
  `;
}

export async function renderMenu({
  node,
  render = defaultRender,
  list = defaultList,
  listItem = defaultListItem,
  link = defaultLink,
  childCondition = () => true,
  listTag = 'ul',
  ...options
} = {}) {
  const currentNode = node.first(entry => entry.model.current === true);
  return render({ ...options, node, currentNode, list, listItem, link, childCondition, listTag });
}
