import { Menu } from '@web/menu';
import { addPlugin } from 'plugins-manager';

class MyMenu extends Menu {
  static type = 'myMenu';

  async render() {
    return '--- My Menu ---';
  }
}

export default {
  docsDir: 'my-menu/',
  setupPlugins: [
    addPlugin(MyMenu),
  ]
};
