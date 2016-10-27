angular.module('my2cent.controllers')
.controller('ManageGroupCtrl', function($scope, User) {
    reset();
    $scope.addNewGroup = function(){
        if($scope.groupName.length > 0 && $scope.description.length > 0){
            $scope.showGroupDetail = true;
        }
    };
    $scope.editGroup = function(){
        $scope.groupMembers.push(User.get());
        $scope.showGroupDetail = true;
    };
    $scope.back = function(){
        reset();
    };

    function reset(){
        $scope.selectedOption = 1;
        $scope.showGroupDetail = false;
        $scope.groupName = '';
        $scope.description = '';
        $scope.groupMembers = [];
    }
});