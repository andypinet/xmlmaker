const HtmlWebpackPlugin = require('html-webpack-plugin')

let jsFiles = []
class MyPlugin {
  apply(compiler) {
    const self = this
    compiler.hooks.compilation.tap('MyPlugin', compilation => {
      // Staic Plugin interface |compilation |HOOK NAME | register listener
      HtmlWebpackPlugin.getHooks &&
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
          'MyPlugin', // <-- Set a meaningful name here for stacktraces
          (data, cb) => {
            if (data.plugin.assetJson) {
              jsFiles = jsFiles.concat(
                JSON.parse(data.plugin.assetJson).filter(v => v.indexOf('.js') > -1)
              )
            }
            console.log(jsFiles)
            if (jsFiles) {
              data.html = data.html.replace(
                '__injected__',
                `
                +function () {
                  "use strict"
                  try {
                    eval('new class {}')
                    ___load('${jsFiles[0]}')
                  } catch(e) {
                    console.error(e)
                    ___load('${jsFiles[1]}')
                  }
                }()
                `
              )
            }
            // Tell webpack to move on
            cb(null, data)
          }
        )
    })
  }
}

module.exports = MyPlugin
