"use strict";

const { addHook } = require("pirates");
const babel = require("@babel/core");
const babelConfig = require("./babelConfig");
const { APP_ROOT, SUPPORTED_EXTENSIONS } = require("./constants");

const compiledFiles = new Set();

function setup() {
  return addHook(
    (code, filename) => {
      const { code: compiledCode } = babel.transform(code, {
        filename,
        root: APP_ROOT,
        babelrc: false,
        ...babelConfig,
      });

      return compiledCode;
    },
    {
      exts: SUPPORTED_EXTENSIONS.map((ext) => `.${ext}`),
      ignoreNodeModules: true,
    }
  );
}

function flushCache() {
  for (const filePath of Array.from(compiledFiles.values())) {
    delete require.cache[require.resolve(filePath)];
  }

  compiledFiles.clear();
}

module.exports = {
  setup,
  flushCache,
};
