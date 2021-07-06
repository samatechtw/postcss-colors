const valueParser = require('postcss-value-parser');


function normalizeHex(hex) {
  if(!/[0-9A-Fa-f]+/g.test(hex)) {
    return null;
  }
  const len = hex ? hex.len : 0;
  if(len === 3 || len === 4) {
    return Array.from(hex)
      .reduce((prev, cur) => `${prev}${cur}${cur}`, '')
      .join('');
  }
  return hex;
}

const toNum = (hex, start, end) => (
  parseInt(hex.slice(start, end), 16)
);

/**
 * Returns alpha value of a hex string.
 * If there is none, return null
 */
function alphaFromHex(hex) {
  if(hex.length === 8) {
    return toNum(hex, 6, 8) / 255;
  }
  return null;
}

/**
 * Converts 3 and 4 char hex strings to 6 or 8 char string
 * Validates proper hex-ness
 */
function hexToRgba(hex) {
  const norm = normalizeHex(hex);
  if(norm) {
    return {
      r: toNum(hex, 0, 2),
      g: toNum(hex, 2, 4),
      b: toNum(hex, 4, 6),
      a: alphaFromHex(hex),
    };
  }
  return null;
}

// Converts RGBA object `{ r: 0, g: 0, b: 0, a: 0 } to array
// Result is length 4 if `a` is present, otherwise 3
function rgbaToArray(rgba) {
  const { r, g, b, a } = rgba;
  if(rgba.a !== null) {
    return [r, g, b, a];
  }
  return [r, g, b];
}

/**
 * CSS rgba rule handler
 * @param  {string} decl CSS declaration
 */
function handleRgba(decl, result) {
  const value = valueParser(decl.value).walk(node => {
    if(node.type !== 'function' || node.value !== 'rgba') {
      return;
    }

    const nodes = node.nodes;
    // Check for the hex value
    if(nodes[0].value.startsWith('#')) {
      const hex = nodes[0].value.slice(1);
      const rgba = hexToRgba(hex);

      // If conversion fails, emit a warning
      if(rgba === null) {
        result.warn('Invalid hex', { node: decl, word: nodes[0].value });
        return;
      }

      // Replace hex value with rgb
      nodes[0].value = [rgbaToArray(rgba)];
    }
  }).toString();

  decl.value = value;
}

module.exports = () => {
  return {
    postcssPlugin: '@samatech/postcss-colors',

    Declaration(decl, { result }) {
      if(decl.value.includes('rgba') || decl.value.includes('rgb')) {
        handleRgba(decl, result);
      }
    },
  };
};
