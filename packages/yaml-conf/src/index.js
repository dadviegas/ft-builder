import yaml from 'js-yaml';
import fs from 'fs';
import deepmerge from 'deepmerge';

const mergeMappedFields = (original, bundle = {}) => {
  Object.keys(original).forEach((key) => {
    if(bundle[key]) {
      original[key] = bundle[key];
    }
  });

  return original;
}

export default ({ file, environment, transformOptions = [], overrideConfig }) => {
  if (!file) {
    throw new Error('File undefined');
  }

  const rawYaml = fs.readFileSync(file, 'utf8');
  let transformedYmal = rawYaml;

  transformOptions.forEach((pair) => {
    transformedYmal = transformedYmal.replace(pair.key, pair.value);
  });

  var result = yaml.safeLoad(transformedYmal);

  const defaultData = result['default'] || {};
  let  environmentData = {};

  if (environment) {
    environmentData = result[environment] || {};
  }

  return mergeMappedFields(deepmerge(defaultData, environmentData), overrideConfig);
}
