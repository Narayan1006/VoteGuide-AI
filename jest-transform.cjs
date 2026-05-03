// jest-transform.cjs — custom transform that handles import.meta.env
// Preprocesses files to replace import.meta.env with process.env before babel
const babelJest = require('babel-jest').default;

const babelTransform = babelJest.createTransformer({
  configFile: './babel.config.cjs',
});

module.exports = {
  process(sourceText, sourcePath, options) {
    // Replace import.meta.env.VITE_XXX with empty string (safe for tests)
    const preprocessed = sourceText
      .replace(/import\.meta\.env\?\.[A-Z0-9_]+/g, 'undefined')
      .replace(/import\.meta\.env\.[A-Z0-9_]+/g, 'undefined')
      .replace(/import\.meta\.env/g, '{}');

    return babelTransform.process(preprocessed, sourcePath, options);
  },
  getCacheKey(...args) {
    return babelTransform.getCacheKey(...args) + '_vite_meta_env';
  },
};
