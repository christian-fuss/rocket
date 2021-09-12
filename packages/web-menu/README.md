# Web Menu

Gathers information about your static html pages and creates menus for it.

## Features

- Very fast (uses wasm & html streaming for parsing)
- Comes with multiple pre defined menu like header, nested, breadcrumb, tableOfContents, ...
- Menus are accessible and fully style able
- Works with any tool that outputs html
- Typically reduces the tools build time by offloading menu generation
- Flexible rendering system for menus via 4 plain javascript functions (render, list, listItem, link)
- Low dependency count

## Installation

```
npm i -D @web/menu
```

## Usage

```
npx web-menu
```

## Usage as a html user

Write your html as you normally would but don't include any menus.
Where you want to place a menu put `<web-menu type="header"></web-menu>`.
When you run `npx web-menu` it will insert the menu into this tag.

## Usage as a @web/dev-server users

Run it in parallel?

## Usage as an eleventy user

Run it in parallel?

## Usage as as ???

- astro
- next.js
- hugo
- gatsby
- jenkyll
- nuxt
- hexo
- docusaurus

## Configuration file

You can put configurations at

- `config/web-menu.js`
- `config/web-menu.mjs`
- `web-menu.config.js`
- `web-menu.config.mjs`

```js
export default {
  docsDir: 'my-menu/',
  outputDir:
}
```

<details>
  <summary>Types of the config file</summary>
  <div>
    TODO: inline types 
  </div>
</details>

## Add your own menu type

```js
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
```

## Menu types

1. **header**

   - starts at level 1
   - flat list of links

   ```html
   <nav aria-label="Header">
     <a href="/about/">About</a>
     <a href="/components/">Components</a>
   </nav>
   ```

2. **nested**

   - starts at level 1
   - nested ul/li list

   ```html
   <nav aria-label="Header">
     <ul>
       <li><a href="/about/">About</a></li>
     </ul>
   </nav>
   ```

3. **nestedWithCategoryHeading**

   - starts at level 2
   - nested ul/li list
   - level 2 becomes a not clickable category heading if it has children
   - level 3+ becomes a `detail/summary` element needing a click if it has children
   - ideally used in combination with `header`

4. **breadcrumb**

   - starts at current level and goes back to the root
   - flat ol/li list

   ```html
   <nav aria-label="Breadcrumb">
     <ol>
       <li class="web-menu-active"><a href="/">Home</a></li>
       <li class="web-menu-active"><a href="/components/">Components</a></li>
       <li class="web-menu-current">
         <a href="/components/button-blue/" aria-current="page">Button Blue</a>
       </li>
     </ol>
   </nav>
   ```

5. **tableOfContents**

   - lists the headlines of the current page in a hierarchy
   - nested ol/li list

   ```html
   <aside>
     <h2>Contents</h2>
     <nav aria-label="Table of Contents">
       <ol class="lvl-2">
         <li>
           <a href="#every-headline">Every headline</a>
           <ol class="lvl-3">
             <li><a href="#will-be">will be</a></li>
           </ol>
         </li>
         <li>
           <a href="#listed">listed</a>
         </li>
       </ol>
     </nav>
   </aside>
   ```
