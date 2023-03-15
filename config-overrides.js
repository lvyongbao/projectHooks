const { override, overrideDevServer, fixBabelImports, addLessLoader, addWebpackAlias } = require('customize-cra');
const path = require('path');
const theme = require('./theme');

const paths = require('react-scripts/config/paths')
paths.appBuild = path.join(path.dirname(paths.appBuild),'./dist');

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

const removeSassLoader = config => {
  const { rules } = config.module;
  const rule = rules.find(_rule => !!_rule.oneOf);
  if (!rule) {
    return config;
  }
  rule.oneOf = rule.oneOf.filter(item => {
    const testStr = String(item.test);
    return !/sass/.test(testStr);
  });
  return config;
};

module.exports = {
  webpack: override(webpackconfig => {
    webpackconfig.output.globalObject = 'window';
    webpackconfig.output.publicPath = process.env.NODE_ENV === 'development' ? '/' : '/micro/settlement/';
    return webpackconfig;
  },
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    }),
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: theme,
      cssLoaderOptions: {}, // .less file used css-loader option, not all CSS file.
      cssModules: {
        localIdentName: process.env.NODE_ENV === 'development' ? '[local]--[hash:base64]' : '[hash:base64]', // if you use CSS Modules, and custom `localIdentName`, default is '[local]--[hash:base64:5]'.
      },
      lessModules: {
        
      }
    }),
    removeSassLoader,
    // 配置路径访问快捷键 @/xxx
    addWebpackAlias({
      '@': resolve('src'),
      '@assets': resolve('src/assets'),
      '@components': resolve('src/components'),
      '@utils': resolve('src/utils'),
      '@views': resolve('src/views'),
      "@hooks": resolve('src/hooks'),
    }),
  ),
  devServer: overrideDevServer(config => {
    config.headers = {
      'Access-Control-Allow-Origin': '*',
    };
    config.historyApiFallback = true;
    config.hot = false;
    config.watchContentBase = false;
    config.liveReload = false;
    return config;
  }),
}
