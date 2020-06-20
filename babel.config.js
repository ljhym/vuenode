const prodPlugins = []

if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    // '@vue/app',
    '@vue/cli-plugin-babel/preset'
    // '@bable/plugin-syntax-dynamic-import'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    //
    ...prodPlugins
    // '@babel/plugin-syntax-dynamic-import'
  ]
}
