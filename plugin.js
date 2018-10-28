const HtmlWebpackPlugin = require('html-webpack-plugin')

let jsFiles = []

class MyPlugin {
  apply(compiler) {
    const self = this
    compiler.hooks.watchRun.tap('MyPlugin', compiler => {
      if (jsFiles.length > 1) {
        jsFiles = []
      }
    })
    compiler.hooks.compilation.tap('MyPlugin', compilation => {
      // Staic Plugin interface |compilation |HOOK NAME | register listener
      HtmlWebpackPlugin.getHooks &&
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
          'MyPlugin', // <-- Set a meaningful name here for stacktraces
          (data, cb) => {
            if (data.plugin.assetJson) {
              jsFiles.push(
                JSON.parse(data.plugin.assetJson).filter(
                  v => v.indexOf('.js') > -1
                )
              )
            }
            let createStr = function(arr) {
              let s = ''
              if (arr) {
                let c = filename => {
                  return ` ___load('${filename}');`
                }
                s = arr.map(v => c(v)).join(' ')
              }
              return s
            }
            // console.log(jsFiles)
            if (jsFiles && jsFiles.length > 0) {
              jsFiles = jsFiles.sort((a, b) => {
                if (a[0].indexOf('loose') > 0) {
                  return 1
                }
                return 0
              })
              data.html = data.html.replace(
                '__injected__',
                `+function () {
      "use strict"
      try {
        eval('new class {}');
        ${createStr(jsFiles[0])}
      } catch(e) {
        console.error(e);
        ${createStr(jsFiles[1])}
      }
    }()`
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
