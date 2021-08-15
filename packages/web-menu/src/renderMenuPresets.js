// const defaultPresets = {
//   header: {
//     render: ({ node, link }) => {
//       return `
//         <nav role="navigation" aria-label="Header" class="web-menu-header">
//           ${node.children.map(child => link({ node: child })).join('\n')}
//         </nav>
//       `;
//     },
//   },
//   headerWithoutNav: {
//     render: ({ node, link }) => node.children.map(child => link({ node: child })).join('\n'),
//   },
// };

// export async function renderMenuPresets(node, ) {

// const presets = { ...defaultPresets, ...options.presets };

// for (const node of tree.all()) {
//   if (node.model.menus && node.model.menus.length > 0) {
//     setCurrent(tree, node);

//     for (const menu of node.model.menus.reverse()) {
//       const options = presets[menu.name] ? presets[menu.name] : {};
//       const menuString = await renderMenu({ node: tree, ...options });
