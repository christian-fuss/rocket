export default {
  docsDir: 'my-menu/',
  presets: {
    myMenu: {
      async render() {
        return '--- My Menu ---';
      },
    },
  },
};
