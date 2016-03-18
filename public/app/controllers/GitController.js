angular.module('serviceGenerator').controller('GitController', ['$scope','$state', function($scope, $state) {

    $scope.help = {
        hasError: false,
        message: "Please create a new Phabricator repository for this project and paste the HTTP clone url below",
        error: null
    };

    var questions = {
        "schema": {
            "repo": {
                "type": "string",
                "title": "Repository URL",
                "required": true,
                "pattern": '(http(s)?://)([\\w/.\\-_]+)(\\.git)'
            }
        },
        "form": [
            {
                key: "repo",
                type: "text",
                "validationMessage": {202: "Please enter a valid HTTP clone URL for your git repository"}
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
        }else{
            var helpMessage = "Uh-oh! We ran into problems running 'git " + error.command + "' on the local repository<br>" +
                    "Please try again.  If issues persist, try reloading the page";
        }

       $scope.help = {
           hasError: true,
           message: helpMessage,
           error: error.message
       };

        $scope.$broadcast('form:question', questions);
    });

}]);
