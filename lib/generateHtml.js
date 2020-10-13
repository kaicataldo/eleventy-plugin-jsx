"use strict";

const dedent = require("dedent");

function removeHelmetDataAttribute(str) {
  return str.replace(/data-react-helmet="true"/g, "").replace(/ {2,}/g, " ");
}

async function generateHtml({ bodyContent, helmet }) {
  return dedent`
    <!doctype html>
      <html ${removeHelmetDataAttribute(helmet.htmlAttributes.toString())}>
      <head>
        ${removeHelmetDataAttribute(helmet.title.toString())}
        ${removeHelmetDataAttribute(helmet.meta.toString())}
        ${removeHelmetDataAttribute(helmet.link.toString())}
      </head>
      <body ${removeHelmetDataAttribute(helmet.bodyAttributes.toString())}>
        <div id="content">
          ${bodyContent}
        </div>
      </body>
    </html>
  `;
}

module.exports = {
  generateHtml,
};
