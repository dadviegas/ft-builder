import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const babelConf = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: [
    'thread-loader',
    {
      loader: 'babel-loader',
    },
  ],
};

const cssConf = (env) => ({
  test   : /\.(scss|css)$/,
  resolve: { extensions: [".scss", ".css"] },
  use: [
    env.environment === 'production' ? MiniCssExtractPlugin.loader : "style-loader",
    // 'thread-loader',
    { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1, module: true } },
    { loader: 'postcss-loader', query: { config: { path: 'postcss.config.js' } }},
    { loader: 'sass-loader', options: { sourceMap: true } },
  ],
});

const filesConf = {
  test: /\.(svg|png|jpg|gif)$/i,
  use: [
    'thread-loader',
    {
      loader: 'url-loader',
      options: {
        limit: 10000,
        outputPath: '/images/',
        name: '[name].[hash:8].[ext]',
      },
    },
  ],
}

export default (env, config) => console.log({env, config})  || ({
  rules: [
    babelConf,
    config.plugins && config.plugins.css && cssConf(env),
    filesConf,
  ].filter(m => m),
});
