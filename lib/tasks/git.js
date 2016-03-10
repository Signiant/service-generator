var simpleGit = require('simple-git');
var async = require('async');
var path = require('path');
var rimraf = require('rimraf');

module.exports = function PushRepo(projectDir, remote, done){
    git = simpleGit(projectDir).silent(true);
    async.series([
        function(callback){
            git.init(function(err, data){
                handleResponse(err, data, "Init", callback);
            });
        }, function(callback){
            git.addRemote('origin', remote, function(err, data){
                handleResponse(err, data, "RemoteAdd", callback);
            });
        },
        function(callback){
            git.add(['.'], function(err, data){
                handleResponse(err, data, "Add", callback);
            });
        },
        function(callback){
            git.commit('Initial Commit from Generator', function(err, data){
                handleResponse(err, data, "Commit", callback);
            });
        },
        function(callback){
            git.push('origin', 'master', function(err, data){
                handleResponse(err, data, "Push", callback);
             });
         }
    ], function(err, result){
        if(err){
            console.log("Error completing git task, failed on step " + err.command);
            console.log(err.message);
            rimraf.sync(path.join(projectDir, '.git'));
        }else{
            console.log("Successfully pushed git repo");
        }
        done(err, result);
    });
};

function handleResponse(err, data, name,  callback){
    if(err){
        callback(new GitError(name, err));
        return;
    }
    callback(null, data);
}

function GitError(stage, message){
    this.task = "git";
    this.name = stage + 'Error';
    this.message = message != null ? message : "No error message provided";
    this.command = stage.split(/(?=[A-Z])/).join(" ").toLowerCase();
    this.stack = (new Error()).stack;
}