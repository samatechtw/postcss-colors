const valueParser = require('postcss-value-parser');


const PRECISION = 10000;

function normalizeHex(hex) {
  if(!/^[0-9A-Fa-f]{3,}$/g.test(hex)) {
    return null;
  }
  const len = hex ? hex.length : 0;
  if(len === 3 || len === 4) {
    return Array.from(hex)
      .reduce((prev, cur) => `${prev}${cur}${cur}`, '');
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
    const alpha = toNum(hex, 6, 8) / 255;
    return Math.round(alpha * PRECISION) / PRECISION;
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
      r: toNum(norm, 0, 2),
      g: toNum(norm, 2, 4),
      b: toNum(norm, 4, 6),
      a: alphaFromHex(norm),
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
 * rgb/rgba rule handler
 * @param {string} decl CSS declaration
 */
function handleRgba(decl, result) {
  const value = valueParser(decl.value).walk(node => {
    if(node.type !== 'function' || !node.value.startsWith('rgb')) {
      return;
    }
    const nodes = node.nodes;
    // Check for the hex value
    if(nodes[0].value.startsWith('#')) {
      const hex = nodes[0].value.slice(1);
      if(hex.length !== 3 && hex.length !== 6) {
        result.warn(
          'Only 3 or 6 character hex allowed in rgba',
          { node: decl, word: nodes[0].value },
        );
        return;
      }
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

/**
 * Hexa to rgba handler
 * @param {string} decl CSS declaration
 */
function handleHexa(decl, result) {
  const ignore = {};
  const value = valueParser(decl.value).walk(node => {
    // Special case for `url(#ref)`
    if(node.type === 'function' && node.value === 'url') {
      ignore[node.nodes[0].value] = true;
      return;
    }
    if(ignore[node.value] || node.type !== 'word' || !node.value.startsWith('#')) {
      return;
    }
    const hex = node.value.slice(1);
    if(hex.length !== 4 && hex.length !== 8) {
      return;
    }
    const rgba = hexToRgba(hex);

    // If conversion fails, emit a warning
    if(rgba === null) {
      result.warn('Invalid hex', { node: decl, word: node.value });
      return;
    }

    // Replace node's value with rgba
    node.value = 'rgba';
    node.type = 'function';
    node.nodes = [{ value: [rgbaToArray(rgba)] }];
  }).toString();

  decl.value = value;

}

module.exports = () => {
  return {
    postcssPlugin: '@samatech/postcss-colors',

    Declaration(decl, { result }) {
      if(decl.value.includes('rgb')) {
        handleRgba(decl, result);
      } else if(decl.value.includes('#')) {
        handleHexa(decl, result);
      }
    },
  };
};
