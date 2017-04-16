// @flow

const utils = {
  isPortValid(val: any) {
    const port = parseInt(val, 10);

    return port >= 0;
  },
};

module.exports = utils;
