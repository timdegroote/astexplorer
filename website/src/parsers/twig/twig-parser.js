import React from 'react';
import defaultParserInterface from '../utils/defaultParserInterface';
import SettingsRenderer from '../utils/SettingsRenderer';
import pkg from 'melody-compiler/package.json';

const ID = 'melody-compiler';

const defaultOptions = {
  domInstructions: 'idom',
};

const settingsConfiguration = {
  fields: [
    ['domInstructions', ['idom', 'jsx']],
  ],
};

export default {
  ...defaultParserInterface,

  id: ID,
  displayName: ID,
  version: pkg.version,
  homepage: pkg.homepage,

  loadParser(callback) {
    require([
      'melody-compiler',
      'melody-extension-core',
      'melody-plugin-idom',
      'melody-plugin-jsx',
    ], ({ compile }, core, idom, jsx) => callback({
      compile,
      core: core.extension,
      idom,
      jsx,
    }));
  },

  parse({ compile, core, idom, jsx }, code, parserSettings) {
    const domInstructions = parserSettings.domInstructions === 'jsx' ?
      jsx : idom;

    return compile(null, code, core, domInstructions);
  },

  renderSettings(parserSettings, onChange) {
    return (
      <SettingsRenderer
        settingsConfiguration={settingsConfiguration}
        parserSettings={{...defaultOptions, ...parserSettings}}
        onChange={onChange}
      />
    );
  },
};
