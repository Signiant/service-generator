angular.module('serviceGenerator').controller('GitController', ['$scope', '$rootScope', '$state', function($scope, $rootScope, $state) {

    $scope.help = {
        hasError: false,
        message: "Please create a new Phabricator repository for this project and paste the HTTP clone url below",
        error: null
    };

    var questions = {
        "schema": {
            "name": {
                "type": "string",
                "title": "What would you like to call this repository?",
                "default": $rootScope.projectName,
                "required": true
            },
            "callsign": {
                "type": "string",
                "title": "What callsign would you like to use to represent this repository?",
                "description": "Short, all caps string identifier for your repository",
                "pattern": "^[A-Z]+$",
                "default": $rootScope.projectName.replace(/[aeiou_\s-]/g, '').toUpperCase(),
                "maxLength": 32,
                "required": true
            }
        },
        "form": [
            {
                key: "name",
                type: "text",
                "validationMessage": {302: "Please enter a valid name for your phabricator repository"}
            },
            {
                key: "callsign",
                type: "text",
                "validationMessage": {
                    302: "Please enter a valid callsign for your repository",
                    201: "Repository callsign must be 32 characters or less",
                    202: "Repository callsign must be all CAPS!"}
            },
            {
                type: "section",
                htmlClass: "buttonGroup",
                items: [
                    {
                        type: "submit",
                        title: "Submit"
                    },
                    {
                        type: "button",
                        title: "Cancel",
                        style: 'btn-danger',
                        onClick: "$emit('cancel');"
                    }
                ]
            }
        ]
    };

    $scope.$on('$includeContentLoaded', function(event, templateName){
        $scope.$broadcast('form:question', questions);
    });

    $scope.$on('form:answer', function (event, answers) {
        $scope.$emit("git:answer", JSON.stringify(answers));
    });

    $scope.$on('git:success', function () {
        $state.go('jenkins');
    });

    $scope.$on('git:error', function (event, error) {
        if(error.name == 'PushError') {
            var helpMessage = "Unable to push to Phabricator repository, please ensure that the repository is empty, the clone url is valid, and that the policy for 'pushable by' is set to all users";
        }else if(error.name == 'CreateError') {
          var helpMessage = "Unable to create Phabricator repository, your callsign may already be in use.";
        }else{
            var helpMessage = "Uh-oh! We ran into problems initializing your repository. Please try again.  If issues persist, try reloading the page";
        }

       $scope.help = {
           hasError: true,
           message: helpMessage,
           error: error.message
       };

        $scope.$broadcast('form:question', questions);
    });

}]);
