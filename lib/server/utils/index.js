"use strict";

const utils = {
  isPortValid(val) {
    const port = parseInt(val, 10);

    return port >= 0;
  }
};

module.exports = utils;