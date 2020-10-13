"use strict";

const { addHook } = require("pirates");
const babel = require("@babel/core");
const presetEnv = require("@babel/preset-env");
const presetReact = require("@babel/preset-react");
const pluginTransformReactJSX = require("@babel/plugin-transform-react-jsx");
const pluginModuleResolver = require("babel-plugin-module-resolver");
const { APP_ROOT, SUPPORTED_EXTENSIONS } = require("./constants");

function generateConfig({ jsxLib }) {
  const config = {
    presets: [
      [
        presetEnv,
        {
          modules: "commonjs",
          targets: {
            node: process.versions.node,
          },
        },
      ],
    ],
    plugins: [],
  };

  const pluginModuleResolverOptions = {
    root: ["."],
    alias: { "react-helmet": require.resolve("react-helmet") },
  };

  if (jsxLib === "preact") {
    config.plugins.push([pluginTransformReactJSX, { pragma: "h" }]);
    pluginModuleResolverOptions.alias = {
      ...pluginModuleResolverOptions.alias,
      preact: require.resolve("preact"),
      "preact/compat": require.resolve("preact/compat"),
      react: require.resolve("preact/compat"),
      "react-dom": require.resolve("preact/compat"),
    };
  } else {
    config.presets.push(presetReact);
    pluginModuleResolverOptions.alias = {
      ...pluginModuleResolverOptions.alias,
      react: require.resolve("react"),
      "react-dom": require.resolve("react-dom"),
    };
  }

  config.plugins.push([pluginModuleResolver, pluginModuleResolverOptions]);

  return config;
}

const compiledFiles = new Set();

function setup({ jsxLib }) {
  const babelConfig = generateConfig({ jsxLib });

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
