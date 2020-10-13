"use strict";

const presetEnv = require("@babel/preset-env");
const presetReact = require("@babel/preset-react");
const pluginModuleResolver = require("babel-plugin-module-resolver");

module.exports = {
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
    presetReact,
  ],
  plugins: [
    [
      pluginModuleResolver,
      {
        root: ["."],
        alias: {
          react: require.resolve("react"),
          "react-helmet": require.resolve("react-helmet"),
        },
      },
    ],
  ],
};
