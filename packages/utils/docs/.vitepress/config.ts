import process from 'node:process'
import { defineConfig } from 'vitepress'
import utilStructure from './utils.json'

const base = process.env.NODE_ENV === 'production' ? '/utils/docs/' : '/'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base,
  lastUpdated: true,
  title: 'System Utils',
  description: 'Utils of system',
  srcDir: 'src',
  head: [['link', { rel: 'icon', href: `${base}logo.svg` }]],
  themeConfig: {
    logo: '/logo.svg',
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: 'Home', link: '/' }],
    search: {
      provider: 'local',
    },

    sidebar: [
      ...utilStructure,

      {
        text: '新增与维护',
        link: '/contribute',
      },
      {
        text: '待办事项',
        link: '/roadmap',
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/liuqi6908/monorepo-template',
      },
    ],
  },
})
