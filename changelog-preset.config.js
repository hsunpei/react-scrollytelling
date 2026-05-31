'use strict';

const presetPromise = require('conventional-changelog-angular');
const parserOpts = require('@gitmoji/parser-opts');

module.exports = presetPromise.then(preset => {
  preset.parserOpts = parserOpts;
  if (preset.conventionalChangelog) {
    preset.conventionalChangelog.parserOpts = parserOpts;
  }
  if (preset.recommendedBumpOpts) {
    preset.recommendedBumpOpts.parserOpts = parserOpts;
  }
  return preset;
});
