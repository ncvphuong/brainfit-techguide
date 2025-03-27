// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'BraintFit Tech Guide',
  tagline: 'BraintFit Technical Documentation',
  favicon: 'img/BrainFit.png',

  // Set the production url of your site here
  url: 'https://brainfit-guide-saurus.powerdigital.sg/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
      }
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/BrainFit.png',
      navbar: {
        title: 'BraintFit Tech Guide',
        logo: {
          alt: 'BraintFit Tech Guide Logo',
          src: 'img/BrainFit.png',
        },
        

           
        
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Products',
            items: [
              {
                label: 'CogMap',
                href: 'http://cm.brainfitstudio.com/',
              },
              {
                label: 'Smart Moves',
                href: 'https://smartmove.brainfitstudio.com/',
              },
              {
                label: 'Smart Workout',
                href: 'https://smartworkout.brainfitstudio.com/',
              }
            ],
          },
          {
            title: 'E-learning',
            items: [
              {
                label: 'Resource site',
                href: 'https://resources.brainfitstudio.com/',
              }
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'AceyBrain IOS',
                href: 'https://apps.apple.com/au/app/brainfit-aceybrain/id6477822292',
              },
              {
                label: 'AceyBrain Android',
                href: 'https://play.google.com/store/apps/details?id=com.brainfit.aceybrain&pcampaignid=web_share',
              }
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} <a href="https://brainfit.com.sg/" target="_blank" rel="noopener noreferrer">BrainFit</a> <br>Operates by <a href="https://powerdigital.sg/" target="_blank" rel="noopener noreferrer">Power Digital</a>`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
