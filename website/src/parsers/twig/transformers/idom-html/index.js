import compileModule from '../../../utils/compileModule';
import pkg from 'melody-idom/package.json';

const ID = 'idom-html';

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
      'melody-component',
      'melody-idom',
      'melody-runtime',
      '../../../utils/transformJSCode',
      'js-beautify',
    ], (melodyCompiler, coreExtension, idomExtension, melodyComponent, melodyIdom, melodyRuntime, toES5, beautify) => callback({
      melodyCompiler,
      coreExtension,
      idomExtension,
      melodyComponent,
      melodyIdom,
      melodyRuntime,
      toES5: toES5.default,
      beautifyHtml: beautify.html,
    }));
  },

  transform({
    melodyCompiler,
    coreExtension,
    idomExtension,
    melodyComponent,
    melodyIdom,
    melodyRuntime,
    toES5,
    beautifyHtml,
  }, transformCode, code) {
    window.process = window.process || { env: {} };
    const tplVariables = compileModule(transformCode);
    const compiledTpl = toES5(melodyCompiler.toString(
      melodyCompiler.compile(null, code, coreExtension.extension, idomExtension),
      code
    ).code);
    const tpl = compileModule(compiledTpl, {
      require(name) {
        switch(name) {
          case 'melody-idom': return melodyIdom;
          case 'melody-runtime': return melodyRuntime;
          default: throw new Error(`Cannot find module '${name}'`);
        }
      },
    });
    const element = document.createElement('div');
    const rendered = melodyIdom.patch(
      element,
      tpl.default,
      tplVariables.default
    );
    return beautifyHtml(rendered.innerHTML);
  },
};
