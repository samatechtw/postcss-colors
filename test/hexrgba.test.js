const { run, runError } = require('./util');

describe('Tests for converting hex within rgb/rgba functions', () => {

  it('works with basic hex colors', () => {
    run(`.a { color: rgba(#000000, 1); }`, `.a { color: rgba(0,0,0, 1); }`);
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
      border-bottom-color: rgba(  255,255,255 , .2 );
    }`,
    );
  });

  it('tests 3 char hex colors', () => {
    run(`.a {
      color: rgba(#fff, 0.5);
      background: rgba(#000, .8);
      border: 1px solid rgba(#f00, 0.2) !important;
    }`,
    `.a {
      color: rgba(255,255,255, 0.5);
      background: rgba(0,0,0, .8);
      border: 1px solid rgba(255,0,0, 0.2) !important;
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

  it('does not mess with svg links', () => {
    run(
      'svg { clip-path: url(#SVGID_1_); }',
      'svg { clip-path: url(#SVGID_1_); }',
    );
  });

  it('fails when hex has wrong number of characters', () => {
    runError(
      '.a { color: rgba(#abcd, 1); }',
      'Only 3 or 6 character hex allowed in rgba',
    );
    runError(
      '.a { color: rgba(#aabbccdd); }',
      'Only 3 or 6 character hex allowed in rgba',
    );
    runError(
      '.a { color: rgb(#abcd); }',
      'Only 3 or 6 character hex allowed in rgba',
    );
    runError(
      '.a { color: rgb(#1); }',
      'Only 3 or 6 character hex allowed in rgba',
    );
  });

  it('fails with invalid hex', () => {
    runError(
      '.a { color: rgb(#zzz); }',
      'Invalid hex',
    );
  });
});
