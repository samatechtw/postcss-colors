const postcss = require('postcss');

const plugin = require('../');

function checkResult (result, expected) {
  expect(result.css).toEqual(expected);
  expect(result.warnings()).toHaveLength(0);
  return result;
}

function run (input, output, opts) {
  const result = postcss([plugin(opts)]).process(input, { from: '/test.css' });
  return checkResult(result, output);
}

it('bootstrap', () => {
  run(`.a { color: rgba(#00000000); }`, `.a { color: rgba(0,0,0,0); }`);
});

/*
it('works with basic hex colors', () => {
  run(`.a {
    color: rgb(#000000);
    background-color: rgba(#ffffff, 0.5);
    background: rgba(#00b2ff,.8);
    border: rgba( #fff, .2 ) 1px solid;
    border-bottom-color: rgba(  #fff , .2 );
  }`,
  `.a {
    color: rgb(0,0,0);
    background-color: rgba(255,255,255, 0.5);
    background: rgba(0,178,255,.8);
    border: rgba( 255,255,255, .2 ) 1px solid;
    border-bottom: rgba(  255,255,255 , .2 ) 1px solid;
  }`,
  );
});

it('works with linear-gradient', () => {
  run(`.a {
    background: linear-gradient(rgba(#0fab53,.1), rgba(0, 0, 0, 0.2), rgba(#FFF, 0.2));
    background-image: linear-gradient(#f00, rgba(#f00, 0.2)),
      linear-gradient(#0f0, rgba(#0f0, 0.2));
    }`,
    `.a {
      background: linear-gradient(rgba(15,171,83,.1), rgba(0, 0, 0, 0.2), rgba(255,255,255, 0.2));
      background-image: linear-gradient(#f00, rgba(255,0,0, 0.2)),
        linear-gradient(#0f0, rgba(0,255,0, 0.2));
    }`,
  );
});
*/
