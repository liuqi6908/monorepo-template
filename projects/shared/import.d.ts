interface ImportMeta {
  env: ImportMetaEnv
}

declare module '*?raw' {
  const src: string
  export default src
}