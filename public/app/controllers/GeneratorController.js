angular.module('serviceGenerator').controller('GeneratorController', ['$scope', '$state', function($scope, $state) {

    $scope.$on('yo:question', function(event, questions){
        $scope.$broadcast('form:question', questions);
    });

    $scope.$on('form:answer', function(event, answers){
        $scope.$emit('yo:answer', JSON.stringify(answers));
    });

    $scope.$on('yo:success', function(){
       $state.go('git');
    });

}]);
