angular.module('serviceGenerator').controller('SelectController', [ '$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {

   // $scope.$on('$includeContentLoaded', function(){});
    $scope.$on('form:answer', function(event, answers){
        answers = JSON.stringify(answers);
        $scope.$emit('service:answer', answers);
        $state.go('generate');

    });


    $scope.$on('service:question', function(event, questions){
        $scope.$broadcast('form:question', questions);
    });
}]);