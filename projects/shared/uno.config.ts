import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['full', 'w-full h-full'],
    ['flex-center', 'flex items-center justify-center'],
    ['absolute-x-center', 'absolute left-1/2 translate-x--1/2'],
    ['absolute-y-center', 'absolute top-1/2 translate-y--1/2'],
    ['absolute-center', 'absolute-x-center absolute-y-center'],
    ['text-xs', 'text-12px leading-18px'],
    ['text-sm', 'text-14px leading-20px'],
    ['text-md', 'text-16px leading-24px'],
    ['text-lg', 'text-18px leading-26px'],
    ['text-xl', 'text-20px leading-30px'],
    ['text-2xl', 'text-24px leading-36px'],
    ['text-3xl', 'text-28px leading-42px'],
    ['text-4xl', 'text-32px leading-48px'],
    ['text-5xl', 'text-40px leading-54px'],
    ['text-6xl', 'text-48px leading-60px'],
    ['subtitle-1', 'text-lg font-600'],
    ['subtitle-2', 'text-md font-600'],
    ['subtitle-3', 'text-sm font-500'],
    ['subtitle-4', 'text-xs font-500'],
  ],
  rules: [
    [/^flex-([\.\d]+)$/, ([_, num]) => ({ flex: `${num} ${num} 0%` })],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
    presetTypography(),
    presetWebFonts({}),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    colors: {
      primary: { 1: '#0068B8', 2: '#257EDA', 3: '#004C9A', 4: '#E3EFFD' },
      grey: { 1: '#FFFFFF', 2: '#F7F9FC', 3: '#E4E7EC', 4: '#D0D5DD', 5: '#98A2B3', 6: '#667185', 7: '#475367', 8: '#344054', 9: '#1D2739' },
      alerts: {
        success: { 1: '#0F973D', 2: '#04802E', 3: '#E7F6EC' },
        error: { 1: '#D42620', 2: '#BA110B', 3: '#FBEAE9' },
        warning: { 1: '#F3A218', 2: '#AD6F07', 3: '#FEF6E7' },
      },
      white: { 0: '#FFFFFF00', 1: '#FFFFFF1A', 2: '#FFFFFF33', 3: '#FFFFFF4D', 4: '#FFFFFF66', 5: '#FFFFFF80', 6: '#FFFFFF99', 7: '#FFFFFFB3', 8: '#FFFFFFCC', 9: '#FFFFFFE6', 10: '#FFFFFF' },
      black: { 0: '#00000000', 1: '#0000001A', 2: '#00000033', 3: '#0000004D', 4: '#00000066', 5: '#00000080', 6: '#00000099', 7: '#000000B3', 8: '#000000CC', 9: '#000000E6', 10: '#000000' },
    },
    breakpoints: {
      xs: '320px',
      sm: '600px',
      md: '960px',
      lg: '1240px',
      xl: '1920px',
    },
  },
})
