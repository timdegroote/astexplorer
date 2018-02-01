import pkg from 'melody-plugin-idom/package.json';

const ID = 'idom';

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
      'melody-plugin-idom',
    ], ({ compile, toString }, core, idom) => callback({
      toString,
      compile,
      core: core.extension,
      idom,
    }));
  },

  transform({toString, compile, core, idom}, transformCode, code) {
    return toString(compile(null, code, core, idom), code);
  },
};
