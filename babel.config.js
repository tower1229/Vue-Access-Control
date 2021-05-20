module.exports = {
  // presets: [
  //   '@vue/app'
  // ]
  //   根据.browserslistrc 配置加载polyfill，需同时打开main.js首行注释
  presets: [
      [
          '@vue/cli-plugin-babel/preset',
          {
              useBuiltIns: 'entry'
          }
      ]
  ]
}