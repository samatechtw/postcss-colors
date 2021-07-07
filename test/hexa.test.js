const { run, runError } = require('./util');

describe('Tests for converting 4/8 character hex to rgba', () => {

  it('converts basic hexa', () => {
    run(`.a {
      color: black;
      color: #0f0;
      color: #0f0f;
      color: #0000ff;
      color: #cc00ff00;
      content: "#ffff";
      content: "#0000ff00";
    }`,
    `.a {
      color: black;
      color: #0f0;
      color: rgba(0,255,0,1);
      color: #0000ff;
      color: rgba(204,0,255,0);
      content: "#ffff";
      content: "#0000ff00";
    }`,
    );
  });

  it('converts multiple in the same decl', () => {
    run(`.a {
      background: #9d9 linear-gradient(#9823f8a9, #9823f834);
      background: linear-gradient(#9823f8a9, #9823f834);
    }`,
    `.a {
      background: #9d9 linear-gradient(rgba(152,35,248,0.6627), rgba(152,35,248,0.2039));
      background: linear-gradient(rgba(152,35,248,0.6627), rgba(152,35,248,0.2039));
    }`,
    );
  });

  it('fails on invalid hex', () => {
    runError(
      '.a { color: #0z01; }',
      'Invalid hex',
    );
    runError(
      '.a { color: #00000z01; }',
      'Invalid hex',
    );
  });
});
