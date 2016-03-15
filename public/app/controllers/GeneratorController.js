angular.module('serviceGenerator').controller('GeneratorController', ['$scope', '$state', 'QuestionService', function($scope, $state, QuestionService) {

    $scope.$watch(function(){ return QuestionService.questions }, function(questions){
        if(questions){
            console.log('Questions');
            $scope.$broadcast('form:question', questions);
        }else{
            console.log('None');
        }
    });

    $scope.$on('form:answer', function(event, answers){
        $scope.$emit('yo:answer', JSON.stringify(answers));
    });

    $scope.$on('yo:success', function(){
       $state.go('git');
    });

}]);
