import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import htmlPlugin from './html';
import { DefinePlugin, EnvironmentPlugin } from 'webpack';

export default (env = {}, config = {}, global = {}) => [
  new EnvironmentPlugin({
    NODE_ENV: env.environment,
    DEBUG: env.debug,
  }),
  new DefinePlugin(global),
  config.plugins && config.plugins.html && htmlPlugin(config.plugins.html),
  config.plugins && config.plugins.css && new MiniCssExtractPlugin({
    path: config.plugins.css.styles,
    filename: `styles/[name].${env.environment}.v${config.version}.css`,
  }),
].filter(plugin => plugin);
