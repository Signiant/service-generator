angular.module('serviceGenerator').controller('FormController', ['$scope', function($scope){
    $scope.isWaiting = false;

    $scope.formSubmit = function(schemaForm){
        $scope.$broadcast('schemaFormValidate');
        if(schemaForm.$valid){
            $scope.isWaiting = true;
            $scope.$emit('form:answer', $scope.model);
        }
    };

    $scope.$on('form:question', function(event, questions){
        $scope.isWaiting = false;
        $scope.schema = {
            type: "object",
            properties: questions.schema
        };

        if("form" in questions){
            $scope.form = questions.form
        }else{
            $scope.form = [
                "*",
                {   type: "section",
                    htmlClass: "buttonGroup",
                    "items": [
                        {
                            type: "submit",
                            title: "Submit"
                        },
                        {
                            type: "button",
                            title: "Cancel",
                            style: 'btn-danger',
                            "onClick": "$emit('cancel');"
                        }
                    ]
                }
            ]
        }

        $scope.model = {};
    });

}]);
