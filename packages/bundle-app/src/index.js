import merge from 'webpack-merge';
import getRepoInfo from 'git-repo-info';

import getModules from './modules';
import getPlugins from './plugins';
import logger from './logger';
import snakeCase from 'snake-case';

const info = getRepoInfo();
const internalGlobal = {
  GIT_AUTHOR: info.author,
  GIT_BRANCH: info.branch,
  GIT_ABBREVIATE_DSHA: info.abbreviatedSha,
  GIT_SHA: info.sha,
};

const convertKey = (str) => snakeCase(str).toUpperCase();

const convertKeys = (obj) => {
  const defineVariables = {};
  const variables = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (typeof value === 'string' || value instanceof String) {
      defineVariables[convertKey(key)] = JSON.stringify(value);
    } else {
      defineVariables[convertKey(key)] = value;
    }

    variables[convertKey(key)] = value;
  });

  return {
    defineVariables,
    variables,
  }
}

export default ({ env = {}, args = {}, webpackConf = {}, config = {} }) => {
  const global = {
    ...internalGlobal,
    ...config.global,
    ...args,
  }
  const converted = convertKeys(global);

  const internalWebpackConf = {
    mode: env.environment,
    devtool: webpackConf.devTool || 'source-map',
    module: getModules(env, config),
    plugins: getPlugins(env, config, converted.defineVariables),
    optimization: {
      splitChunks: {
          chunks: 'all',
      },
      runtimeChunk: true,
      usedExports: true,
    },
    resolve: {
      extensions: [".js", ".jsx", ".json"],
    },
  };

  logger.objLog('Environment Variables', env);
  logger.objLog('Define Variables', converted.variables);

  return merge(internalWebpackConf, webpackConf);
};
