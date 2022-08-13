const path = require('path')
const resolve = dir => path.join(__dirname, dir)
module.exports = {
  publicPath: './',
  lintOnSave: false,
  chainWebpack: (config) => {
    config.resolve.alias.set('@', resolve('src'))
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .test(/.svg$/)
      .include.add(path.resolve(__dirname, './src/icons/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    const fileRule = config.module.rule('file')
    fileRule.uses.clear()
    fileRule
      .test(/.svg$/)
      .exclude.add(path.resolve(__dirname, './src/icons/svg'))
      .end()
      .use('file-loader')
      .loader('file-loader')
  }
}
