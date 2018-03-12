var auth = require('../../config/auth.json').jenkins;
var jenkins = require('jenkins')('http://' + auth.user + ':' + auth.token + '@' + auth.baseUrl);
var async = require('async');

module.exports = {
    run: run,
    fixName: fixName
};


function run(service, name, repo, done){
    jobName = name +  '-build-master';
    viewName = name + '-branches';
    if(repo.substr(-1) != '/') repo += '/';
    // syncName = 'SyncGitBranchesWithJenkins-' + repo.split('/').slice(-2, -1)[0];
    syncName = 'SyncGitBranchesWithJenkins-' + name;

    async.series([
        function(callback) {
            jenkins.job.copy('template_' + service + '-build-master', jobName, handleResponse.bind(null, 'MainCopy', name, callback));
        },
        function(callback){
            async.waterfall([
                function(callback){
                    jenkins.job.config(jobName, function(err, data){
                        if(err){
                            callback(err);
                            return;
                        }
                        data = data.replace(/((http:\/\/)(.+)(.git))/, repo);
                        callback(null, data);
                    });
                },
                function(data, callback){
                    jenkins.job.config(jobName, data, callback);
                }
            ], handleResponse.bind(null, 'MainConfig', name, callback)
            );
        },
        function(callback) {
            jenkins.job.enable(jobName, handleResponse.bind(null, 'MainEnable', name, callback));
        },
        function(callback) {
            jenkins.view.create(name + '-branches', 'hudson.plugins.nested_view.NestedView', handleResponse.bind(null, 'ViewCreate', name, callback));
        },
        function(callback){
            jenkins.job.copy('SyncGitBranchesWithJenkins-TEMPLATE', syncName, handleResponse.bind(null, 'SyncCopy', name, callback));
        },
        function(callback){
            async.waterfall([
              function(callback) {
                  jenkins.job.config(syncName, function (err, data) {
                      if (err) {
                          callback(err);
                          return;
                      }
                      data = data.replace("##REPO##", repo.replace("http://", "ssh://git@")).replace("##JOB_PREFIX##", name).replace("##VIEW##", viewName);
                      callback(null, data);
                  });
              },
              function(data, callback){
                  jenkins.job.config(syncName, data, callback);
              }
            ], handleResponse.bind(null, 'SyncConfig', name, callback)
            );
        },
          function(callback) {
              jenkins.job.enable(syncName, handleResponse.bind(null, 'SyncEnable', name, callback));
          },

    ],
    function(err, results){
        if(err){
            console.log('Failed');
            done(err, null);
        }else{
           console.log("Successfully created jenkins job");
            var jobUrl = auth.baseUrl + 'job/' + jobName;

            console.log("Job URL ", jobUrl);
            done(null, jobUrl);
        }
    });
}

function fixName(name, type, callback){
    name = name.replace(/[- ]+/g, '_');
    if(type == 'microservice' && name.indexOf('_service') < 0)
        name += '_service';
    callback(name);
}


function handleResponse(step, name, callback, err, data){
    console.log(step);
    if(err){
        callback(new JenkinsError(step, name, err.message));
        return;
    }
    callback(null, data);
}

function JenkinsError(step, jobName, message){
    this.task = 'jenkins';
    this.name = step + "Error";
    this.job = jobName;
    this.message = message;
    this.stack = (new Error()).stack;

}