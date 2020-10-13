"use strict";

const React = require("react");
const ReactDOM = require("react-dom/server");
const { Helmet } = require("react-helmet");
const babelHook = require("./babelHook");
const { generateHtml } = require("./generateHtml");
const { requireFromDir } = require("./moduleUtils");
const { APP_ROOT, SUPPORTED_EXTENSIONS } = require("./constants");

module.exports = function eleventyPluginReact(eleventyConfig) {
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
          const Component = React.createElement(
            componentExport,
            mergedData,
            null
          );
          const bodyContent = ReactDOM.renderToString(Component);
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
  babelHook.setup();
};
