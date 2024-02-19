import path from 'node:path'
import process from 'node:process'
import Unocss from 'unocss/vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import { defineConfig, loadEnv } from 'vite'
import Layouts from 'vite-plugin-vue-layouts'
import generateSitemap from 'vite-ssg-sitemap'
import VueMacros from 'unplugin-vue-macros/vite'
import AutoImport from 'unplugin-auto-import/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import WebfontDownload from 'vite-plugin-webfont-dl'
import Components from 'unplugin-vue-components/vite'

export default ({ mode }: any) => {
  const minio = loadEnv(mode, path.relative(__dirname, '../gateway'), 'MINIO')
  const desktop = loadEnv(mode, path.relative(__dirname, '../gateway'), 'DESKTOP')

  process.env = {
    ...process.env,
    VITE_MINIO_ENDPOINT_INTERNAL: minio.MINIO_ENDPOINT_INTERNAL,
    VITE_MINIO_ENDPOINT_EXTERNAL: minio.MINIO_ENDPOINT_EXTERNAL,
    VITE_MINIO_PORT: minio.MINIO_PORT,
    VITE_MINIO_AK: minio.MINIO_AK,
    VITE_MINIO_SK: minio.MINIO_SK,
    VITE_MINIO_USE_SSL: minio.MINIO_USE_SSL,
    VITE_MINIO_BUCKET_DATA: minio.MINIO_BUCKET_DATA,
    VITE_DESKTOP_REMOTE_POST: desktop.DESKTOP_REMOTE_PORT,
    VITE_DESKTOP_REMOTE_SAFE: desktop.DESKTOP_REMOTE_SAFE,
    ...loadEnv(mode, path.relative(__dirname, '../shared')),
    VITE_MODE: mode,
  }

  return defineConfig({
    base: process.env.VITE_BASE_ADMIN,
    define: {
      'process.env': {},
    },

    server: {
      host: '0.0.0.0',
      port: Number.parseInt(process.env.VITE_PORT_ADMIN || '3333', 10),
      proxy: {
        [process.env.VITE_API_BASE as string]: {
          target: process.env.VITE_PROXY_TARGET,
          changeOrigin: true,
          rewrite: path => path.replace(new RegExp(`^${process.env.VITE_API_BASE}`), ''),
          secure: false,
        },
      },
    },

    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'src')}/`,
      },
    },

    plugins: [
      VueMacros({
        plugins: {
          vue: Vue({
            include: [/\.vue$/, /\.md$/],
          }),
        },
      }),

      // https://github.com/hannoeru/vite-plugin-pages
      Pages({
        extensions: ['vue', 'md'],
      }),

      // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
      Layouts(),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          '@vueuse/head',
          '@vueuse/core',
        ],
        dts: 'src/types/auto-imports.d.ts',
        dirs: [
          'src/constants',
          'src/composables',
          'src/utils',
          '../shared/api',
          '../shared/composables',
          '../shared/constants',
          '../shared/utils/**',
        ],
        vueTemplate: true,
      }),

      // https://github.com/antfu/unplugin-vue-components
      Components({
        // allow auto load markdown components under `./src/components/`
        extensions: ['vue', 'md'],
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: 'src/types/components.d.ts',
        dirs: [
          'src/components',
          '../shared/components',
        ],
      }),

      // https://github.com/antfu/unocss
      // see uno.config.ts for config
      Unocss(),

      // https://github.com/feat-agency/vite-plugin-webfont-dl
      WebfontDownload(),

      // https://github.com/webfansplz/vite-plugin-vue-devtools
      VueDevTools(),
    ],

    // https://github.com/antfu/vite-ssg
    ssgOptions: {
      script: 'async',
      formatting: 'minify',
      crittersOptions: {
        reduceInlineStyles: false,
      },
      onFinished() {
        generateSitemap()
      },
    },

    ssr: {
      // TODO: workaround until they support native ESM
      noExternal: ['workbox-window', 'lodash'],
    },
  })
}
