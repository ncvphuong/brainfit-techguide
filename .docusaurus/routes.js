import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', 'b2f'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '182'),
    exact: true
  },
  {
    path: '/blog/authors',
    component: ComponentCreator('/blog/authors', '0b7'),
    exact: true
  },
  {
    path: '/blog/authors/all-sebastien-lorber-articles',
    component: ComponentCreator('/blog/authors/all-sebastien-lorber-articles', '4a1'),
    exact: true
  },
  {
    path: '/blog/authors/yangshun',
    component: ComponentCreator('/blog/authors/yangshun', 'a68'),
    exact: true
  },
  {
    path: '/blog/first-blog-post',
    component: ComponentCreator('/blog/first-blog-post', '89a'),
    exact: true
  },
  {
    path: '/blog/long-blog-post',
    component: ComponentCreator('/blog/long-blog-post', '9ad'),
    exact: true
  },
  {
    path: '/blog/mdx-blog-post',
    component: ComponentCreator('/blog/mdx-blog-post', 'e9f'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', '287'),
    exact: true
  },
  {
    path: '/blog/tags/docusaurus',
    component: ComponentCreator('/blog/tags/docusaurus', '704'),
    exact: true
  },
  {
    path: '/blog/tags/facebook',
    component: ComponentCreator('/blog/tags/facebook', '858'),
    exact: true
  },
  {
    path: '/blog/tags/hello',
    component: ComponentCreator('/blog/tags/hello', '299'),
    exact: true
  },
  {
    path: '/blog/tags/hola',
    component: ComponentCreator('/blog/tags/hola', '00d'),
    exact: true
  },
  {
    path: '/blog/welcome',
    component: ComponentCreator('/blog/welcome', 'd2b'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '3d7'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'a0b'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'a4f'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '4ed'),
            routes: [
              {
                path: '/docs/brainfit-singapore',
                component: ComponentCreator('/docs/brainfit-singapore', '61f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/brainfitstudio.com/add-comment-attach-file',
                component: ComponentCreator('/docs/brainfitstudio.com/add-comment-attach-file', 'd67'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/brainfitstudio.com/delete-session-score',
                component: ComponentCreator('/docs/brainfitstudio.com/delete-session-score', '76b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/brainfitstudio.com/generate-explanation-quiz',
                component: ComponentCreator('/docs/brainfitstudio.com/generate-explanation-quiz', 'ec0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/brainfitstudio.com/import-quiz-ab',
                component: ComponentCreator('/docs/brainfitstudio.com/import-quiz-ab', 'e5f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/brainfitstudio.com/input-score-baby',
                component: ComponentCreator('/docs/brainfitstudio.com/input-score-baby', 'b7c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/brainfitstudio.com/merge-score',
                component: ComponentCreator('/docs/brainfitstudio.com/merge-score', 'b0d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/brainfitstudio.com/print-cmv2-report',
                component: ComponentCreator('/docs/brainfitstudio.com/print-cmv2-report', 'b26'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/brainfitstudio.com/print-progress-report',
                component: ComponentCreator('/docs/brainfitstudio.com/print-progress-report', '137'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/brainfitstudio.com/publish-individual-course',
                component: ComponentCreator('/docs/brainfitstudio.com/publish-individual-course', '2e5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/brainfitstudio.com/publish-progress-report',
                component: ComponentCreator('/docs/brainfitstudio.com/publish-progress-report', '1f9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/brainfitstudio.com/publish-progress-report-progress-view',
                component: ComponentCreator('/docs/brainfitstudio.com/publish-progress-report-progress-view', '84b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/brainfitstudio.com/setup-schedule-course',
                component: ComponentCreator('/docs/brainfitstudio.com/setup-schedule-course', 'bf9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/brainfitstudio.com/subgame-management',
                component: ComponentCreator('/docs/brainfitstudio.com/subgame-management', 'e7a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/brainfitstudio.com/suspend-student',
                component: ComponentCreator('/docs/brainfitstudio.com/suspend-student', '826'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/tutorial---basics',
                component: ComponentCreator('/docs/category/tutorial---basics', '20e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/tutorial---extras',
                component: ComponentCreator('/docs/category/tutorial---extras', '9ad'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', '61d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/prime-technology',
                component: ComponentCreator('/docs/prime-technology', 'd1b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorial-basics/congratulations',
                component: ComponentCreator('/docs/tutorial-basics/congratulations', '458'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorial-basics/create-a-blog-post',
                component: ComponentCreator('/docs/tutorial-basics/create-a-blog-post', '108'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorial-basics/create-a-document',
                component: ComponentCreator('/docs/tutorial-basics/create-a-document', '8fc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorial-basics/create-a-page',
                component: ComponentCreator('/docs/tutorial-basics/create-a-page', '951'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorial-basics/deploy-your-site',
                component: ComponentCreator('/docs/tutorial-basics/deploy-your-site', '4f5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorial-basics/markdown-features',
                component: ComponentCreator('/docs/tutorial-basics/markdown-features', 'b05'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorial-extras/manage-docs-versions',
                component: ComponentCreator('/docs/tutorial-extras/manage-docs-versions', '978'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorial-extras/translate-your-site',
                component: ComponentCreator('/docs/tutorial-extras/translate-your-site', 'f9a'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '2e1'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
