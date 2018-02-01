import pkg from 'melody-plugin-jsx/package.json';

const ID = 'jsx';

export default {
  id: ID,
  displayName: ID,
  version: pkg.version,
  homepage: pkg.homepage,

  defaultParserID: 'melody-compiler',

  loadTransformer(callback) {
    require([
      'melody-compiler',
      'melody-extension-core',
      'melody-plugin-jsx',
    ], ({ compile, toString }, core, jsx) => callback({
      toString,
      compile,
      core: core.extension,
      jsx,
    }));
  },

  transform({toString, compile, core, jsx}, transformCode, code) {
    return toString(compile(null, code, core, jsx), code);
  },
};
