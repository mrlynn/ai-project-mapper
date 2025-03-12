// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
 const sidebars = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'doc',
      id: 'getting-started',
      label: 'Getting Started',
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/basic-usage',
        'guides/templates',
        'guides/customization',
        'guides/llm-workflow',
      ],
    },
    {
      type: 'category',
      label: 'API',
      items: [
        'api/api-reference',
      ],
    },
    {
      type: 'category',
      label: 'Concepts',
      items: [
        'concepts/architecture',
        'concepts/terminology',
      ],
    },
    {
      type: 'category',
      label: 'Examples',
      items: [
        'examples/cli-examples',
        'examples/api-examples',
      ],
    },
  ],
};

export default sidebars;
