"use strict";

const { Helmet } = require("react-helmet");
const babelHook = require("./babelHook");
const { generateHtml } = require("./generateHtml");
const { requireFromDir } = require("./moduleUtils");
const { APP_ROOT, SUPPORTED_EXTENSIONS } = require("./constants");

function render(component, data, jsxLib) {
  if (jsxLib === "preact") {
    const { h } = require("preact");
    const render = require("preact-render-to-string");
    const Component = h(component, data, null);
    return render(Component);
  } else {
    const React = require("react");
    const ReactDOM = require("react-dom/server");
    const Component = React.createElement(component, data, null);
    return ReactDOM.renderToString(Component);
  }
}

module.exports = function eleventyPluginReact(
  eleventyConfig,
  { jsxLib = "react" } = {}
) {
  if (jsxLib !== "preact" && jsxLib !== "react") {
    throw new Error(
      'jsxLib must be a string with the value of "preact" or "react"'
    );
  }

  for (const ext of SUPPORTED_EXTENSIONS) {
    eleventyConfig.addTemplateFormats(ext);
    eleventyConfig.addExtension(ext, {
      // The module is loaded in the compile method below.
      read: false,
      getData: true,
      getInstanceFromInputPath(inputPath) {
        return requireFromDir(inputPath, APP_ROOT).default;
      },
      compile(_str, inputPath) {
        return async (data) => {
          const componentExport = requireFromDir(inputPath, APP_ROOT).default;
          const mergedData = {
            functions: this.config.javascriptFunctions,
            ...data,
          };

          const bodyContent = render(componentExport, mergedData, jsxLib);
          const helmet = Helmet.renderStatic();
          const html = await generateHtml({
            bodyContent,
            helmet,
          });

          babelHook.flushCache();

          return html;
        };
      },
    });
  }

  // TODO: When released, use beforeBuild and afterBuild to revert
  // this hook for long-lived processes.
  // https://www.11ty.dev/docs/events/
  babelHook.setup({ jsxLib });
};
