# eleventy-plugin-jsx

A plugin that allows you to use JSX as a templating language for Eleventy. This is currently experimental, and relies on unstable Eleventy APIs.

This plugin is purposefully limited to using JSX as a templating language for static sites. If you're interested in a more Gatsby or Next-like experience with hydration of interactive components on the client, check out [`eleventy-plugin-react`](https://github.com/kaicataldo/eleventy-plugin-react)!

## Installation

```sh
npm install eleventy-plugin-jsx
```

or

```sh
yarn add eleventy-plugin-jsx
```

## Usage

First, add the plugin to your config. The plugin will automatically compile any files given to it with a `.jsx` extension using Babel and server-side render the page.

```js
// .eleventy.js

const eleventyJsx = require("eleventy-plugin-jsx");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyJsx);

  return {
    dir: {
      input: "src/pages",
    },
  };
};
```

```js
// src/pages/index.jsx

import React from "react";
import ParentLayout from "../layouts/ParentLayout";
import ChildComponent from "../components/ChildComponent";

// `props` is the data provided by Eleventy.
export default function IndexPage(props) {
  return (
    <ParentLayout>
      <h1>Welcome!</h1>
      <ChildComponent url={props.page.url} />
    </ParentLayout>
  );
}
```

All the content will be rendered into the `body`. React Helmet can be used to alter the `head`.

Data for each page is passed as props to the entrypoint page component. You can learn more about using data in Eleventy [here](https://www.11ty.dev/docs/data/).

You can now run Eleventy to build your site!

```sh
# Requires ELEVENTY_EXPERIMENTAL flag to run

ELEVENTY_EXPERIMENTAL=true npx @11ty/eleventy
```

**Note**: Since this plugin currently relies on experimental Eleventy APIs, running the build requires using the `ELEVENTY_EXPERIMENTAL=true` CLI flag.
