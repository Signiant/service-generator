var request = require('request');

// Simple Conduit API client
function Conduit(host, token){
  if(host.substr(-1) != '/') host += '/';
  this.api = host + 'api/';
  this.token = token;
}

Conduit.prototype.exec = function(action, params,  callback){
  params.__conduit__ = { token: this.token };

  var body = {
    json: true,
    form: {
      output: 'json',
      params: JSON.stringify(params)
    }
  };

  request.post(this.api + action, body, callback);
};

module.exports = Conduit;


