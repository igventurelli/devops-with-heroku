'use strict';

var app = require('../../server/server');

const schema = {
  "name": "Request",
  "options": {
    "idInjection": false,
    "pg": {
      "schema": "gypz",
      "table": "request"
    }
  },
  "properties": {
    "id": {
      "type": "Number",
      "required": true,
      "id": 1
    },
    "customerName": {
      "type": "String",
      "required": true,
      "length": 100
    }
  }
};

module.exports = function(Request) {
  var ds = app.dataSources.pg
  ds.createModel(schema.name, schema.properties, schema.options);
  ds.autoupdate(schema.name, function (err, result) {
    ds.discoverModelProperties('request', function (err, props) {
    });
  });
};
