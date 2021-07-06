# PostCSS Colors

[PostCSS](https://github.com/postcss/postcss) plugin that provides various color related transforms.

## Features

- Converts 4 and 8 character hex colors to rgba according to the [CSS Color Module Spec](https://www.w3.org/TR/css-color-4/#hex-notation)
  - With 4 characters, the first three expand as a 3 character hex color would. The 4th expands similarly, and is used to calculate alpha with `0` as the lowest and `f` as the highest.
  - 8 character colors use the first six for the color, and the last two for alpha. For example, if the last two characeters are `cc` the alpha value is `204 / 255 = 0.8`.
```css
color: #00ff00cc;
color: #0f0c;

/* Converts to */
color: rgba(0, 255, 0, 0.8);
color: rgba(0, 255, 0, 0.8);
```

- Converts 3 and 6 character hex colors within `rgb` and `rgba` functions to valid syntax

```css
color: rgba(#0f0, 0.8);
color: rgba(#00ff00, 0.8);

/* Converts to */
color: rgba(0, 255, 0, 0.8);
color: rgba(0, 255, 0, 0.8);
```

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

This original purpose behind this plugin was to have an actively maintained version of [`postcss-hexrgba`](https://github.com/madeleineostoja/postcss-hexrgba). That plugin has had Postcss8 support implemented in a [pull request](https://github.com/hudochenkov/postcss-hexrgba#migrate-to-postcss-8) for some time, and it seems unlikely to be merged.

Since the abstractions for converting hex to rgba are similar to those in [`postcss-color-hex-alpha`](https://github.com/postcss/postcss-color-hex-alpha), it made sense to include that functionality as well.

Adding a custom alpha syntax for hex colors may be considered, similar to [`postcss-color-alpha`](https://github.com/avanes/postcss-color-alpha)
