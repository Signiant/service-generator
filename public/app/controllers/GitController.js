angular.module('serviceGenerator').controller('GitController', ['$scope', '$rootScope', '$state', function($scope, $rootScope, $state) {

    $scope.help = {
        hasError: false,
        message: "Please create a new Bitbucket repository for this project and paste the SSH clone url below",
        error: null
    };

    var questions = {
        "schema": {
            "name": {
                "type": "string",
                "title": "What would you like to call this repository?",
                "default": $rootScope.projectName,
                "required": true
            }
        },
        "form": [
            {
                key: "name",
                type: "text",
                "validationMessage": {302: "Please enter a valid name for your bitbucket repository"}
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
            var helpMessage = "Unable to push to Bitbucket repository, please ensure that the repository is empty, the clone url is valid, and that the policy for 'pushable by' is set to all users";
        }else if(error.name == 'CreateError') {
          var helpMessage = "Unable to create Bitbucket repository";
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
