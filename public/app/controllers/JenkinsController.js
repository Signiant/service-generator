angular.module('serviceGenerator').controller('JenkinsController', ['$scope', '$state', function($scope, $state) {
    $scope.help = {
        hasError: false,
        message: '',
        error: null
    };

    var questions = {
        "schema": {
            "name": {
                "type": "string",
                "title": "Jenkins Job Name",
                "required": true,
                "pattern": '^[a-zA-Z0-9_]+$'
            }
        }
    };

    var nameForm = [
        {
            key: 'name',
            type: "text",
            "validationMessage": {202: "Jenkins job name must consist only of letters, numbers, and underscores"}
        },
        {
            type: "submit",
            title: "Submit"
        }
    ];

    var otherForm = [

        {
            "type": "actions",
            "items": [
                {
                    "type": "button",
                    "style": "btn-warning",
                    "title": "Skip",
                    "onClick": "$parent.jenkinsSkip()"
                },
                {
                    "type": "submit",
                    "style": "btn-danger",
                    "title": "Retry"
                }
            ]
        }
    ];

    $scope.jenkinsSkip = function(){

        $scope.$emit('jenkins:skip');
    };

    $scope.$on('jenkins:error', function(event, error){
        if(error.name == 'CopyError') {
            console.log('copy error');
            var helpMessage = 'Unable to copy jenkins job, a job with the name ' + error.job + ' already exists<br>' +
                    "Please enter a different name for the jenkins job";
            questions.schema.name.default = '';
            questions["form"] = nameForm;
        }else {
            var helpMessage = 'Uh-oh! There was a problem setting up the jenkins job<br>' +
                'You can either try again or skip this step and create the job yourself';
            questions.schema.name.default = error.job;
            questions["form"] = otherForm;
        }

        $scope.$on('$includeContentLoaded', function(event, templateName){
            $scope.$broadcast('form:question', questions);
            console.log("Content loaded")
        });

        $scope.$on('form:answer', function (event, answers) {
            $scope.$emit("jenkins:answer", answers.name);
            $scope.help.hasError = false;
        });

        $scope.help = {
            hasError: true,
            message: helpMessage,
            error: error.message
        };
    });
}]);