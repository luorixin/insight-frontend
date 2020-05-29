module.exports = {
  publicPath: './',
  productionSourceMap: false,
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
    proxy: {
      '/proxyApi': {
        target: 'http://127.0.0.1:8081',
        changeOrigin: true,
        pathRewrite: {
          '^/proxyApi': '/'
        }
      }
    }
  }
}
