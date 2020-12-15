module.exports = {
  publicPath: './',
  productionSourceMap: false,
  transpileDependencies: ['vue-echarts', 'resize-detector'],
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
    proxy: {
      '/testproxyApi': {
        target: 'http://10.11.60.202:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/testproxyApi': '/'
        }
      },
      '/proxyApi': {
        target: 'http://127.0.0.1:8083',
        changeOrigin: true,
        pathRewrite: {
          '^/proxyApi': '/'
        }
      }
    }
  }
}
