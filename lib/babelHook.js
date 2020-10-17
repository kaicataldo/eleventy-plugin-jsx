"use strict";

const { addHook } = require("pirates");
const babel = require("@babel/core");
const { generateConfig } = require("./babelConfig");
const { APP_ROOT } = require("./constants");

const compiledFiles = new Set();

function setup() {
  return addHook(
    (code, filename) => {
      const { code: compiledCode } = babel.transform(code, {
        filename,
        root: APP_ROOT,
        babelrc: false,
        ...generateConfig(filename),
      });

      return compiledCode;
    },
    {
      exts: [".js", ".jsx", ".ts", ".tsx"],
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
