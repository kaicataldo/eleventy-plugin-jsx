"use strict";

const path = require("path");
const presetEnv = require("@babel/preset-env");
const presetReact = require("@babel/preset-react");
const presetTypeScript = require("@babel/preset-typescript");
const pluginModuleResolver = require("babel-plugin-module-resolver");

const IS_TYPESCRIPT_REGEXP = /\.tsx?/;

function generateConfig(filename) {
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
      [
        presetReact,
        {
          runtime: "automatic",
        },
      ],
    ],
    plugins: [
      [
        pluginModuleResolver,
        {
          alias: {
            react: path.dirname(require.resolve("react")),
            "react-helmet": require.resolve("react-helmet"),
          },
        },
      ],
    ],
  };

  if (IS_TYPESCRIPT_REGEXP.test(filename)) {
    config.presets.push(presetTypeScript);
  }

  return config;
}

module.exports = { generateConfig };
