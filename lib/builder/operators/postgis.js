'use strict';

var vsprintf = require("sprintf-js").vsprintf;

var operators = {};

operators.gis_dwithin = function (name, value) {
  var values = value.split(',');
  value = parseInt(values.pop());
  // 5 decimal gives enough precision to the meter
  values = values.map(x => parseFloat(x).toFixed(5));

  return {
    operation: "ST_DWithin(" +
      [name, vsprintf("'POINT(%.5f %.5f)'", [values[0], values[1]]), '?'].join(',') +
    ")",
    value: value
  };
};

module.exports = operators;
