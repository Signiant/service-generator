var async = require('async');
var auth = require('../../config/auth.json').phabricator;
var Conduit = require('../conduit');
var conduit = new Conduit(auth.baseUrl, auth.token);

module.exports = function(name, callsign, done){
  var uris = {}; // Repository URIs

  async.series([
    function(callback){
      // Create an empty git repository on phabricator
      var params = {
        transactions: [
          {
            type: "vcs",
            value: "git"
          },
          {
            type: "name",
            value: name
          },
          {
            type: "callsign",
            value: callsign
          },
          {
            type: "status",
            value: "active"
          }
        ]
      };

      conduit.exec('diffusion.repository.edit', params, function(err, res){
        if(err) return callback(new PhabricatorError('Create', err.message));
        if(res.statusCode != 200) return callback(new PhabricatorError('create'), res.statusMessage);
        if(res.body.error_code) return callback(new PhabricatorError('Create', res.body.error_info));

        callback();
      })
    },
    function(callback){
      // Get the repository URIs
      var params = {
        constraints: {
          callsigns: [callsign]
        },
        attachments: {
          uris: true
        }
      };

      conduit.exec('diffusion.repository.search', params, function(err, res){
        if(err) return callback(new PhabricatorError('Uri', err.message));
        if(res.statusCode != 200) return callback(new PhabricatorError('create'), res.statusMessage);
        if(res.body.error_code) return callback(new PhabricatorError('Uri', res.body.error_info));

        // Get the callsign http uris from the response
        var uriObj = res.body.result.data[0].attachments.uris.uris.find(obj => obj.fields.builtin.protocol == "http" && obj.fields.builtin.identifier == "callsign");

        uris.git = uriObj.fields.uri.display;
        uris.web = "http://" + uriObj.fields.uri.normalized;

        callback();
      })
    }
  ], function(err){
    if(err) {
      console.log("Error completing phabricator task, failed on step " + err.command);
      console.log(err.message);
      return done(err);
    }
    done(null, uris);
  });
};

function PhabricatorError(stage, message){
  this.task = "phabricator";
  this.name = stage + 'Error';
  this.message = message != null ? message : "No error message provided";
  this.command = stage.split(/(?=[A-Z])/).join(" ").toLowerCase();
  this.stack = (new Error()).stack;
}

