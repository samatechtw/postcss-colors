# PostCSS Colors

[PostCSS](https://github.com/postcss/postcss) plugin that provides various color related transforms.


## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev @samatech/postcss-colors
```

**Step 2:** Check your project for existing PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, first add it according to [PostCSS docs].

**Step 3:** Add the plugin to plugins list:

```javascript
module.exports = {
  plugins: require('@samatech/postcss-colors')({
    // Options
  }),
};
```

[PostCSS docs]: https://github.com/postcss/postcss#usage


## Options

## TODO

## Inspiration

https://github.com/madeleineostoja/postcss-hexrgba
https://github.com/hudochenkov/postcss-hexrgba#migrate-to-postcss-8
